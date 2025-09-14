import { ObjectId } from 'mongodb';

// Chat Session represents a conversation thread
export interface ChatSession {
    _id?: ObjectId;
    sessionId: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
    lastMessage?: string;
}

// Stored Chat Message in MongoDB
export interface StoredChatMessage {
    _id?: ObjectId;
    sessionId: string;
    messageId: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
    metadata?: {
        retryCount?: number;
        processingTime?: number;
        model?: string;
    };
}

// Client-side chat message (extends the existing type)
export interface ChatMessageWithSession {
    id: string;
    sessionId: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

// Chat history response for API
export interface ChatHistoryResponse {
    sessions: ChatSession[];
    totalSessions: number;
}

// Session messages response
export interface SessionMessagesResponse {
    messages: StoredChatMessage[];
    session: ChatSession;
    totalMessages: number;
}