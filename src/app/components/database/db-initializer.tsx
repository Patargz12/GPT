"use client";

import { useEffect } from "react";

export default function DatabaseInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Test database connection on app startup
    const testDatabaseConnection = async () => {
      try {
        const response = await fetch("/api/db-test");
        const result = await response.json();

        if (result.success) {
          console.log("✅ Connected");
        } else {
          console.error("❌ Database connection failed:", result.message);
          if (result.error) {
            console.error("Error details:", result.error);
          }
        }
      } catch (error) {
        console.error("❌ Failed to test database connection:", error);
      }
    };

    testDatabaseConnection();
  }, []);

  return <>{children}</>;
}
