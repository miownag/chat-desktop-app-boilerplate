import { createFileRoute } from "@tanstack/react-router";
import Sender from "@/components/sender";
import { useState } from "react";
import MessageList from "@/components/message-list";

export const Route = createFileRoute("/")({
  component: IndexComponent,
});

const initialMessages = [
  {
    id: 1,
    role: "user",
    content: "Hello! Can you help me with a coding question?",
  },
  {
    id: 2,
    role: "assistant",
    content:
      "Of course! I'd be happy to help with your coding question. What would you like to know?",
  },
  {
    id: 3,
    role: "user",
    content: "How do I create a responsive layout with CSS Grid?",
  },
  {
    id: 4,
    role: "assistant",
    content:
      "Creating a responsive layout with CSS Grid is straightforward. Here's a basic example:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}\n```\n\nThis creates a grid where:\n- Columns automatically fit as many as possible\n- Each column is at least 250px wide\n- Columns expand to fill available space\n- There's a 1rem gap between items\n\nWould you like me to explain more about how this works?",
  },
];

function IndexComponent() {
  const [enableDeepThink, setEnableDeepThink] = useState(false);
  const [enableSearch, setEnableSearch] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialMessages);

  return (
    <div className="p-6 flex-1 flex flex-col items-center justify-center overflow-auto">
      <MessageList chatMessages={chatMessages} />
      <Sender
        enableDeepThink={enableDeepThink}
        setEnableDeepThink={setEnableDeepThink}
        enableSearch={enableSearch}
        setEnableSearch={setEnableSearch}
      />
    </div>
  );
}
