import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({
        error: 'Chat initialization functionality has been removed.'
    }, { status: 501 });
}