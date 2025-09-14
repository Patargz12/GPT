import { NextRequest, NextResponse } from 'next/server';
import {
    getChatroomMessages,
    convertToDisplayMessages,
    initializeChatroomCollections
} from '@/lib/chatroom-service';

export async function GET(
    request: NextRequest,
    { params }: { params: { chatroomId: string } }
) {
    try {
        // Initialize collections if needed
        await initializeChatroomCollections();

        const { chatroomId } = params;

        if (!chatroomId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Chatroom ID is required'
                },
                { status: 400 }
            );
        }

        // Fetch chatroom messages
        const result = await getChatroomMessages(chatroomId);

        // Convert to display format
        const displayMessages = convertToDisplayMessages(result.messages);

        return NextResponse.json({
            success: true,
            data: {
                messages: displayMessages,
                chatroom: result.chatroom,
                totalMessages: displayMessages.length
            }
        });

    } catch (error) {
        console.error('Error fetching chatroom messages:', error);

        if (error instanceof Error && error.message.includes('not found')) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Chatroom not found'
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch chatroom messages',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}