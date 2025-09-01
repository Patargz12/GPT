# Chat Types

This folder contains all TypeScript interface definitions for the chat feature.

## Interfaces

### ChatMessage (`chat-message.ts`)

Represents a single chat message in the conversation.

```typescript
interface ChatMessage {
  id: string; // Unique identifier for the message
  content: string; // The actual message content
  isUser: boolean; // True if sent by user, false if AI response
  timestamp: Date; // When the message was created
}
```

### APIErrorResponse (`api-error.ts`)

Represents error responses from the chat API.

```typescript
interface APIErrorResponse {
  error: string; // General error message
  code: string; // Specific error code for handling
  details: string; // Additional error details
}
```

## Usage

Import types from the main types index:

```typescript
import type { ChatMessage, APIErrorResponse } from "@/app/features/chat/types";
```

Or import from the feature root:

```typescript
import type { ChatMessage, APIErrorResponse } from "@/app/features/chat";
```
