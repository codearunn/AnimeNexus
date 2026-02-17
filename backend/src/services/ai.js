require("dotenv").config();
const openAI = require("openai");
const ErrorResponse = require("../utils/errorResponse");

// Helper function for better error messages
const getErrorMessage = (error) => {
  if (error.code === 'ECONNREFUSED') {
    return 'AI service unavailable. Please try again later.';
  }
  if (error.response?.status === 429) {
    return 'Rate limit exceeded. Please wait a moment.';
  }
  if (error.response?.status === 401) {
    return 'AI API key invalid. Please contact support.';
  }
  if (error.response?.status === 503) {
    return 'AI service temporarily unavailable. Please try again.';
  }
  return 'AI request failed. Please try again.';
};

// Creates a new AI client instance
const openai = new openAI({
  apiKey:process.env.OPENROUTER_API_KEY,
  baseURL:'https://openrouter.ai/api/v1',
});

const testAIConnection = async () => {
  try {
    console.log("Testing AI connection...");

    const response = await openai.chat.completions.create({
      model: 'mistralai/mistral-7b-instruct',
      messages: [ // AI sees this as the conversation history
        {
          role: 'user', //message from you (not AI)
          content: 'Recommend 3 popular anime titles with brief descriptions.'
        }
      ],
    });

    const aiMessage = response.choices[0].message.content;
    // response.choices array of possible responses
    // [0] = first (and usually only) response
    // .message.content = the actual text
    return aiMessage;

  } catch (error) {
    console.error("AI connection failed:", error.message);
  }
};

const generateSummary = async (title, synopsis, genres) => {
  try {
    const prompt= `
      You are a professional anime critic.

      Write a short engaging summary for anime fans.

      Rules:
      - 2"-"3 sentences only
      - No bold text
      - No markdown
      - No emojis
      - No dramatic language
      - Clear and concise tone
      - Focus on premise + appeal

      Anime:
      Title: ${title}
      Genres: ${genres.join(", ")}
      Synopsis: ${synopsis}
    `;

    const response = await openai.chat.completions.create({
      model:"mistralai/mistral-7b-instruct",
      messages:[
        {
          role:"system",
          content:"You are an expert anime reviewer."
        },
        {
          role:"user",
          content:prompt
        }
      ],
      temperature:0.7,
      max_tokens:150,
    });

    const text= response.choices[0].message?.content?.trim();
    if(!text){
      throw new ErrorResponse("AI returned empty summary",500);
    }

    return text;
  } catch (error) {
    console.error("Error in generateSummary:", error.message);
    const message = getErrorMessage(error);
    throw new ErrorResponse(message, 500);
  }
};

const findSimilarAnime = async (title, synopsis, genres) => {
  try {
    const prompt = `
    Analyze this anime and recommend 5 similar anime.

    Anime:
    Title: ${title}
    Genres: ${genres.join(", ")}
    Synopsis: ${synopsis}

    Return ONLY valid JSON in this exact format (no extra text):

    {
      "recommendations":[
        {
          "title": "Anime name",
          "reason": "Why it's similar",
          "matchScore": 85
        }
      ]
    }

    CRITICAL: Return ONLY the JSON object, nothing else.
    `;

    const response = await openai.chat.completions.create({
      model:"mistralai/mistral-7b-instruct",
      messages:[
        {
          role:"system",
          content:"You are an anime recommendation expert. You ONLY respond with valid JSON, no other text."
        },
        {
          role:"user",
          content:prompt
        }
      ],
      temperature:0.7,
      max_tokens:500,
    });

    let text = response.choices[0].message?.content?.trim();

    if (!text) {
      throw new ErrorResponse("AI returned empty response", 500);
    }

    // Remove markdown code blocks
    text = text.replace(/```json\n?/g,"").replace(/```\n?/g,"").trim();

    // Clean special Unicode characters that break JSON
    text = text
      .replace(/−/g, "-")           // Replace minus sign with dash
      .replace(/"/g, '"')           // Replace smart quotes
      .replace(/"/g, '"')
      .replace(/'/g, "'")           // Replace curly apostrophes
      .replace(/'/g, "'")
      .replace(/…/g, "...")         // Replace ellipsis
      .replace(/—/g, "-")           // Replace em dash
      .replace(/–/g, "-");          // Replace en dash

    console.log("🧹 After cleaning:", text.substring(0, 100) + "...");

    // Try to extract JSON if there's extra text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      console.error("❌ Failed text:", text);
      throw new ErrorResponse("AI returned invalid JSON", 500);
    }

    if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
      console.error("❌ Invalid format - missing recommendations array");
      console.error("❌ Parsed object:", parsed);
      throw new ErrorResponse("Invalid AI response format", 500);
    }

    console.log("✅ Returning", parsed.recommendations.length, "recommendations");
    return parsed.recommendations;
  } catch (error) {
    console.error("❌ Error in findSimilarAnime:", error.message);
    if (error.response) {
      console.error("❌ API Error Response:", error.response.data);
    }
    const message = getErrorMessage(error);
    throw new ErrorResponse(message, 500);
  }
}
module.exports = {
  openai,
  testAIConnection,
  generateSummary,
  findSimilarAnime
};
