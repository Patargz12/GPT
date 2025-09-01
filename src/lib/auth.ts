import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(userId: string): string {
    return jwt.sign(
        { userId },
        JWT_SECRET,
        { expiresIn: '7d' } // Token expires in 7 days
    );
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

// Validation helpers
export function validateEmail(email: string): boolean {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
    if (password.length < 6) {
        return { isValid: false, message: 'Password must be at least 6 characters long' };
    }
    if (password.length > 128) {
        return { isValid: false, message: 'Password cannot exceed 128 characters' };
    }
    return { isValid: true };
}

export function validateUsername(username: string): { isValid: boolean; message?: string } {
    if (username.length < 3) {
        return { isValid: false, message: 'Username must be at least 3 characters long' };
    }
    if (username.length > 20) {
        return { isValid: false, message: 'Username cannot exceed 20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { isValid: false, message: 'Username can only contain letters, numbers, and underscores' };
    }
    return { isValid: true };
}