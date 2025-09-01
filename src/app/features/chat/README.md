# Chat Feature

This folder contains all the chat-related functionality organized by feature.

## Structure

```
src/app/features/chat/
├── components/           # React components
│   ├── chat-input.tsx   # Input field and send button
│   ├── chat-message.tsx # Individual message display
│   ├── chat-suggestions.tsx # Welcome screen with suggestions
│   ├── typing-indicator.tsx # Loading animation
│   └── index.ts         # Component exports
├── hooks/               # Custom React hooks
│   └── use-chat.ts     # Main chat logic and state management
├── types/               # TypeScript type definitions
│   ├── api-error.ts    # API error response interface
│   ├── chat-message.ts # Chat message interface
│   └── index.ts        # Type exports
├── utils/               # Utility functions
│   └── error-messages.ts # Error message formatting
├── constants.ts         # Chat-related constants
├── index.ts            # Main exports
└── README.md           # This file
```

## Usage

Import the main hook and components from the feature:

```typescript
import {
  useChat,
  ChatSuggestions,
  ChatMessageComponent,
  TypingIndicator,
  ChatInput,
} from "@/app/features/chat";
```

## Components

### useChat Hook

Main hook that manages all chat state and logic:

- Message state management
- API communication with retry logic
- Auto-scrolling functionality
- Error handling

### ChatSuggestions

Welcome screen component with predefined suggestions for new users.

### ChatMessageComponent

Renders individual chat messages with proper styling and markdown support.

### TypingIndicator

Animated loading indicator shown when AI is responding.

### ChatInput

Input field with send button and keyboard handling.

## Types

### ChatMessage (`types/chat-message.ts`)

Interface for chat message objects with id, content, user flag, and timestamp.

### APIErrorResponse (`types/api-error.ts`)

Interface for API error responses with error details and codes.

## Constants

- `CHAT_SUGGESTIONS`: Array of predefined suggestion messages
- `MAX_RETRIES`: Maximum number of retry attempts for failed requests
- `RETRY_DELAYS`: Exponential backoff delays for retries
