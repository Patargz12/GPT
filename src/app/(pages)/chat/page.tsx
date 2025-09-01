"use client";

import Navbar from "@/app/components/shared/navbar";
import {
  useChat,
  ChatSuggestions,
  ChatMessageComponent,
  TypingIndicator,
  ChatInput,
} from "@/app/features/chat";

export default function ChatPage() {
  const {
    message,
    messages,
    isInitialState,
    isLoading,
    chatContainerRef,
    messagesEndRef,
    setMessage,
    handleSendMessage,
    handleKeyDown,
    handleSuggestionClick,
  } = useChat();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pt-16">
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
      </div>

      {/* Fixed Input Section at Bottom */}
      <ChatInput
        message={message}
        isLoading={isLoading}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
