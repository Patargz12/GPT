import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword, generateToken, validateEmail, validatePassword, validateUsername } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, confirmPassword } = await request.json();

        // Validation
        if (!username || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { error: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: 'Please enter a valid email address' },
                { status: 400 }
            );
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return NextResponse.json(
                { error: passwordValidation.message },
                { status: 400 }
            );
        }

        // Validate username
        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return NextResponse.json(
                { error: usernameValidation.message },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return NextResponse.json(
                    { error: 'User with this email already exists' },
                    { status: 409 }
                );
            }
            if (existingUser.username === username) {
                return NextResponse.json(
                    { error: 'Username is already taken' },
                    { status: 409 }
                );
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser._id.toString());

        // Return success response (don't include password)
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: {
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                },
                token,
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle MongoDB validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json(
                { error: messages[0] },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}