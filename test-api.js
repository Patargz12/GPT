// Simple test script to verify the API is working
// Run with: node test-api.js

const testMessage = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "What is Dota 2?",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ API Test Successful!");
      console.log("Response:", data.response);
    } else {
      console.log("❌ API Test Failed!");
      console.log("Error:", data);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  console.log("🧪 Testing API endpoint...");
  testMessage();
}

module.exports = { testMessage };
