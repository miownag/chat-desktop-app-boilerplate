# Chat Desktop App Server API Documentation

## Base URL
`http://localhost:3000`

## Endpoints

### Health Check
- **GET** `/health` - Check server health status

### Sessions Management
- **GET** `/api/sessions/list` - Get paginated session list
  - Query parameters:
    - `page` (optional): Page number (default: 1)
    - `pageSize` (optional): Items per page (default: 10)
- **POST** `/api/sessions/create` - Create new session
  - Request body: `{ title?: string }`
- **GET** `/api/sessions/get/:id` - Get session by ID
- **DELETE** `/api/sessions/delete/:id` - Delete session

### Messages Management
- **GET** `/api/messages/list` - Get paginated messages for a session
  - Query parameters:
    - `sessionId` (required): Session ID
    - `page` (optional): Page number (default: 1)
    - `pageSize` (optional): Items per page (default: 50)
- **POST** `/api/messages/send` - Send message (returns SSE stream)
  - Request body: `{ sessionId: string, content: string, context?: {...} }`
  - Response: Server-Sent Events stream with message chunks

## Example Usage

### Create a new session
```bash
curl -X POST http://localhost:3000/api/sessions/create \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat Session"}'
```

### Send a message (SSE)
```bash
curl -X POST http://localhost:3000/api/messages/send \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "1",
    "content": "Hello, how are you?",
    "context": {
      "systemPrompt": "You are a helpful assistant.",
      "temperature": 0.7
    }
  }'
```

### Get session messages
```bash
curl "http://localhost:3000/api/messages/list?sessionId=1&page=1&pageSize=10"
```

## Response Formats

### Paginated Response
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

### SSE Message Format
```
data: {"type": "user_message", "data": {...}}

data: {"type": "assistant_message_chunk", "data": {"content": "Hello", "done": false}}

data: {"type": "assistant_message", "data": {...}}

data: {"type": "done"}
```

## Error Responses
All errors follow this format:
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "requestId": "abc123"
}
```