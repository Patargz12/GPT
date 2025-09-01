# Error Handling Test Cases

## Test the comprehensive error handling implementation

**Now using Gemini 2.0 Flash Experimental model for enhanced performance and capabilities**

### API Route Error Handling Tests:

1. **Invalid API Key (401)**

   - Temporarily change the API key in .env to an invalid one
   - Expected: "🔑 The AI service is not properly configured. Please contact support."

2. **Missing Message (400)**

   - Send empty message
   - Expected: "📝 Please enter a message before sending."

3. **Message Too Long (400)**

   - Send message over 4000 characters
   - Expected: "📏 Your message is too long. Please keep it under 4000 characters."

4. **Rate Limiting (429)**

   - Send many requests quickly
   - Expected: "⏳ Too many requests right now. Please wait a moment and try again."

5. **Network Error**
   - Disconnect internet during request
   - Expected: "🌐 Network connection issue. Please check your internet and try again."

### Client-Side Error Handling Features:

1. **Retry Mechanism**

   - Automatically retries failed requests up to 3 times
   - Uses exponential backoff (1s, 2s, 4s delays)
   - Only retries for retryable errors (timeout, network, quota, 5xx)

2. **Visual Error Indicators**

   - Red background for critical errors (🔑, 🚫, ❌, ⚠️)
   - Yellow background for temporary issues (⏳, ⏱️, 🌐)
   - Blue background for service issues (🤖, 🔧)

3. **Loading States**

   - Spinner animation in send button
   - Typing indicator with animated dots
   - Disabled input during processing

4. **Error Recovery Tips**
   - After 2+ consecutive errors, shows helpful tips
   - Suggests refreshing page or checking connection

### Error Codes Handled:

- `INVALID_API_KEY` - Authentication failed
- `PERMISSION_DENIED` - Access denied
- `QUOTA_EXCEEDED` - Rate limit exceeded
- `MODEL_NOT_FOUND` - AI model unavailable
- `CONTENT_BLOCKED` - Safety filter blocked content
- `TIMEOUT` - Request timeout
- `NETWORK_ERROR` - Network connectivity issues
- `SERVICE_UNAVAILABLE` - AI service unavailable
- `MISSING_MESSAGE` - Empty message
- `MESSAGE_TOO_LONG` - Message exceeds limit
- `INVALID_JSON` - Malformed request
- `EMPTY_AI_RESPONSE` - AI returned empty response
- `INTERNAL_ERROR` - Generic server error
