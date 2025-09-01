// Test MongoDB Connection Script
const { MongoClient } = require("mongodb");
require("dotenv").config();

async function testConnection() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI not found in environment variables");
    return;
  }

  console.log("🔄 Testing MongoDB connection...");
  console.log("📍 URI:", uri.replace(/\/\/.*@/, "//***:***@")); // Hide credentials in log

  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");

    // Test database operations
    const db = client.db("dotagpt");
    const collections = await db.listCollections().toArray();
    console.log(
      "📊 Available collections:",
      collections.map((c) => c.name)
    );

    // Test creating a collection (if it doesn't exist)
    const testCollection = db.collection("connection_test");
    await testCollection.insertOne({
      test: true,
      timestamp: new Date(),
      message: "Connection test successful",
    });
    console.log("✅ Test document inserted successfully");

    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log("🧹 Test document cleaned up");
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error("Error:", error.message);

    if (error.message.includes("ENOTFOUND")) {
      console.log("\n💡 Suggestions:");
      console.log("1. Check if MongoDB is running locally");
      console.log("2. Verify your MONGODB_URI in .env file");
      console.log("3. For Atlas: Check network access settings");
    }
  } finally {
    await client.close();
    console.log("🔌 Connection closed");
  }
}

// Run the test
testConnection().catch(console.error);
