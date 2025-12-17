import { pick } from "es-toolkit";
import { useState } from "react";
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
            <div className="font-bold font-mono text-lg bg-linear-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              Chatbot
            </div>
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
        <ConversationList setAlertId={setAlertId} setAlertOpen={setAlertOpen} />
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
