import { pick } from "es-toolkit";
import { useState } from "react";
import { GiSittingDog } from "react-icons/gi";
import { MdAdd } from "react-icons/md";
import { RiSideBarLine } from "react-icons/ri";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { useShallowChatBotStore } from "@/stores";
import AlertDialogConfirm from "../alert-confirm";
import Space from "../space";
import { Button } from "../ui/button";
import "./index.css";
import ConversationList from "../conversation-list";

const conversationHistory = [
  {
    period: "Today",
    conversations: [
      {
        id: "t1",
        title: "Project roadmap discussion",
        lastMessage:
          "Let's prioritize the authentication features for the next sprint.",
        timestamp: new Date().setHours(new Date().getHours() - 2),
      },
      {
        id: "t2",
        title: "API Documentation Review",
        lastMessage:
          "The endpoint descriptions need more detail about rate limiting.",
        timestamp: new Date().setHours(new Date().getHours() - 5),
      },
      {
        id: "t3",
        title: "Frontend Bug Analysis",
        lastMessage:
          "I found the issue - we need to handle the null state in the user profile component.",
        timestamp: new Date().setHours(new Date().getHours() - 8),
      },
    ],
  },
  {
    period: "Yesterday",
    conversations: [
      {
        id: "y1",
        title: "Database Schema Design",
        lastMessage:
          "Let's add indexes to improve query performance on these tables.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
      {
        id: "y2",
        title: "Performance Optimization",
        lastMessage:
          "The lazy loading implementation reduced initial load time by 40%.",
        timestamp: new Date().setDate(new Date().getDate() - 1),
      },
    ],
  },
  {
    period: "Last 7 days",
    conversations: [
      {
        id: "w1",
        title: "Authentication Flow",
        lastMessage: "We should implement the OAuth2 flow with refresh tokens.",
        timestamp: new Date().setDate(new Date().getDate() - 3),
      },
      {
        id: "w2",
        title: "Component Library",
        lastMessage:
          "These new UI components follow the design system guidelines perfectly.",
        timestamp: new Date().setDate(new Date().getDate() - 5),
      },
      {
        id: "w3",
        title: "UI/UX Feedback",
        lastMessage:
          "The navigation redesign received positive feedback from the test group.",
        timestamp: new Date().setDate(new Date().getDate() - 6),
      },
    ],
  },
  {
    period: "Last month",
    conversations: [
      {
        id: "m1",
        title: "Initial Project Setup",
        lastMessage:
          "All the development environments are now configured consistently.",
        timestamp: new Date().setDate(new Date().getDate() - 15),
      },
    ],
  },
];

function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const { addNewConversation } = useShallowChatBotStore((state) =>
    pick(state, [
      "currentConversationId",
      "setCurrentConversationId",
      "addNewConversation",
    ])
  );

  return (
    <Sidebar className="px-0.5 py-2">
      <AlertDialogConfirm
        title="Are you sure to delete?"
        description="This action cannot be undone. This will permanently delete this conversation."
        open={alertOpen}
        setOpen={setAlertOpen}
        onConfirm={() => {
          // TODO: 删除接口 & 刷新列表
          console.log("Delete conversation with id:", alertId);
          setAlertOpen(false);
        }}
      />
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Space gap={3}>
            <img src="/chat.png" alt="chatbot" className="w-8 h-8" />
            <div className="font-bold font-mono text-lg bg-linear-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">Chatbot</div>
          </Space>
          {open && (
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer"
              onClick={toggleSidebar}
            >
              <RiSideBarLine className="w-5! h-5! text-neutral-500" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="mt-3 cursor-pointer"
          onClick={addNewConversation}
        >
          <MdAdd />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="sidebar-content">
        <ConversationList
          historyConversations={conversationHistory}
          setAlertId={setAlertId}
          setAlertOpen={setAlertOpen}
        />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
