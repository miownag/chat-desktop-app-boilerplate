import { Hono } from "hono";
import { cors } from "hono/cors";
import { requestLogger, errorHandler, responseWrapper } from "./middleware";
import healthRoutes from "./routes/health";
import sessionRoutes from "./routes/sessions";
import messageRoutes from "./routes/messages";

const app = new Hono();

// Global middleware
app.use("*", requestLogger);
app.use("*", errorHandler);
app.use("*", responseWrapper);
app.use("*", cors());

// Routes
app.route("/health", healthRoutes);
app.route("/api/sessions", sessionRoutes);
app.route("/api/messages", messageRoutes);

// Root route
app.get("/", (c) => {
  return c.json({
    message: "Chat Desktop App API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      sessions: "/api/sessions",
      messages: "/api/messages",
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json(
    { error: "Not Found", message: "The requested resource was not found" },
    404
  );
});

export default app;
