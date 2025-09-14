import { ObjectId } from 'mongodb';
import {
    getDatabase,
    insertDocument,
    findDocuments,
    findOneDocument,
    updateDocument,
    createIndex,
    createCollection
} from './database-utils';
import {
    Chatroom,
    ChatroomMessage,
    ChatroomHistoryResponse,
    ChatroomMessagesResponse,
    DisplayMessage
} from '@/types/chatroom';

const CHATROOMS_COLLECTION = 'chatrooms';
const CHATROOM_MESSAGES_COLLECTION = 'chatroom_messages';

// ========================================
// INITIALIZATION
// ========================================
export async function initializeChatroomCollections(): Promise<void> {
    try {
        // Create chatrooms collection
        await createCollection(CHATROOMS_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['chatroom_id', 'title', 'created_at', 'updated_at', 'message_count'],
                    properties: {
                        chatroom_id: {
                            bsonType: 'string',
                            description: 'Unique chatroom identifier'
                        },
                        title: {
                            bsonType: 'string',
                            description: 'Chatroom title/summary'
                        },
                        created_at: {
                            bsonType: 'date',
                            description: 'Chatroom creation timestamp'
                        },
                        updated_at: {
                            bsonType: 'date',
                            description: 'Last update timestamp'
                        },
                        message_count: {
                            bsonType: 'int',
                            minimum: 0,
                            description: 'Number of message pairs in chatroom'
                        },
                        last_message_preview: {
                            bsonType: 'string',
                            description: 'Preview of last message'
                        }
                    }
                }
            }
        });

        // Create chatroom messages collection
        await createCollection(CHATROOM_MESSAGES_COLLECTION, {
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['chatroom_id', 'message_pair_id', 'timestamp'],
                    properties: {
                        chatroom_id: {
                            bsonType: 'string',
                            description: 'Reference to chatroom'
                        },
                        message_pair_id: {
                            bsonType: 'string',
                            description: 'Unique identifier for user-bot message pair'
                        },
                        user_message: {
                            bsonType: 'string',
                            description: 'User message content'
                        },
                        bot_message: {
                            bsonType: 'string',
                            description: 'Bot response content'
                        },
                        timestamp: {
                            bsonType: 'date',
                            description: 'Message timestamp'
                        }
                    }
                }
            }
        });

        // Create indexes for performance
        await createIndex(CHATROOMS_COLLECTION, { chatroom_id: 1 }, { unique: true });
        await createIndex(CHATROOMS_COLLECTION, { updated_at: -1 });
        await createIndex(CHATROOM_MESSAGES_COLLECTION, { chatroom_id: 1, timestamp: 1 });
        await createIndex(CHATROOM_MESSAGES_COLLECTION, { message_pair_id: 1 }, { unique: true });

        console.log('✅ Chatroom collections initialized');
    } catch (error) {
        console.error('❌ Failed to initialize chatroom collections:', error);
        throw error;
    }
}

// ========================================
// CHATROOM MANAGEMENT
// ========================================
export async function createChatroom(title?: string): Promise<Chatroom> {
    const chatroomId = generateChatroomId();
    const now = new Date();

    const chatroom: Chatroom = {
        chatroom_id: chatroomId,
        title: title || 'New Chat',
        created_at: now,
        updated_at: now,
        message_count: 0
    };

    await insertDocument(CHATROOMS_COLLECTION, chatroom as unknown as Record<string, unknown>);
    return chatroom;
}

export async function getChatrooms(limit: number = 50): Promise<ChatroomHistoryResponse> {
    const chatrooms = await findDocuments(
        CHATROOMS_COLLECTION,
        {},
        {
            sort: { updated_at: -1 },
            limit
        }
    ) as Chatroom[];

    return {
        chatrooms,
        totalChatrooms: chatrooms.length
    };
}

export async function getChatroom(chatroomId: string): Promise<Chatroom | null> {
    return await findOneDocument(CHATROOMS_COLLECTION, { chatroom_id: chatroomId }) as Chatroom | null;
}

export async function updateChatroomTitle(chatroomId: string, title: string): Promise<void> {
    await updateDocument(
        CHATROOMS_COLLECTION,
        { chatroom_id: chatroomId },
        {
            $set: {
                title,
                updated_at: new Date()
            }
        }
    );
}

// ========================================
// MESSAGE MANAGEMENT
// ========================================
export async function saveMessagePair(
    chatroomId: string,
    userMessage: string,
    botMessage: string
): Promise<ChatroomMessage> {
    const messagePairId = generateMessagePairId();
    const now = new Date();

    const messageDoc: ChatroomMessage = {
        chatroom_id: chatroomId,
        message_pair_id: messagePairId,
        user_message: userMessage,
        bot_message: botMessage,
        timestamp: now
    };

    await insertDocument(CHATROOM_MESSAGES_COLLECTION, messageDoc as unknown as Record<string, unknown>);

    // Update chatroom metadata
    await updateDocument(
        CHATROOMS_COLLECTION,
        { chatroom_id: chatroomId },
        {
            $set: {
                updated_at: now,
                last_message_preview: userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : '')
            },
            $inc: { message_count: 1 }
        }
    );

    return messageDoc;
}

export async function getChatroomMessages(chatroomId: string): Promise<ChatroomMessagesResponse> {
    const [messages, chatroom] = await Promise.all([
        findDocuments(
            CHATROOM_MESSAGES_COLLECTION,
            { chatroom_id: chatroomId },
            { sort: { timestamp: 1 } }
        ) as Promise<ChatroomMessage[]>,
        findOneDocument(CHATROOMS_COLLECTION, { chatroom_id: chatroomId }) as Promise<Chatroom>
    ]);

    if (!chatroom) {
        throw new Error(`Chatroom ${chatroomId} not found`);
    }

    return {
        messages,
        chatroom,
        totalMessages: messages.length
    };
}

// Convert chatroom messages to display format
export function convertToDisplayMessages(chatroomMessages: ChatroomMessage[]): DisplayMessage[] {
    const displayMessages: DisplayMessage[] = [];

    chatroomMessages.forEach((msg) => {
        // Add user message
        if (msg.user_message) {
            displayMessages.push({
                id: `${msg.message_pair_id}_user`,
                content: msg.user_message,
                isUser: true,
                timestamp: msg.timestamp
            });
        }

        // Add bot message
        if (msg.bot_message) {
            displayMessages.push({
                id: `${msg.message_pair_id}_bot`,
                content: msg.bot_message,
                isUser: false,
                timestamp: msg.timestamp
            });
        }
    });

    return displayMessages;
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function generateChatroomId(): string {
    return `chatroom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateMessagePairId(): string {
    return `pair_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Auto-generate chatroom title from first user message
export async function generateChatroomTitle(firstMessage: string): Promise<string> {
    // Simple title generation - take first 50 chars and clean up
    let title = firstMessage.trim().substring(0, 50);

    // Remove line breaks and extra spaces
    title = title.replace(/\s+/g, ' ');

    // Add ellipsis if truncated
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