const {openai} = require("../services/ai");
const ErrorResponse = require("../utils/errorResponse");
const {generateSummary, findSimilarAnime} = require("../services/ai");
const cache = require("../services/cache");
const {jikan, delay, transformAnime} = require("../services/jikan");

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

    // Caching Mechanism
    const cacheKey = `summary:${title
                      .toLowerCase()
                      .trim()
                      .replace(/\s+/g,"-")}`; // Unique Identifier

    const cached= cache.get(cacheKey);

    // if Already cached return immediately => Zero AI cost
    if(cached){
      console.log("Cache Hit:", cacheKey);
      return res.status(200).json({
        success:true,
        summary:cached,
        cached:true,
      })
    };


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
    if(!summary){
      throw new ErrorResponse("AI returned empty summary", 500);
    }

    //STORE IN CACHE
    cache.set(cacheKey, summary, 86400); // 24 hour
    // 60 sec
    // × 60 min
    // × 24 hr
    // = 86400 seconds

    return res.status(200).json({
      success:true,
      summary,
      cached:false,
    });

  } catch (error) {
    console.error("Error in getSummary:", error.message);
    next(error);
  }
};

// Receives anime data → asks AI for similar anime → fetches real data from Jikan API → merges results → sends to frontend
const getSimilarAnime = async (req, res, next) => {
  try {
    const {title, synopsis, genres} = req.body;

    if(!title || !synopsis){
      throw new ErrorResponse("Title and synopsis are required", 400);
    }
    if(synopsis.length<50){
      throw new ErrorResponse("Synopsis must be at least 50 characters", 400);
    }
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      throw new ErrorResponse("Genres must be a non-empty array", 400);
    }

    //caching
    const cacheKey = `similar:${title.toLowerCase().replace(/[^\w]+/g,"-")}`; // string.replace(pattern, replacement)
    const cached = cache.get(cacheKey);
    if(cached){
      console.log("Cache Hit:", cacheKey);
      return res.status(200).json({
        success:true,
        similarAnimes:cached,
        cached:true,
      });
    }

    const timeoutPromise= new Promise((_, reject) =>{
      setTimeout(() => {
        reject(new ErrorResponse("AI request timeout", 504));
      }, 15000); // 15 seconds
    });
    const aiPromise= findSimilarAnime(title, synopsis, genres);

    const aiRecommendations = await Promise.race([aiPromise, timeoutPromise]);

    if (!aiRecommendations || aiRecommendations.length === 0) {
      throw new ErrorResponse("AI returned no recommendations", 500);
    }


    // ---------- JIKAN FETCH ----------
    const enrichedAnimes = await Promise.all( // Run multiple async operations in parallel and wait until all finish
      aiRecommendations.map(async (rec) => { // map(async () => {}) returns an array of Promises. => That’s why we wrap with:Promise.all()
        try {
          await delay(500);

          const response = await jikan.get("/anime", {
            params: { q: rec.title, limit: 1 }
          });

          if (response.data?.data?.length) {
            const animeData = transformAnime(response.data.data[0]);
            return {
              ...animeData,
              aiReason: rec.reason, // Data enrichment
              aiMatchScore: rec.matchScore
            };
          }
        } catch {
          return null;
        }
      })
    );

    // After Promise.all => enriched = [
    //                     {...Naruto},
    //                     null,
    //                     {...Bleach},
    //                     null
    //                     ]. Because some may fail.

    //.filter(x => Boolean(x))
    const filtered = enrichedAnimes.filter(Boolean); // This removes falsy values: [ obj, null, obj, null ] becomes [ obj, obj ]

    // STORE IN CACHE
    cache.set(cacheKey, filtered, 86400);

    return res.status(200).json({
      success: true,
      similarAnimes: filtered,
      cached: false
    });

  } catch (error) {
    console.error("Error in getSimilarAnime:", error.message);
    next(error);
  }

  // AI recommends titles
  //         ↓
  // map() creates async fetch tasks
  //         ↓
  // Promise.all runs all tasks in parallel
  //         ↓
  // Each task fetches from Jikan API
  //         ↓
  // transformAnime formats data
  //         ↓
  // merge AI reason + score
  //         ↓
  // null returned for failed fetches
  //         ↓
  // filter(Boolean) removes failed results
  //         ↓
  // final clean anime list returned
}


module.exports={
  getRecommendation,
  getSummary,
  getSimilarAnime
}