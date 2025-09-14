"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "../types";
import { getErrorMessage } from "../utils/error-messages";
import { MAX_RETRIES } from "../constants";
import { Chatroom, DisplayMessage } from "@/types/chatroom";
import { LocalChatStorage, LocalChatroom } from "@/lib/local-chat-storage";
import { useAuthStore } from "@/lib/stores/auth-store";

export const useChat = (initialChatroomId?: string) => {
    const { isAuthenticated, token } = useAuthStore();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const [isInitialState, setIsInitialState] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [currentChatroomId, setCurrentChatroomId] = useState<string | null>(initialChatroomId || null);
    const [chatHistory, setChatHistory] = useState<(Chatroom | LocalChatroom)[]>([]);
    const [isSending, setIsSending] = useState(false); // Prevent double sends
    const [activeRequestId, setActiveRequestId] = useState<string | null>(null); // Track active request (for UI)
    const activeRequestIdRef = useRef<string | null>(null); // For async logic

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

    // Deduplicate bot responses by user message content: only keep one bot response per unique user message content
    const deduplicateMessages = useCallback((messages: ChatMessage[]): ChatMessage[] => {
        console.log('🔍 Deduplicating messages. Input count:', messages.length);
        messages.forEach((msg, idx) => {
            console.log(`[dedup] [${idx}] id: ${msg.id}, isUser: ${msg.isUser}, content: ${msg.content}`);
        });

        const seenIds = new Set<string>();
        const userContentToBotIdx: Record<string, number> = {};
        const userContentToUserIdx: Record<string, number> = {};
        // Find the latest user and bot message index for each user message content
        messages.forEach((msg, idx) => {
            if (msg.isUser) {
                userContentToUserIdx[msg.content.trim()] = idx;
            } else if (msg.id.endsWith('_bot')) {
                // Find the closest user message above this bot message
                for (let j = idx - 1; j >= 0; j--) {
                    if (messages[j].isUser) {
                        userContentToBotIdx[messages[j].content.trim()] = idx;
                        break;
                    }
                }
            }
        });

        const result: ChatMessage[] = [];
        messages.forEach((msg, idx) => {
            if (msg.isUser) {
                if (!seenIds.has(msg.id)) {
                    seenIds.add(msg.id);
                    result.push(msg);
                    console.log('✅ Message kept:', msg.id, 'USER', msg.content.substring(0, 50) + '...');
                } else {
                    console.log('❌ Duplicate USER ID detected, skipping:', msg.id);
                }
            } else if (msg.id.endsWith('_bot')) {
                // Only keep the latest bot message for each user message content
                let keep = false;
                for (const userContent in userContentToBotIdx) {
                    if (userContentToBotIdx[userContent] === idx) {
                        keep = true;
                        break;
                    }
                }
                if (keep && !seenIds.has(msg.id)) {
                    seenIds.add(msg.id);
                    result.push(msg);
                    console.log('✅ Message kept:', msg.id, 'AI', msg.content.substring(0, 50) + '...');
                } else {
                    console.log('❌ Duplicate or older bot response for user message, skipping:', msg.id);
                }
            } else {
                // For other messages (e.g., errors), deduplicate by id
                if (!seenIds.has(msg.id)) {
                    seenIds.add(msg.id);
                    result.push(msg);
                    console.log('✅ Message kept:', msg.id, msg.isUser ? 'USER' : 'AI', msg.content.substring(0, 50) + '...');
                } else {
                    console.log('❌ Duplicate ID detected, skipping:', msg.id);
                }
            }
        });

        console.log('🔍 Deduplication complete. Output count:', result.length);
        return result;
    }, []);

    // Wrapper for setMessages that always deduplicates
    const setMessagesWithDedup = useCallback((updater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
        console.log('📝 setMessagesWithDedup called');
        setMessages(prev => {
            console.log('📝 Previous messages:', prev.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));
            const newMessages = typeof updater === 'function' ? updater(prev) : updater;
            console.log('📝 New messages before dedup:', newMessages.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));
            const dedupedMessages = deduplicateMessages(newMessages);
            console.log('📝 Final messages after dedup:', dedupedMessages.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));
            return dedupedMessages;
        });
    }, [deduplicateMessages]);

    const loadChatHistory = useCallback(async () => {
        try {
            if (isAuthenticated) {
                // Load from database for authenticated users
                const headers: HeadersInit = {};
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch('/api/chatrooms', { headers });
                const data = await response.json();

                if (data.success) {
                    setChatHistory(data.data.chatrooms);
                }
            } else {
                // Load from localStorage for unauthenticated users
                const localChatrooms = LocalChatStorage.getChatrooms();
                setChatHistory(localChatrooms);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }, [isAuthenticated, token]);

    const loadChatroomMessages = useCallback(async (chatroomId: string) => {
        // Don't reload if we're already in this chatroom
        if (currentChatroomId === chatroomId) {
            return;
        }

        try {
            setIsLoading(true);

            if (isAuthenticated && !chatroomId.startsWith('local_')) {
                // Load from database for authenticated users
                const headers: HeadersInit = {};
                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(`/api/chatrooms/${chatroomId}`, { headers });
                const data = await response.json();

                if (data.success) {
                    const displayMessages = data.data.messages;
                    const convertedMessages: ChatMessage[] = displayMessages.map((msg: DisplayMessage) => ({
                        id: msg.id,
                        content: msg.content,
                        isUser: msg.isUser,
                        timestamp: new Date(msg.timestamp)
                    }));

                    setMessagesWithDedup(convertedMessages);
                    setCurrentChatroomId(chatroomId);
                    setIsInitialState(convertedMessages.length === 0);
                }
            } else {
                // Load from localStorage for unauthenticated users or local chatrooms
                const localChatroom = LocalChatStorage.getChatroom(chatroomId);
                if (localChatroom) {
                    const convertedMessages: ChatMessage[] = localChatroom.messages.map(msg => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }));

                    setMessagesWithDedup(convertedMessages);
                    setCurrentChatroomId(chatroomId);
                    setIsInitialState(convertedMessages.length === 0);
                }
            }
        } catch (error) {
            console.error('Failed to load chatroom messages:', error);
        } finally {
            setIsLoading(false);
        }
    }, [currentChatroomId, setMessagesWithDedup, isAuthenticated, token]);

    // Load chat history on mount
    useEffect(() => {
        loadChatHistory();
    }, [loadChatHistory]);

    // Load chatroom messages if chatroomId is provided
    useEffect(() => {
        if (initialChatroomId) {
            loadChatroomMessages(initialChatroomId);
        }
    }, [initialChatroomId, loadChatroomMessages]);

    const startNewChat = useCallback(() => {
        setMessagesWithDedup([]);
        setCurrentChatroomId(null);
        setIsInitialState(true);
        setMessage("");
        setActiveRequestId(null);
    }, [setMessagesWithDedup]);



    const sendMessageWithRetry = useCallback(async (
        messageText: string,
        tempMessageId: string,
        requestId: string,
        attempt: number = 1
    ): Promise<void> => {
        // Check if this request is still active (using ref for up-to-date value)
        if (activeRequestIdRef.current !== requestId) {
            console.log('Request cancelled or superseded (ref):', requestId, 'Current:', activeRequestIdRef.current);
            return;
        }
        try {
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            // Add auth header for authenticated users
            if (isAuthenticated && token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const isLocalChatroom = currentChatroomId?.startsWith('local_');

            console.log('[DEBUG] Sending fetch to /api/chat', {
                messageText,
                chatroomId: currentChatroomId,
                isLocal: !isAuthenticated || isLocalChatroom,
                headers,
                attempt,
                requestId,
            });

            const response = await fetch("/api/chat", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    message: messageText,
                    chatroomId: currentChatroomId,
                    isLocal: !isAuthenticated || isLocalChatroom
                }),
            });

            console.log('[DEBUG] Fetch response status:', response.status);
            let data;
            try {
                data = await response.json();
                console.log('[DEBUG] Response JSON:', data);
            } catch (jsonErr) {
                console.error('[ERROR] Failed to parse response JSON:', jsonErr);
                throw new Error('Failed to parse response JSON');
            }

            if (!response.ok) {
                // Check if this is a retryable error
                const isRetryable =
                    data.code === "TIMEOUT" ||
                    data.code === "NETWORK_ERROR" ||
                    data.code === "QUOTA_EXCEEDED" ||
                    (response.status >= 500 && response.status < 600);

                console.warn('[WARN] Response not OK. Retryable:', isRetryable, 'Attempt:', attempt, 'Data:', data);

                if (isRetryable && attempt < MAX_RETRIES) {
                    // Wait before retrying (exponential backoff)
                    const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s
                    console.log(`[DEBUG] Retrying after ${delay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return sendMessageWithRetry(messageText, tempMessageId, requestId, attempt + 1);
                }

                // Handle specific error responses from the API
                const errorMessage = getErrorMessage(data);
                console.error('[ERROR] API error:', errorMessage);
                throw new Error(errorMessage);
            }

            // Reset retry count on success
            setRetryCount(0);

            // Handle response based on authentication status
            if (data.isAuthenticated && !data.isLocal) {
                // Authenticated user - database storage
                if (data.chatroomId && !currentChatroomId) {
                    setCurrentChatroomId(data.chatroomId);
                    window.history.pushState({}, '', `/chat/${data.chatroomId}`);
                }

                // Update the temporary user message with the real ID from server, ensuring no duplicate
                if (data.messagePairId) {
                    setMessagesWithDedup((prev) => {
                        // Remove any message with the new id if it exists (shouldn't, but for safety)
                        const filtered = prev.filter((msg) => msg.id !== `${data.messagePairId}_user`);
                        return filtered.map((msg) =>
                            msg.id === tempMessageId
                                ? { ...msg, id: `${data.messagePairId}_user` }
                                : msg
                        );
                    });
                }

                // Add AI response (only if not already present)
                const aiMessageId = `${data.messagePairId}_bot`;
                setMessagesWithDedup((prev) => {
                    if (prev.some((msg) => msg.id === aiMessageId)) return prev;
                    return [...prev, {
                        id: aiMessageId,
                        content: data.response,
                        isUser: false,
                        timestamp: new Date(),
                    }];
                });

                loadChatHistory();
            } else {
                // Unauthenticated user - local storage
                let localChatroomId = currentChatroomId;

                // Create new local chatroom if needed
                if (!localChatroomId) {
                    const title = LocalChatStorage.generateTitle(messageText);
                    const newChatroom = LocalChatStorage.createChatroom(title);
                    localChatroomId = newChatroom.id;
                    setCurrentChatroomId(localChatroomId);
                    window.history.pushState({}, '', `/chat/${localChatroomId}`);
                }

                // Update user message ID
                const userMessageId = `${data.messagePairId}_user`;
                setMessagesWithDedup((prev) =>
                    prev.map((msg) =>
                        msg.id === tempMessageId
                            ? { ...msg, id: userMessageId }
                            : msg
                    )
                );

                // Create AI message
                const aiMessage: ChatMessage = {
                    id: `${data.messagePairId}_bot`,
                    content: data.response,
                    isUser: false,
                    timestamp: new Date(),
                };

                // Add AI message to state
                setMessagesWithDedup((prev) => [...prev, aiMessage]);

                // Save both messages to local storage
                const userMessage: ChatMessage = {
                    id: userMessageId,
                    content: messageText,
                    isUser: true,
                    timestamp: new Date(),
                };

                LocalChatStorage.addMessage(localChatroomId, userMessage);
                LocalChatStorage.addMessage(localChatroomId, aiMessage);

                // Refresh local chat history
                loadChatHistory();
            }
        } catch (error) {
            console.error('[ERROR] sendMessageWithRetry exception:', error);
            if (attempt < MAX_RETRIES) {
                // Check if it's a network error that we should retry
                const isNetworkError =
                    error instanceof TypeError && error.message.includes("fetch");
                if (isNetworkError) {
                    const delay = Math.pow(2, attempt - 1) * 1000;
                    console.log(`[DEBUG] Network error, retrying after ${delay}ms...`);
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return sendMessageWithRetry(messageText, tempMessageId, requestId, attempt + 1);
                }
            }

            // If we've exhausted retries or it's not a retryable error, throw it
            throw error;
        }
    }, [activeRequestId, isAuthenticated, token, currentChatroomId, setMessagesWithDedup, loadChatHistory]);

    const handleSendMessage = useCallback(async () => {
        console.log('🚀 handleSendMessage called');
        console.log('📊 Current state - message:', message.trim());
        console.log('📊 Current state - isLoading:', isLoading);
        console.log('📊 Current state - isSending:', isSending);
        console.log('📊 Current messages:', messages.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));

        if (!message.trim() || isLoading || isSending) {
            console.log('⛔ Prevented double send or empty message.');
            return;
        }
        console.log('🚀 handleSendMessage called');
        console.log('📊 Current state - message:', message.trim());
        console.log('📊 Current state - isLoading:', isLoading);
        console.log('📊 Current state - isSending:', isSending);
        console.log('📊 Current messages:', messages.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));

        console.log('✅ Conditions met, proceeding with send');

        // Generate unique request ID to prevent duplicates
        const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        console.log('🆔 Generated request ID:', requestId);

        setActiveRequestId(requestId);
        activeRequestIdRef.current = requestId;
        setIsLoading(true);
        setIsSending(true);

        // Add user message, but first remove any temp user messages with the same content
        const tempId = `temp_${Date.now()}`;
        const userMessage: ChatMessage = {
            id: tempId, // Temporary ID, will be replaced by server response
            content: message,
            isUser: true,
            timestamp: new Date(),
        };

        setMessagesWithDedup((prev) => {
            // Remove any temp user messages with the same content
            const filtered = prev.filter(m => !(m.isUser && m.id.startsWith('temp_') && m.content.trim() === message.trim()));
            const result = [...filtered, userMessage];
            console.log('👤 setMessagesWithDedup after aggressive deduplication:', result.map(m => ({ id: m.id, isUser: m.isUser, content: m.content })));
            return result;
        });
        setIsInitialState(false);

        const currentMessage = message;
        setMessage("");

        try {
            console.log('📤 Calling sendMessageWithRetry');
            await sendMessageWithRetry(currentMessage, tempId, requestId);
            console.log('✅ sendMessageWithRetry completed successfully');
        } catch (error) {
            console.error("❌ Error sending message:", error);
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
            setMessagesWithDedup((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsSending(false);
            // Only clear if this is still the active request
            if (activeRequestIdRef.current === requestId) {
                setActiveRequestId(null);
                activeRequestIdRef.current = null;
            }
        }
    }, [message, isLoading, isSending, retryCount, sendMessageWithRetry, setMessagesWithDedup]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        setMessage(suggestion);
        // Focus the input after clicking suggestion
        setTimeout(() => {
            const input = document.querySelector(
                'input[type="text"]'
            ) as HTMLInputElement;
            input?.focus();
        }, 100);
    }, []);

    return {
        // State
        message,
        messages,
        isInitialState,
        isLoading,
        retryCount,
        chatContainerRef,
        messagesEndRef,
        currentChatroomId,
        chatHistory,

        // Actions
        setMessage,
        handleSendMessage,
        handleKeyDown,
        handleSuggestionClick,
        startNewChat,
        loadChatroomMessages,
        loadChatHistory,
    };
};