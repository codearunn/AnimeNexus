require("dotenv").config();
const openAI = require("openai"); //is a class (blueprint for creating AI clients)


// Creates a new AI client instance
// Like logging into a service
// Configures how to connect
const openai = new openAI({
  apiKey:process.env.OPENROUTER_API_KEY,
  baseURL:'https://openrouter.ai/api/v1',
});

const testAIConnection = async () => {
  try {
    console.log("🤖 Testing AI connection...");

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

    console.log("📥 AI Response:");
    console.log(aiMessage);
    console.log("\n✅ AI connection successful!");

    return aiMessage;

  } catch (error) {
    console.error("❌ AI connection failed:", error.message);
  }
};

module.exports = {
  openai,
  testAIConnection,
};
