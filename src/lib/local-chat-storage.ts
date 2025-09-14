// Local storage service for unauthenticated users
import { ChatMessage } from "@/app/features/chat/types";

export interface LocalChatroom {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: string;
    updatedAt: string;
}

const STORAGE_KEY = 'dota-gpt-local-chats';
const MAX_LOCAL_CHATROOMS = 10; // Limit to prevent localStorage bloat

export class LocalChatStorage {

    // Get all local chatrooms
    static getChatrooms(): LocalChatroom[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return [];

            const chatrooms = JSON.parse(stored) as LocalChatroom[];
            // Sort by most recent first
            return chatrooms.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        } catch (error) {
            console.error('Error loading local chatrooms:', error);
            return [];
        }
    }

    // Get specific chatroom by ID
    static getChatroom(chatroomId: string): LocalChatroom | null {
        const chatrooms = this.getChatrooms();
        return chatrooms.find(room => room.id === chatroomId) || null;
    }

    // Create new chatroom
    static createChatroom(title: string): LocalChatroom {
        const newChatroom: LocalChatroom = {
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const chatrooms = this.getChatrooms();
        chatrooms.unshift(newChatroom);

        // Keep only the most recent chatrooms
        if (chatrooms.length > MAX_LOCAL_CHATROOMS) {
            chatrooms.splice(MAX_LOCAL_CHATROOMS);
        }

        this.saveChatrooms(chatrooms);
        return newChatroom;
    }

    // Add message to chatroom
    static addMessage(chatroomId: string, message: ChatMessage): void {
        const chatrooms = this.getChatrooms();
        const chatroomIndex = chatrooms.findIndex(room => room.id === chatroomId);

        if (chatroomIndex === -1) {
            console.error('Chatroom not found:', chatroomId);
            return;
        }

        chatrooms[chatroomIndex].messages.push(message);
        chatrooms[chatroomIndex].updatedAt = new Date().toISOString();

        // Move to front (most recent)
        const updatedChatroom = chatrooms.splice(chatroomIndex, 1)[0];
        chatrooms.unshift(updatedChatroom);

        this.saveChatrooms(chatrooms);
    }

    // Update chatroom title
    static updateChatroomTitle(chatroomId: string, title: string): void {
        const chatrooms = this.getChatrooms();
        const chatroomIndex = chatrooms.findIndex(room => room.id === chatroomId);

        if (chatroomIndex !== -1) {
            chatrooms[chatroomIndex].title = title;
            chatrooms[chatroomIndex].updatedAt = new Date().toISOString();
            this.saveChatrooms(chatrooms);
        }
    }

    // Delete chatroom
    static deleteChatroom(chatroomId: string): void {
        const chatrooms = this.getChatrooms();
        const filtered = chatrooms.filter(room => room.id !== chatroomId);
        this.saveChatrooms(filtered);
    }

    // Clear all local chatrooms
    static clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    // Private method to save chatrooms to localStorage
    private static saveChatrooms(chatrooms: LocalChatroom[]): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(chatrooms));
        } catch (error) {
            console.error('Error saving local chatrooms:', error);
            // If storage is full, try to clear old chatrooms
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                const reducedChatrooms = chatrooms.slice(0, Math.floor(MAX_LOCAL_CHATROOMS / 2));
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedChatrooms));
                } catch (retryError) {
                    console.error('Failed to save even reduced chatrooms:', retryError);
                }
            }
        }
    }

    // Generate title from first message
    static generateTitle(firstMessage: string): string {
        let title = firstMessage.trim().substring(0, 50);
        title = title.replace(/\s+/g, ' ');

        if (firstMessage.length > 50) {
            title += '...';
        }

        // Fallback titles for common patterns
        if (title.toLowerCase().includes('position')) {
            title = 'Position Guide Question';
        } else if (title.toLowerCase().includes('dota')) {
            title = 'Dota 2 Question';
        } else if (title.toLowerCase().includes('carry') || title.toLowerCase().includes('support')) {
            title = 'Role Discussion';
        }

        return title || 'New Chat';
    }

    // Check if localStorage is available
    static isAvailable(): boolean {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch {
            return false;
        }
    }
}