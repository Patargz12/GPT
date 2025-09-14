// Chatroom-based types for the new structure

export interface ChatroomMessage {
    _id?: string;
    chatroom_id: string;
    user_message?: string;
    bot_message?: string;
    timestamp: Date;
    message_pair_id: string; // Links user and bot messages together
}

export interface Chatroom {
    _id?: string;
    chatroom_id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
    last_message_preview?: string;
    message_count: number;
}

export interface ChatroomHistoryResponse {
    chatrooms: Chatroom[];
    totalChatrooms: number;
}

export interface ChatroomMessagesResponse {
    messages: ChatroomMessage[];
    chatroom: Chatroom;
    totalMessages: number;
}

// UI Message format for display
export interface DisplayMessage {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}