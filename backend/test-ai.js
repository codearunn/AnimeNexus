const { testAIConnection } = require('./src/services/ai');

console.log("🚀 Starting AI Connection Test...\n");

testAIConnection()
  .then((response) => {
    console.log("\n🎉 SUCCESS! Your AI is ready to use!");
    console.log("💡 Next: Build the recommendation API endpoint");
    process.exit(0);  //0 = success code
  })
  .catch((error) => {
    console.error("\n❌ TEST FAILED!");
    console.error("Error:", error.message);
    process.exit(1); //1 = error code
  });
