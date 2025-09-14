import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        error: 'Chatroom functionality has been removed.'
    }, { status: 501 });
}