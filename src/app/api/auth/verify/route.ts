import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'No token provided' },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

        // Connect to MongoDB and get user
        const client = await clientPromise;
        const db = client.db('dotagpt');
        const users = db.collection('users');

        const user = await users.findOne(
            { _id: new ObjectId(decoded.userId) },
            { projection: { password: 0 } } // Exclude password
        );

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const userResponse = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };

        return NextResponse.json({
            success: true,
            user: userResponse,
            valid: true
        });

    } catch (error: any) {
        console.error('Token verification error:', error);

        if (error.name === 'JsonWebTokenError') {
            return NextResponse.json(
                { success: false, error: 'Invalid token' },
                { status: 401 }
            );
        }

        if (error.name === 'TokenExpiredError') {
            return NextResponse.json(
                { success: false, error: 'Token expired' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Token verification failed' },
            { status: 500 }
        );
    }
}