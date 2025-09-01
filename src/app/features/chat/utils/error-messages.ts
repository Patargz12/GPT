import { APIErrorResponse } from "../types";

/**
 * Converts API error responses into user-friendly error messages
 */
export const getErrorMessage = (errorData: APIErrorResponse): string => {
    if (!errorData?.code) {
        return "Sorry, I'm having trouble connecting right now. Please try again later.";
    }

    switch (errorData.code) {
        case "INVALID_API_KEY":
            return "🔑 The AI service is not properly configured. Please contact support.";

        case "PERMISSION_DENIED":
            return "🚫 Access to the AI service is currently restricted. Please try again later.";

        case "QUOTA_EXCEEDED":
            return "⏳ Too many requests right now. Please wait a moment and try again.";

        case "MODEL_NOT_FOUND":
            return "🤖 The AI model is temporarily unavailable. Please try again in a few minutes.";

        case "CONTENT_BLOCKED":
            return "⚠️ Your message was blocked by safety filters. Please rephrase your question about Dota 2.";

        case "TIMEOUT":
            return "⏱️ The request took too long to process. Please try asking a shorter question.";

        case "NETWORK_ERROR":
            return "🌐 Network connection issue. Please check your internet and try again.";

        case "SERVICE_UNAVAILABLE":
            return "🔧 The AI service is temporarily unavailable. Please try again later.";

        case "MISSING_MESSAGE":
        case "EMPTY_MESSAGE":
            return "📝 Please enter a message before sending.";

        case "MESSAGE_TOO_LONG":
            return "📏 Your message is too long. Please keep it under 4000 characters.";

        case "INVALID_JSON":
            return "💻 There was a technical issue with your request. Please try again.";

        case "EMPTY_AI_RESPONSE":
            return "🤔 I couldn't generate a response. Please try rephrasing your question.";

        case "INVALID_AI_RESPONSE":
            return "🔧 The AI service returned an invalid response. Please try again.";

        case "INVALID_RESPONSE_FORMAT":
            return "⚙️ There was a technical issue with the AI response format. Please try again.";

        case "TEXT_EXTRACTION_ERROR":
            return "📄 Could not process the AI response. Please try again.";

        case "INTERNAL_ERROR":
        default:
            return `❌ ${errorData.details ||
                "An unexpected error occurred. Please try again later."
                }`;
    }
};