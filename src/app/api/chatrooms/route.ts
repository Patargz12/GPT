import { NextRequest, NextResponse } from 'next/server';
import {
    getChatrooms,
    initializeChatroomCollections
} from '@/lib/chatroom-service';

export async function GET(request: NextRequest) {
    try {
        // Initialize collections if needed
        await initializeChatroomCollections();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');

        // Fetch chatrooms
        const result = await getChatrooms(limit);

        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error fetching chatrooms:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch chatrooms',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}