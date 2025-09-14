import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('dotagpt');
        const users = db.collection('users');

        // Find user by email
        const user = await users.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user._id.toString(),
                email: user.email,
                username: user.username
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const userResponse = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
        };

        return NextResponse.json({
            success: true,
            user: userResponse,
            token,
            message: 'Login successful'
        });

    } catch (error: any) {
        console.error('Login error:', error);

        return NextResponse.json(
            { success: false, error: 'Login failed. Please try again.' },
            { status: 500 }
        );
    }
}