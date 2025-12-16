# Chat Desktop App Server

A Hono-based backend server for a chat desktop application with session management and real-time messaging capabilities.

## Project Structure

```
src/
├── types/             # TypeScript type definitions
│   ├── index.ts       # Main type definitions
│   └── context.ts     # Hono context types
├── middleware/        # Custom middleware
│   └── index.ts       # Request logger, error handler
├── services/          # Business logic and data services
│   └── index.ts       # Session and message services
├── routes/            # API route handlers
│   ├── health.ts      # Health check endpoint
│   ├── sessions.ts    # Session management endpoints
│   └── messages.ts    # Message management endpoints
├── app.ts             # Main application setup
└── index.ts           # Server entry point
```

## Features

- **Session Management**: Create, list, and delete chat sessions
- **Message Management**: Send and retrieve messages with pagination
- **Real-time Messaging**: Server-Sent Events (SSE) for streaming responses
- **Error Handling**: Comprehensive error handling with request IDs
- **Logging**: Request/response logging with timing information
- **CORS**: Cross-Origin Resource Sharing support
- **Health Checks**: Server health monitoring

## Getting Started

### Prerequisites
- Bun runtime
- Node.js (optional, for development)

### Installation
```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```

### Environment Variables
- `PORT`: Server port (default: 3000)

## API Endpoints

See [API.md](./API.md) for detailed API documentation.

## Architecture

### Middleware
- **Request Logger**: Logs all incoming requests with timing information
- **Error Handler**: Catches and formats errors with request IDs
- **CORS**: Handles cross-origin requests

### Services
- **SessionService**: Manages chat sessions with in-memory storage
- **MessageService**: Handles message operations within sessions

### Routes
- **Health**: `/health` - Server health status
- **Sessions**: `/api/sessions` - Session CRUD operations
- **Messages**: `/api/messages` - Message operations with SSE support

## Mock Data

The server comes pre-loaded with mock data for testing:
- 2 sample sessions ("General Chat", "Code Review")
- Sample messages for each session

## Development

The server supports hot reloading during development. Changes to source files will automatically restart the server.

## Production Deployment

For production deployment:
1. Build the application: `bun run build`
2. Set appropriate environment variables
3. Start the server: `bun run start`