import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Error types for better error handling

// Initialize Gemini AI with error checking
let genAI: GoogleGenerativeAI;
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
} catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
}

// Load system prompt from markdown file
let systemPrompt: string;
try {
    const promptPath = path.join(process.cwd(), 'src', 'app', 'api', 'chat', 'prompt.md');
    const promptContent = fs.readFileSync(promptPath, 'utf-8');

    // Extract the system prompt section from the markdown
    const systemPromptMatch = promptContent.match(/## System Prompt\n\n([\s\S]*?)(?=\n## |$)/);
    if (systemPromptMatch) {
        systemPrompt = systemPromptMatch[1].trim();
    } else {
        throw new Error('System prompt section not found in prompt.md');
    }
} catch (error) {
    console.error('Failed to load system prompt:', error);
    // Fallback to a basic prompt if file reading fails
    systemPrompt = 'You are DotaGPT, a helpful Dota 2 assistant. Provide accurate and helpful information about Dota 2 gameplay, heroes, items, and strategies.';
}

export async function POST(request: NextRequest) {
    try {
        // Check if Gemini AI is properly initialized
        if (!genAI) {
            return NextResponse.json(
                {
                    error: 'AI service is not properly configured',
                    code: 'SERVICE_UNAVAILABLE',
                    details: 'The AI service could not be initialized. Please check server configuration.'
                },
                { status: 503 }
            );
        }

        // Parse request body with error handling
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                {
                    error: 'Invalid request format',
                    code: 'INVALID_JSON',
                    details: 'Request body must be valid JSON.'
                },
                { status: 400 }
            );
        }

        const { message } = body;

        // Validate message input
        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                {
                    error: 'Message is required',
                    code: 'MISSING_MESSAGE',
                    details: 'Please provide a valid message string.'
                },
                { status: 400 }
            );
        }

        if (message.trim().length === 0) {
            return NextResponse.json(
                {
                    error: 'Message cannot be empty',
                    code: 'EMPTY_MESSAGE',
                    details: 'Please provide a non-empty message.'
                },
                { status: 400 }
            );
        }

        if (message.length > 4000) {
            return NextResponse.json(
                {
                    error: 'Message too long',
                    code: 'MESSAGE_TOO_LONG',
                    details: 'Message must be less than 4000 characters.'
                },
                { status: 400 }
            );
        }

        // Pre-filter non-Dota 2 questions
        const nonDotaGames = [
            'mobile legends', 'league of legends', 'lol', 'wild rift',
            'heroes of newerth', 'hon', 'heroes of the storm', 'hots',
            'arena of valor', 'aov', 'smite', 'paragon', 'vainglory',
            'pokemon unite', 'onmyoji arena', 'marvel super war'
        ];

        const lowerMessage = message.toLowerCase();
        const mentionsOtherGame = nonDotaGames.some(game => lowerMessage.includes(game));

        if (mentionsOtherGame && !lowerMessage.includes('dota')) {
            return NextResponse.json({
                response: "I'm DotaGPT, designed exclusively for Dota 2 questions. I cannot and will not answer questions about other games or topics. Please ask me about Dota 2 heroes, items, strategies, mechanics, or gameplay!"
            });
        }

        // Get the generative model (using Gemini 1.5 Flash - more stable than experimental)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Use the system prompt loaded from prompt.md
        const fullPrompt = `${systemPrompt}\n\nUser question: ${message}`;

        // Generate content with detailed error handling
        const result = await model.generateContent(fullPrompt);

        // Check if result exists and has response
        if (!result || !result.response) {
            return NextResponse.json(
                {
                    error: 'Invalid response from AI',
                    code: 'INVALID_AI_RESPONSE',
                    details: 'The AI service returned an invalid response structure.'
                },
                { status: 502 }
            );
        }

        const response = result.response;

        // Check if response has text method
        if (typeof response.text !== 'function') {
            return NextResponse.json(
                {
                    error: 'Invalid response format from AI',
                    code: 'INVALID_RESPONSE_FORMAT',
                    details: 'The AI service response format is not supported.'
                },
                { status: 502 }
            );
        }

        let text: string;
        try {
            text = response.text();
        } catch (textError) {
            console.error('Error extracting text from response:', textError);
            return NextResponse.json(
                {
                    error: 'Failed to extract response text',
                    code: 'TEXT_EXTRACTION_ERROR',
                    details: 'Could not extract text from AI response.'
                },
                { status: 502 }
            );
        }

        if (!text || text.trim().length === 0) {
            return NextResponse.json(
                {
                    error: 'Empty response from AI',
                    code: 'EMPTY_AI_RESPONSE',
                    details: 'The AI service returned an empty response. Please try again.'
                },
                { status: 502 }
            );
        }

        return NextResponse.json({ response: text });

    } catch (error: unknown) {
        console.error('Error in chat API:', error);

        // Handle specific Gemini API errors
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStatus = (error as { status?: number })?.status;

        if (errorMessage.includes('API_KEY_INVALID') || errorStatus === 401) {
            return NextResponse.json(
                {
                    error: 'Authentication failed',
                    code: 'INVALID_API_KEY',
                    details: 'The API key is invalid or has expired. Please check the server configuration.'
                },
                { status: 401 }
            );
        }

        if (errorMessage.includes('PERMISSION_DENIED') || errorStatus === 403) {
            return NextResponse.json(
                {
                    error: 'Access denied',
                    code: 'PERMISSION_DENIED',
                    details: 'The API key does not have permission to access this service.'
                },
                { status: 403 }
            );
        }

        if (errorMessage.includes('QUOTA_EXCEEDED') || errorStatus === 429) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded',
                    code: 'QUOTA_EXCEEDED',
                    details: 'Too many requests. Please wait a moment before trying again.'
                },
                { status: 429 }
            );
        }

        if (errorMessage.includes('MODEL_NOT_FOUND') || errorStatus === 404) {
            return NextResponse.json(
                {
                    error: 'AI model not available',
                    code: 'MODEL_NOT_FOUND',
                    details: 'The requested AI model is not available. Please try again later.'
                },
                { status: 404 }
            );
        }

        if (errorMessage.includes('SAFETY') || errorMessage.includes('BLOCKED')) {
            return NextResponse.json(
                {
                    error: 'Content blocked',
                    code: 'CONTENT_BLOCKED',
                    details: 'Your message was blocked by safety filters. Please rephrase your question.'
                },
                { status: 400 }
            );
        }

        if (errorMessage.includes('timeout') || (error as { code?: string })?.code === 'ETIMEDOUT') {
            return NextResponse.json(
                {
                    error: 'Request timeout',
                    code: 'TIMEOUT',
                    details: 'The request took too long to process. Please try again.'
                },
                { status: 408 }
            );
        }

        if (errorMessage.includes('network') || (error as { code?: string })?.code === 'ENOTFOUND' || (error as { code?: string })?.code === 'ECONNREFUSED') {
            return NextResponse.json(
                {
                    error: 'Network error',
                    code: 'NETWORK_ERROR',
                    details: 'Unable to connect to the AI service. Please check your internet connection.'
                },
                { status: 503 }
            );
        }

        // Generic server error for unknown issues
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                details: 'An unexpected error occurred. Please try again later.'
            },
            { status: 500 }
        );
    }
}