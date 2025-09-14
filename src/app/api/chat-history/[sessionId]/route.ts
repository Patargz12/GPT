import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        error: 'Chat history functionality has been removed.'
    }, { status: 501 });
}

export async function PUT() {
    return NextResponse.json({
        error: 'Chat history functionality has been removed.'
    }, { status: 501 });
}
