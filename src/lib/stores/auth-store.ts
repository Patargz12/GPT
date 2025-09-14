import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
}

// MongoDB-backed auth store with JWT tokens
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            token: null,

            login: async (email: string, password: string) => {
                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Store token in localStorage
                        localStorage.setItem('dota-gpt-token', data.token);

                        set({
                            user: data.user,
                            isAuthenticated: true,
                            token: data.token
                        });

                        return { success: true };
                    } else {
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    return { success: false, error: 'Login failed. Please try again.' };
                }
            },

            register: async (username: string, email: string, password: string) => {
                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, email, password }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        // Store token in localStorage
                        localStorage.setItem('dota-gpt-token', data.token);

                        set({
                            user: data.user,
                            isAuthenticated: true,
                            token: data.token
                        });

                        return { success: true };
                    } else {
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    return { success: false, error: 'Registration failed. Please try again.' };
                }
            },

            logout: () => {
                // Remove token from localStorage
                localStorage.removeItem('dota-gpt-token');
                set({ user: null, isAuthenticated: false, token: null });
            },

            setUser: (user: User) => {
                set({ user, isAuthenticated: true });
            },

            setToken: (token: string) => {
                localStorage.setItem('dota-gpt-token', token);
                set({ token });
            },
        }),
        {
            name: 'dota-gpt-auth',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
                token: state.token
            }),
            onRehydrateStorage: () => (state) => {
                // Restore token from localStorage on app load
                if (state && typeof window !== 'undefined') {
                    const token = localStorage.getItem('dota-gpt-token');
                    if (token && !state.token) {
                        state.token = token;
                    }
                }
            },
        }
    )
);

// Convenience hooks
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);