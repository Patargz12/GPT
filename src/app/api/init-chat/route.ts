import { NextResponse } from 'next/server';
import { initializeChatCollections } from '@/lib/chat-history-service';

export async function POST() {
    try {
        await initializeChatCollections();

        return NextResponse.json({
            success: true,
            message: 'Chat collections initialized successfully'
        });
    } catch (error: any) {
        console.error('❌ Failed to initialize chat collections:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to initialize chat collections',
                details: error.message
            },
            { status: 500 }
        );
    }
}