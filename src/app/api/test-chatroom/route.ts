import { NextRequest, NextResponse } from 'next/server';
import {
    createChatroom,
    saveMessagePair,
    getChatrooms,
    getChatroomMessages,
    convertToDisplayMessages,
    initializeChatroomCollections
} from '@/lib/chatroom-service';

export async function GET(request: NextRequest) {
    try {
        console.log('🧪 Testing chatroom functionality...');

        // Initialize collections
        await initializeChatroomCollections();
        console.log('✅ Collections initialized');

        // Create a test chatroom
        const testChatroom = await createChatroom('Test Chatroom');
        console.log('✅ Created test chatroom:', testChatroom.chatroom_id);

        // Add some test messages
        await saveMessagePair(
            testChatroom.chatroom_id,
            'Hello, what are the 5 positions in Dota 2?',
            'The 5 positions in Dota 2 are: Position 1 (Carry), Position 2 (Mid), Position 3 (Offlaner), Position 4 (Support), and Position 5 (Hard Support).'
        );
        console.log('✅ Saved first message pair');

        await saveMessagePair(
            testChatroom.chatroom_id,
            'Tell me more about the carry role',
            'The carry (Position 1) is the primary damage dealer who farms gold and experience to become powerful in the late game. They typically play in the safe lane with support protection.'
        );
        console.log('✅ Saved second message pair');

        // Test fetching chatrooms
        const chatroomsResult = await getChatrooms();
        console.log('✅ Fetched chatrooms:', chatroomsResult.totalChatrooms);

        // Test fetching messages
        const messagesResult = await getChatroomMessages(testChatroom.chatroom_id);
        const displayMessages = convertToDisplayMessages(messagesResult.messages);
        console.log('✅ Fetched and converted messages:', displayMessages.length);

        return NextResponse.json({
            success: true,
            test_results: {
                chatroom_created: testChatroom,
                total_chatrooms: chatroomsResult.totalChatrooms,
                messages_count: displayMessages.length,
                sample_messages: displayMessages.slice(0, 2),
                chatroom_details: messagesResult.chatroom
            }
        });

    } catch (error) {
        console.error('❌ Test failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Test failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}