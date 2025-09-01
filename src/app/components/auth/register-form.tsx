"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  useAuthStore,
  useAuthLoading,
  useAuthError,
} from "@/lib/stores/auth-store";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const register = useAuthStore((state) => state.register);
  const clearError = useAuthStore((state) => state.clearError);
  const loading = useAuthLoading();
  const error = useAuthError();
  const router = useRouter();

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [
    formData.username,
    formData.email,
    formData.password,
    formData.confirmPassword,
    clearError,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.confirmPassword
    );

    if (result.success) {
      router.push("/"); // Redirect to home page after successful registration
    }
    // Error handling is now managed by the store
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {/* Username Field */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-gray-300">
          Username
        </Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
          required
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500"
          required
        />
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-300">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-gray-300">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="terms"
          className="mt-1 rounded border-gray-600 bg-gray-700 text-red-500 focus:ring-red-500"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-400">
          I agree to the{" "}
          <button
            type="button"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="text-red-500 hover:text-red-400 transition-colors"
          >
            Privacy Policy
          </button>
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-800 px-2 text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          Steam
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
        >
          Discord
        </Button>
      </div>
    </form>
  );
}
