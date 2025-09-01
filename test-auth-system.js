// Simple test script to verify auth system
// Run with: node test-auth-system.js

const testAuth = async () => {
  const baseUrl = "http://localhost:3000";

  console.log("🧪 Testing DotaGPT Authentication System (Zustand)...\n");

  // Test Registration
  console.log("1. Testing Registration...");
  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      }),
    });

    const registerData = await registerResponse.json();

    if (registerResponse.ok) {
      console.log("✅ Registration successful!");
      console.log("User:", registerData.user);
      console.log("Token received:", !!registerData.token);
    } else {
      console.log("❌ Registration failed:", registerData.error);
    }
  } catch (error) {
    console.log("❌ Registration error:", error.message);
  }

  console.log("\n2. Testing Login...");
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.ok) {
      console.log("✅ Login successful!");
      console.log("User:", loginData.user);
      console.log("Token received:", !!loginData.token);
    } else {
      console.log("❌ Login failed:", loginData.error);
    }
  } catch (error) {
    console.log("❌ Login error:", error.message);
  }

  console.log("\n🎉 Test completed!");
  console.log("\nNext steps:");
  console.log("1. Make sure MongoDB is running");
  console.log("2. Start your Next.js app: npm run dev");
  console.log("3. Visit http://localhost:3000/auth to test the UI");
};

// Only run if this file is executed directly
if (require.main === module) {
  testAuth();
}

module.exports = testAuth;
