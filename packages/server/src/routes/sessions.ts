import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { AppContext } from "../types/context";
import { SessionService } from "../services";
import { PaginatedResponse } from "../types";

const sessions = new Hono<AppContext>();

sessions.post(
  "/list",
  zValidator(
    "json",
    z.object({
      page: z.number(),
      pageSize: z.number(),
    })
  ),
  async (c) => {
    const { page, pageSize } = c.req.valid("json");
    const result = await SessionService.getSessions(page, pageSize);

    return c.json<PaginatedResponse<any>>(result);
  }
);

// Create new session
sessions.post(
  "/create",
  zValidator(
    "json",
    z.object({
      title: z.string().optional(),
    })
  ),
  async (c) => {
    const { title } = c.req.valid("json");
    const session = await SessionService.createSession(title || "New Chat");

    return c.json(session);
  }
);

// Get session by ID
sessions.get("/get/:id", async (c) => {
  const id = c.req.param("id");
  const session = await SessionService.getSessionById(id);

  if (!session) {
    return c.json({ error: "Session not found" }, 404);
  }

  return c.json(session);
});

// Delete session
sessions.get(
  "/delete/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");
    const deleted = await SessionService.deleteSession(id);

    if (!deleted) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json({ message: "Session deleted successfully" });
  }
);

export default sessions;
