"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/app/components/auth/login-form";
import RegisterForm from "@/app/components/auth/register-form";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  // Debug useEffect to track state changes
  useEffect(() => {
    console.log(`🔄 State changed: isLogin = ${isLogin}`);
    console.log(`📋 Should render: ${isLogin ? "LoginForm" : "RegisterForm"}`);
  }, [isLogin]);

  // Debug function to test clicking
  const handleToggle = (loginState: boolean) => {
    console.log(
      `🖱️ Button clicked! Previous: ${isLogin}, Target: ${loginState}`
    );
    console.log(`🔄 Switching to ${loginState ? "Login" : "Register"} mode`);
    setIsLogin(loginState);
    console.log(`✅ setIsLogin called with: ${loginState}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      {/* Custom Auth Container */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-600/10 to-transparent rounded-2xl blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-gray-800/30 to-gray-700/20 rounded-2xl" />

        {/* Main Container */}
        <div className="relative bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="text-4xl font-bold mb-3">
                <span className="text-white">DOTA</span>
                <span className="text-red-500">GPT</span>
              </div>
              <p className="text-gray-400 text-lg">
                {isLogin ? "Welcome back, hero!" : "Join the battlefield"}
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-gray-700/50 rounded-xl p-1.5 border border-gray-600/30">
              <button
                onClick={() => {
                  console.log("🖱️ LOGIN button clicked!");
                  handleToggle(true);
                }}
                onMouseDown={() => console.log("🖱️ LOGIN button mouse down")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                  isLogin
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-600/30"
                }`}
                type="button"
              >
                Login
              </button>
              <button
                onClick={() => {
                  console.log("🖱️ REGISTER button clicked!");
                  handleToggle(false);
                }}
                onMouseDown={() => console.log("🖱️ REGISTER button mouse down")}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                  !isLogin
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-600/30"
                }`}
                type="button"
              >
                Register
              </button>
            </div>

            {/* Debug Info - Very Visible */}
            <div className="text-center p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <div className="text-yellow-400 font-bold text-lg">
                🐛 DEBUG MODE
              </div>
              <div className="text-yellow-300 text-sm mt-1">
                Current state:{" "}
                <span className="font-mono font-bold">
                  {isLogin ? "LOGIN" : "REGISTER"}
                </span>
              </div>
              <div className="text-yellow-300 text-xs mt-1">
                Form showing: {isLogin ? "LoginForm" : "RegisterForm"}
              </div>
            </div>

            {/* Forms */}
            <div className="mt-8">
              {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
