"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const ChatInput = ({
  message,
  isLoading,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}: ChatInputProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent p-6 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Ask me anything about Dota 2..."
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={onKeyDown}
              className="w-full bg-slate-800/80 border-slate-600 text-white placeholder-gray-400 rounded-xl px-4 py-4 text-base focus:border-red-500 focus:ring-red-500/20 backdrop-blur-sm"
              suppressHydrationWarning={true}
            />
          </div>

          <Button
            onClick={onSendMessage}
            disabled={!message.trim() || isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 rounded-xl px-4 py-4 transition-all duration-200 border-0"
            suppressHydrationWarning={true}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
