"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated } from "@/lib/stores/auth-store";

export function useProtectedRoute(redirectTo: string = "/auth") {
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    return isAuthenticated;
}

export function useGuestRoute(redirectTo: string = "/") {
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isAuthenticated, router, redirectTo]);

    return !isAuthenticated;
}