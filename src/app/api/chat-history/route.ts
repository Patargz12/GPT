import { NextRequest, NextResponse } from 'next/server';
import {
    getChatSessions,
    createChatSession,
    initializeChatCollections
} from '@/lib/chat-history-service';

// GET /api/chat-history - Get all chat sessions
export async function GET(request: NextRequest) {
    try {
        // Initialize collections if they don't exist
        await initializeChatCollections();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const result = await getChatSessions(limit);

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('❌ Failed to get chat sessions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to retrieve chat history',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// POST /api/chat-history - Create new chat session
export async function POST(request: NextRequest) {
    try {
        await initializeChatCollections();

        const body = await request.json();
        const { title } = body;

        const session = await createChatSession(title);

        return NextResponse.json({
            success: true,
            data: { session }
        });
    } catch (error: any) {
        console.error('❌ Failed to create chat session:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create chat session',
                details: error.message
            },
            { status: 500 }
        );
    }
}
// GET /api/chat-history - Get all chat sessions
export async function GET(request: NextRequest) {
    try {
        // Initialize collections if they don't exist
        await initializeChatCollections();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        const result = await getChatSessions(limit);

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        console.error('❌ Failed to get chat sessions:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to retrieve chat history',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// POST /api/chat-history - Create new chat session
export async function POST(request: NextRequest) {
    try {
        await initializeChatCollections();

        const body = await request.json();
        const { title } = body;

        const session = await createChatSession(title);

        return NextResponse.json({
            success: true,
            data: { session }
        });
    } catch (error: any) {
        console.error('❌ Failed to create chat session:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create chat session',
                details: error.message
            },
            { status: 500 }
        );
    }
}