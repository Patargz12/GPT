import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/mongodb';

export async function GET() {
    try {
        await testConnection();

        return NextResponse.json(
            {
                success: true,
                message: 'Connected to MongoDB Atlas successfully!'
            },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to connect to MongoDB Atlas',
                error: error.message
            },
            { status: 500 }
        );
    }
}