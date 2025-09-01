"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Initialize auth state on app startup
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
