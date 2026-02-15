const {openai} = require("../services/ai");
const ErrorResponse = require("../utils/errorResponse");
const {generateSummary, findSimilarAnime} = require("../services/ai");

const getRecommendation= async (req, res, next) => {
  try {
    const {message} = req.body;

    // validate message =>
    //  Prevents from empty messages(waste of Ai credits)
    //  Prevent super long messages (AI has token limits)
    // Give users helpful error messages
    if(!message || message.trim()===""){
      throw new ErrorResponse("Please provide a message", 400);
    }
    if(message.length>500){
      throw new ErrorResponse("Message too long. Maximum 500 characters",400);
    }

    // Call OpenRouter AI => CONCEPT: Prompt Engineering
    const response = await openai.chat.completions.create({
      model:'mistralai/mistral-7b-instruct',
      messages:[
        {
          role:'system', //Sets AI's personality and behavior
          content:'You are an anime recommendation expert. Provide helpful, concise recommendations based on user preferences. Format your response in a clear, readable way.'
        },
        {
          role:'user',
          content:message
        }
      ],
      temperature:0.7, // creativity level
      max_tokens:500,
    });

    const aiRecommendation = response.choices[0].message.content; //Extracts the AI's actual text response

    // Send Response
    return res.status(200).json({
      success:true,
      recommendation:aiRecommendation, //The AI's response text
    })

  } catch (error) {
    console.error("Error in getRecommendations:", error.message);
    next(error);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const {title, synopsis, genres}= req.body;
    if(!title || !synopsis){
      throw new ErrorResponse("Title and synopsis are required", 400);
    }
    if(synopsis.trim().length<50){
      throw new ErrorResponse("Synopsis must be at least 50 characters", 400);
    }
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new ErrorResponse("Genres must be a non-empty array", 400);
    }

    //Timeout Protection
    const timeoutPromise = new Promise((_, reject) =>{
      setTimeout(() => {
        reject(new ErrorResponse("AI request timeout", 504))
      }, 10000);
    });
    // DO NOT await here
    const aiPromise = generateSummary(title, synopsis, genres);

    // “Run both promises simultaneously and take whichever finishes first.”
    const summary = await Promise.race([aiPromise, timeoutPromise]);
    return res.status(200).json({
      status:true,
      summary
    })

  } catch (error) {
    console.error("Error in getSummary:", error.message);
    next(error);
  }
};

const getSimilarAnime = async (req, res, next) => {
  try {
    const {title, synopsis, genres} = req.body;
    
    console.log("📥 Received request for similar anime:", title);
    
    if(!title || !synopsis){
      throw new ErrorResponse("Title and synopsis are required", 400);
    }
    if(synopsis.length<50){
      throw new ErrorResponse("Synopsis must be at least 50 characters", 400);
    }
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new ErrorResponse("Genres must be a non-empty array", 400);
    }

    console.log("✅ Validation passed, calling AI...");

    const timeoutPromise= new Promise((_, reject) =>{
      setTimeout(() => {
        reject(new ErrorResponse("AI request timeout", 504));
      }, 15000); // Increased to 15 seconds
    })
    const aiPromise= findSimilarAnime(title, synopsis, genres);

    const aiRecommendations = await Promise.race([aiPromise, timeoutPromise]);
    
    console.log("✅ AI returned", aiRecommendations.length, "recommendations");
    
    // Now search Jikan for each recommended anime to get full data
    const {jikan, delay, transformAnime} = require("../services/jikan");
    const enrichedAnimes = [];
    
    console.log("🔍 Searching Jikan for each anime...");
    
    for (const rec of aiRecommendations) {
      try {
        console.log(`  Searching for: ${rec.title}`);
        await delay(1000); // Rate limiting
        const response = await jikan.get("/anime", {
          params: {
            q: rec.title,
            limit: 1
          }
        });
        
        if (response.data?.data && response.data.data.length > 0) {
          const animeData = transformAnime(response.data.data[0]);
          // Add AI data to the anime object
          enrichedAnimes.push({
            ...animeData,
            aiReason: rec.reason,
            aiMatchScore: rec.matchScore
          });
          console.log(`  ✅ Found: ${animeData.title.english}`);
        } else {
          console.log(`  ❌ Not found in Jikan: ${rec.title}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to fetch anime: ${rec.title}`, error.message);
        // Skip this anime if Jikan fails
      }
    }
    
    console.log("✅ Returning", enrichedAnimes.length, "enriched animes");
    
    return res.status(200).json({
      status:true,
      similarAnimes: enrichedAnimes
    })

  } catch (error) {
    console.error("❌ Error in getSimilarAnime:", error.message);
    console.error("❌ Full error:", error);
    next(error);
  }
}


module.exports={
  getRecommendation,
  getSummary,
  getSimilarAnime
}