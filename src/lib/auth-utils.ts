// Utility functions for authentication

export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('dota-gpt-token');
}

export function getAuthHeaders(): HeadersInit {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
}

export function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp < currentTime;
    } catch {
        return true;
    }
}

export function removeAuthToken(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('dota-gpt-token');
    }
}