"use client";

import { Button } from "@/components/ui/button";
import { CHAT_SUGGESTIONS } from "../constants";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatSuggestions = ({
  onSuggestionClick,
}: ChatSuggestionsProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
      <div className="text-center max-w-2xl">
        {/* Welcome Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Hello! Im your Dota 2 Assistant
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-300 mb-12 leading-relaxed">
          I&apos;m here to help you improve your Dota 2 gameplay. Ask me about
          hero strategies, item builds, matchups, or any gameplay mechanics
          you&apos;d like to understand better.
        </p>

        {/* Suggestions Section */}
        <div className="mb-8">
          <h2 className="text-lg text-gray-400 mb-6">
            Suggestions on what to ask
          </h2>

          {/* Suggestion Pills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            {CHAT_SUGGESTIONS.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSuggestionClick(suggestion)}
                className="bg-slate-800/60 border-slate-600/50 text-gray-200 hover:bg-slate-700/60 hover:border-slate-500 rounded-xl px-5 py-4 text-sm transition-all duration-200 text-left justify-start h-auto whitespace-normal"
                suppressHydrationWarning={true}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
