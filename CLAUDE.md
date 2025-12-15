# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A chat desktop application boilerplate built with:
- **Frontend**: React 19, TanStack Router, Vite
- **Desktop**: Tauri v2 (Rust)
- **UI**: shadcn/ui components, Tailwind CSS v4
- **State**: Zustand with Immer middleware
- **Package Manager**: Bun (monorepo with workspaces)

## Architecture

### Monorepo Structure
- Root workspace manages the monorepo with Bun workspaces
- `packages/client/` - The main Tauri desktop application
  - `src/` - React frontend code
  - `src-tauri/` - Rust backend code

### Frontend Architecture
**Routing**: File-based routing using TanStack Router
- Routes defined in `src/routes/` directory
- `__root.tsx` defines the root layout with sidebar and header
- `index.tsx` is the main chat interface
- Route tree auto-generated in `routeTree.gen.ts` by the TanStack Router plugin

**State Management**: Centralized in `src/stores/`
- Uses Zustand with Immer middleware for immutable state updates
- `useChatBotStore` - Main store for sidebar visibility and conversation state
- `useShallowChatBotStore` - Performance-optimized shallow selector hook

**Component Structure**:
- `components/ui/` - shadcn/ui base components (Button, Input, Dialog, etc.)
- `components/app-sidebar/` - Main sidebar with conversation history
- `components/sender/` - Chat message input component
- `components/conversation-list/` - List of conversation history grouped by period
- `components/header-menu/` - Top header menu
- Path alias `@/` maps to `/src` via Vite and TypeScript config

**Styling**:
- Tailwind CSS v4 via Vite plugin
- No separate config file needed for Tailwind v4
- Uses `cn()` utility in `lib/utils.ts` for conditional class merging

### Tauri Configuration
- Product name: "Chatbot Desktop"
- Default window: 800x600 (minimum), transparent title bar
- Dev server: port 1420, HMR on port 1421
- Dev command: `pnpm dev`, Build command: `pnpm build`
- Frontend dist: `packages/client/dist`

## Development Commands

```bash
# Install dependencies (root)
bun install

# Run development server
bun run dev
# Or from packages/client:
cd packages/client && bun dev

# Build TypeScript and Vite
cd packages/client && bun build

# Tauri commands
cd packages/client && bun tauri dev     # Run Tauri in development
cd packages/client && bun tauri build   # Build production app
```

## Key Implementation Notes

### Adding New Routes
1. Create file in `packages/client/src/routes/` (e.g., `about.tsx`)
2. Export a route using `createFileRoute()` from `@tanstack/react-router`
3. Route tree regenerates automatically via TanStack Router plugin

### State Management Pattern
- Use `useShallowChatBotStore` with selector for component subscriptions
- Immer middleware allows direct mutation syntax: `state.field = newValue`
- Pick only needed state slices using `es-toolkit/pick` for optimization

### Styling Components
- Import shadcn/ui components from `@/components/ui/`
- Use `cn()` utility to merge Tailwind classes with variants
- All components use Tailwind v4 inline class syntax

### Current Limitations
The application currently has placeholder implementations for:
- `addNewConversation()` in store - marked with TODO
- Conversation deletion in AppSidebar - marked with TODO
- Mock conversation data in `app-sidebar/index.tsx` (lines 19-102)

These should be connected to actual backend/API implementations.
