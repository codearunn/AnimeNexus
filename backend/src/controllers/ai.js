const {openai} = require("../services/ai");
const ErrorResponse = require("../utils/errorResponse");

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

module.exports={
  getRecommendation,
}