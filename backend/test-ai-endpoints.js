// Can a REAL logged-in user call my AI API and get a response?

// [TEST SCRIPT]
//      |
//      ├─ 1️⃣ Login API → get JWT token
//      |
//      └─ 2️⃣ AI API → send token → get AI response
require("dotenv").config();
// fetch is built-in in Node.js v18+ ✅

const testAIEndpoint = async () => {
  try {
    console.log("🧪 Testing AI Recommendation Endpoint...\n");

    // 1. Login API → get JWT token
    console.log("🔐 Logging in...");

    const loginResponse = await fetch("http://localhost:8000/api/auth/login",{
      method:"POST",
      credentials:"include",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        email:"arun@gmail.com",
        password:"arun@123",
      })
    });

    const loginData = await loginResponse.json();

    if(!loginData.status || !loginData.token){
      console.error("Login failed:", loginData.message);
      return;
    }

    const token = loginData.token;
    console.log("Login successful! Token received.\n");

    //2.AI API → send token → get AI response
    console.log("🤖 Calling AI recommendation API...\n");

    const aiResponse = await fetch("http://localhost:8000/api/ai/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },
      body: JSON.stringify({
        message: "Recommend 3 action anime with strong protagonists",
      }),
    });

    const aiData = await aiResponse.json();

    if (aiData.success) {
      console.log("✅ AI Recommendation Endpoint Working!\n");
      console.log("📥 AI Response:\n");
      console.log(aiData.recommendation);
    } else {
      console.error("❌ AI request failed:", aiData.message);
    }
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testAIEndpoint();
