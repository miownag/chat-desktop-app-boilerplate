import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { PiSidebar } from "react-icons/pi";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import AlertDialogConfirm from "@/components/alert-confirm";
import Space from "@/components/space";
import { Button } from "@/components/ui/button";
import "./index.css";
import ConversationList from "@/components/conversation-list";
import useDeleteConversation from "@/hooks/apis/use-delete-conversation";
import { toast } from "sonner";
import { useShallowChatBotStore } from "@/stores";
import { pick } from "es-toolkit";

function AppSidebar() {
  const { open, toggleSidebar } = useSidebar();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const { currentConversationId, setCurrentConversationId } =
    useShallowChatBotStore((state) =>
      pick(state, ["currentConversationId", "setCurrentConversationId"])
    );
  const { mutateAsync: deleteConversation, isSuccess: isDeleteSuccess } =
    useDeleteConversation({
      onSuccess: () => {
        if (alertId === currentConversationId) {
          setCurrentConversationId(null);
        }
      },
    });

  const handleCreateChat = async () => {
    setCurrentConversationId("new");
  };

  return (
    <Sidebar className="px-0.5 py-1">
      <AlertDialogConfirm
        title="Are you sure to delete?"
        description="This action cannot be undone. This will permanently delete this conversation."
        open={alertOpen}
        setOpen={setAlertOpen}
        onConfirm={async () => {
          await deleteConversation(alertId || "");
          if (isDeleteSuccess) {
            toast.success("Conversation deleted successfully");
          }
          setAlertOpen(false);
          setAlertId(null);
        }}
      />
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Space gap={3}>
            <img src="/bricks.png" alt="Bricks" className="w-8 h-8" />
            <div className="font-bold font-mono text-lg gradient-text">
              Bricks
            </div>
          </Space>
          {open && (
            <Button
              size="icon"
              variant="ghost"
              className="cursor-pointer"
              onClick={toggleSidebar}
            >
              <PiSidebar className="w-6! h-6! text-neutral-500" />
            </Button>
          )}
        </div>
        <Button
          variant="outline"
          className="mt-3 cursor-pointer"
          onClick={handleCreateChat}
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
