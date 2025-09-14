"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Initialize demo user if none exists
    const users = JSON.parse(localStorage.getItem("dota-gpt-users") || "[]");

    if (users.length === 0) {
      // Create demo user
      const demoUser = {
        id: "demo-user",
        username: "DemoPlayer",
        email: "demo@dotagpt.com",
        password: "demo123",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem("dota-gpt-users", JSON.stringify([demoUser]));
    }
  }, []);

  return <>{children}</>;
}
