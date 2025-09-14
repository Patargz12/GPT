"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );

      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

const MIN_HEIGHT = 48;
const MAX_HEIGHT = 120;

export const ChatInput = ({
  message,
  isLoading,
  onMessageChange,
  onSendMessage,
  onKeyDown,
}: ChatInputProps) => {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: MIN_HEIGHT,
    maxHeight: MAX_HEIGHT,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent double send by disabling submit while isSubmitting or isLoading
  const handleSubmit = useCallback(() => {
    if (message.trim() && !isLoading && !isSubmitting) {
      setIsSubmitting(true);
      onSendMessage();
      adjustHeight(true);
      // Reset submitting state after a short delay
      setTimeout(() => setIsSubmitting(false), 500);
    }
  }, [message, isLoading, isSubmitting, onSendMessage, adjustHeight]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onMessageChange(e.target.value);
    adjustHeight();
  };

  const handleKeyDownInternal = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        // Only submit if not submitting or loading
        if (!isSubmitting && !isLoading) {
          e.preventDefault();
          handleSubmit();
        } else {
          e.preventDefault();
        }
      }
      onKeyDown(e);
    },
    [handleSubmit, onKeyDown, isSubmitting, isLoading]
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 p-3">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-full px-4 py-2 w-full">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-full">
            <Textarea
              value={message}
              placeholder="Ask me anything about Dota 2..."
              className="w-full rounded-full px-4 py-4 bg-white scrollbar-none overflow-hidden dark:bg-slate-800 border-none text-black dark:text-white placeholder-gray-400 resize-none focus-visible:ring-0 leading-[1.2] min-h-0"
              ref={textareaRef}
              onKeyDown={handleKeyDownInternal}
              onChange={handleTextareaChange}
              style={{
                minHeight: MIN_HEIGHT,
                maxHeight: MAX_HEIGHT,
                height: undefined,
              }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim() || isLoading || isSubmitting}
              className={cn(
                "ml-2 mr-4 rounded-full p-2 transition-colors",
                message.trim() && !isLoading && !isSubmitting
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-slate-200"
                  : "bg-slate-200 text-gray-400 cursor-not-allowed dark:bg-slate-700 dark:text-gray-500"
              )}
            >
              {isLoading ? (
                <div className="w-4 h-4  rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
