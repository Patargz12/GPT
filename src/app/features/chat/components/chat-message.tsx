"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "motion/react";
import { ChatMessage as ChatMessageType } from "../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isErrorMessage =
    message.content.includes("🔑") ||
    message.content.includes("🚫") ||
    message.content.includes("❌") ||
    message.content.includes("⚠️");

  const isWarningMessage =
    message.content.includes("⏳") ||
    message.content.includes("⏱️") ||
    message.content.includes("🌐");

  const isInfoMessage =
    message.content.includes("🤖") || message.content.includes("🔧");

  const getMessageStyles = () => {
    if (message.isUser) {
      return "bg-red-600 text-white";
    }

    if (isErrorMessage) {
      return "bg-red-900/30 text-red-200 border border-red-700/50";
    }

    if (isWarningMessage) {
      return "bg-yellow-900/30 text-yellow-200 border border-yellow-700/50";
    }

    if (isInfoMessage) {
      return "bg-blue-900/30 text-blue-200 border border-blue-700/50";
    }

    return "bg-slate-800 text-gray-100 border border-slate-700";
  };

  return (
    <div className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${getMessageStyles()}`}
      >
        {message.isUser ? (
          <p className="text-sm md:text-base whitespace-pre-line">
            {message.content}
          </p>
        ) : (
          <motion.div
            className="text-sm md:text-base prose prose-invert prose-sm max-w-none prose-p:mb-3 prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0"
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
              opacity: { duration: 0.4 },
              y: { duration: 0.5 },
              filter: { duration: 0.4 },
            }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom styling for markdown elements
                p: ({ children }) => (
                  <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-white">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-200">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-4 mb-3 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-4 mb-3 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-gray-100 pl-2 leading-relaxed">
                    {children}
                  </li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-slate-700/50 text-red-300 px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-slate-700/50 text-gray-200 p-3 rounded-lg text-sm font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-slate-700/50 p-3 rounded-lg overflow-x-auto mb-2">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-red-500 pl-4 italic text-gray-300 mb-2">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => (
                  <h1 className="text-xl font-bold text-white mb-3 mt-4 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-lg font-bold text-white mb-3 mt-4 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-bold text-white mb-2 mt-3 first:mt-0">
                    {children}
                  </h3>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-2">
                    <table className="min-w-full border-collapse border border-slate-600">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-slate-600 bg-slate-700 px-3 py-2 text-left font-semibold text-white">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-slate-600 px-3 py-2 text-gray-200">
                    {children}
                  </td>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </motion.div>
        )}
      </div>
    </div>
  );
};
