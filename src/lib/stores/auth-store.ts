import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: string;
    username: string;
    email: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    initializeAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            token: null,
            loading: false,
            error: null,

            // Actions
            login: async (email: string, password: string) => {
                set({ loading: true, error: null });

                try {
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        set({
                            user: data.user,
                            token: data.token,
                            loading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ loading: false, error: data.error });
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    const errorMessage = 'Network error. Please try again.';
                    set({ loading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            register: async (username: string, email: string, password: string, confirmPassword: string) => {
                set({ loading: true, error: null });

                try {
                    const response = await fetch('/api/auth/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, email, password, confirmPassword }),
                    });

                    const data = await response.json();

                    if (response.ok) {
                        set({
                            user: data.user,
                            token: data.token,
                            loading: false,
                            error: null,
                        });
                        return { success: true };
                    } else {
                        set({ loading: false, error: data.error });
                        return { success: false, error: data.error };
                    }
                } catch (error) {
                    const errorMessage = 'Network error. Please try again.';
                    set({ loading: false, error: errorMessage });
                    return { success: false, error: errorMessage };
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    error: null,
                });
            },

            clearError: () => {
                set({ error: null });
            },

            setLoading: (loading: boolean) => {
                set({ loading });
            },

            initializeAuth: () => {
                // This will be called on app startup to restore auth state from localStorage
                // The persist middleware handles this automatically, but we can use this for additional logic
                const state = get();
                if (state.token && state.user) {
                    // Optionally validate token here or refresh user data
                    console.log('Auth state restored from localStorage');
                }
            },
        }),
        {
            name: 'dotagpt-auth', // localStorage key
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }), // Only persist user and token, not loading/error states
        }
    )
);

// Selectors for better performance (optional but recommended)
export const useUser = () => useAuthStore((state) => state.user);
export const useToken = () => useAuthStore((state) => state.token);
export const useAuthLoading = () => useAuthStore((state) => state.loading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useIsAuthenticated = () => useAuthStore((state) => !!state.user && !!state.token);