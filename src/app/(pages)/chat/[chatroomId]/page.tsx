"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Navbar from "@/app/components/shared/navbar";
import {
  useChat,
  ChatSuggestions,
  ChatMessageComponent,
  TypingIndicator,
  ChatInput,
} from "@/app/features/chat";
import ChatHistorySidebar from "@/app/features/chat/components/chat-history-sidebar";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function ChatroomPage() {
  const params = useParams();
  const router = useRouter();
  const chatroomId = params.chatroomId as string;
  const { isAuthenticated } = useAuthStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    message,
    messages,
    isInitialState,
    isLoading,
    chatContainerRef,
    messagesEndRef,
    currentChatroomId,
    chatHistory,
    setMessage,
    handleSendMessage,
    handleKeyDown,
    handleSuggestionClick,
    startNewChat,
    loadChatroomMessages,
  } = useChat(chatroomId);

  const handleChatroomSelect = (selectedChatroomId: string) => {
    router.push(`/chat/${selectedChatroomId}`);
  };

  const handleNewChat = () => {
    router.push("/chat");
    startNewChat();
  };

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Fixed Chat History Sidebar - Only for authenticated users */}
      {isAuthenticated && (
        <div className="fixed left-0 top-16 bottom-0 z-10">
          <ChatHistorySidebar
            chatHistory={chatHistory}
            currentChatroomId={currentChatroomId}
            onChatroomSelect={handleChatroomSelect}
            onNewChat={handleNewChat}
            onCollapsedChange={handleSidebarCollapsedChange}
            isLoading={false}
          />
        </div>
      )}

      {/* Main Content Area - with conditional left margin based on authentication */}
      <div
        className={`flex-1 flex flex-col pt-16 transition-all duration-300 ${
          isAuthenticated ? (isSidebarCollapsed ? "ml-12" : "ml-80") : "ml-0"
        }`}
      >
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Initial Welcome State */}
          {isInitialState && (
            <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
          )}

          {/* Chat Messages Area */}
          {!isInitialState && (
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 pb-32 scroll-smooth"
              style={{
                scrollBehavior: "smooth",
                overflowAnchor: "none",
              }}
            >
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <ChatMessageComponent key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                {isLoading && <TypingIndicator />}

                {/* Invisible scroll target at the very bottom */}
                <div ref={messagesEndRef} className="h-0 w-full" />
              </div>
            </div>
          )}

          {/* Fixed Input Section at Bottom */}
          <ChatInput
            message={message}
            isLoading={isLoading}
            onMessageChange={setMessage}
            onSendMessage={handleSendMessage}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
