"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LoginForm from "@/app/components/auth/login-form";
import RegisterForm from "@/app/components/auth/register-form";
import { useIsAuthenticated } from "@/lib/stores/auth-store";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900/20 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-3xl font-bold mb-2">
              <span className="text-white">DOTA</span>
              <span className="text-red-500">GPT</span>
            </div>
            <p className="text-gray-400 text-lg">
              {isLogin ? "Welcome back, hero!" : "Join the battlefield"}
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-gray-700/50 rounded-lg p-1 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "text-gray-400 hover:text-white hover:bg-gray-600/30"
              }`}
              type="button"
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                  : "text-gray-400 hover:text-white hover:bg-gray-600/30"
              }`}
              type="button"
            >
              Register
            </button>
          </div>

          {/* Forms */}
          <motion.div
            key={isLogin ? "login" : "register"}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
