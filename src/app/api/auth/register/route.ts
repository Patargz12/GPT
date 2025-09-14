import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        // Validation
        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('dotagpt');
    const users = db.collection('users');

        // Check if user already exists
        const existingUser = await users.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            const field = existingUser.email === email ? 'email' : 'username';
            return NextResponse.json(
                { success: false, error: `User with this ${field} already exists` },
                { status: 409 }
            );
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = {
            username,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };

        const result = await users.insertOne(newUser);

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: result.insertedId.toString(),
                email,
                username
            },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        // Return user data without password
        const userResponse = {
            id: result.insertedId.toString(),
            username,
            email,
            createdAt: newUser.createdAt.toISOString(),
        };

        return NextResponse.json({
            success: true,
            user: userResponse,
            token,
            message: 'Account created successfully'
        });

    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle MongoDB errors
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Registration failed. Please try again.' },
            { status: 500 }
        );
    }
}