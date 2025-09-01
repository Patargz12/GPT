"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { getErrorMessage } from "../utils/error-messages";
import { MAX_RETRIES } from "../constants";

export const useChat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isInitialState, setIsInitialState] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Refs for scrolling functionality
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Simple scroll to bottom function (based on working scroll_sample.md)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll when messages change (simple and reliable)
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessageWithRetry = async (
        messageText: string,
        attempt: number = 1
    ): Promise<void> => {
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: messageText }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if this is a retryable error
                const isRetryable =
                    data.code === "TIMEOUT" ||
                    data.code === "NETWORK_ERROR" ||
                    data.code === "QUOTA_EXCEEDED" ||
                    (response.status >= 500 && response.status < 600);

                if (isRetryable && attempt < MAX_RETRIES) {
                    // Wait before retrying (exponential backoff)
                    const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return sendMessageWithRetry(messageText, attempt + 1);
                }

                // Handle specific error responses from the API
                const errorMessage = getErrorMessage(data);
                throw new Error(errorMessage);
            }

            // Reset retry count on success
            setRetryCount(0);

            // Add AI response
            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: data.response,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            if (attempt < MAX_RETRIES) {
                // Check if it's a network error that we should retry
                const isNetworkError =
                    error instanceof TypeError && error.message.includes("fetch");
                if (isNetworkError) {
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return sendMessageWithRetry(messageText, attempt + 1);
                }
            }

            // If we've exhausted retries or it's not a retryable error, throw it
            throw error;
        }
    };

    const handleSendMessage = async () => {
        if (message.trim() && !isLoading) {
            setIsLoading(true);

            // Add user message
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                content: message,
                isUser: true,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsInitialState(false);

            const currentMessage = message;
            setMessage("");

            try {
                await sendMessageWithRetry(currentMessage);
            } catch (error) {
                console.error("Error sending message:", error);
                setRetryCount((prev) => prev + 1);

                // Add error message with retry info if applicable
                let errorContent =
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred. Please try again.";

                if (retryCount >= 2) {
                    errorContent +=
                        "\n\n💡 Tip: If you continue having issues, try refreshing the page or checking your internet connection.";
                }

                const errorMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    content: errorContent,
                    isUser: false,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessage(suggestion);
        // Focus the input after clicking suggestion
        setTimeout(() => {
            const input = document.querySelector(
                'input[type="text"]'
            ) as HTMLInputElement;
            input?.focus();
        }, 100);
    };

    return {
        // State
        message,
        messages,
        isInitialState,
        isLoading,
        retryCount,
        chatContainerRef,
        messagesEndRef,

        // Actions
        setMessage,
        handleSendMessage,
        handleKeyDown,
        handleSuggestionClick,
    };
};