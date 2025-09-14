import { NextRequest, NextResponse } from 'next/server';
import {
    getSessionMessages,
    getChatSession,
    updateSessionTitle,
    initializeChatCollections
} from '@/lib/chat-history-service';

// GET /api/chat-history/[sessionId] - Get messages for a specific session

// PUT /api/chat-history/[sessionId] - Update session (e.g., title)
