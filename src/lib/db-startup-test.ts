import { testConnection } from './mongodb';

// Server-side database connection test
export async function initializeDatabase() {
    if (typeof window === 'undefined') {
        // Only run on server-side
        try {
            await testConnection();
        } catch (error) {
            console.error('❌ Server-side database connection failed during initialization');
            // Don't throw error to prevent app from crashing
            // Just log the error for debugging
        }
    }
}

// Auto-run on module import (server-side only)
if (typeof window === 'undefined') {
    initializeDatabase();
}