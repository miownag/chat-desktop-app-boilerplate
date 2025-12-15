import { useShallowChatBotStore } from "@/stores";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { pick } from "es-toolkit";
import {
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import Space from "../space";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MdOutlineContentCopy, MdOutlineMoreVert } from "react-icons/md";
import { RiDeleteBin5Line, RiEmojiStickerLine } from "react-icons/ri";
import { toast } from "sonner";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "../ui/button";

interface ConversationListProps {
  historyConversations: {
    period: string;
    conversations: {
      id: string;
      title: string;
      lastMessage: string;
      timestamp: number;
    }[];
  }[];
  setAlertId: (id: string) => void;
  setAlertOpen: (open: boolean) => void;
}

function EmptyConversationList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiEmojiStickerLine />
        </EmptyMedia>
        <EmptyTitle>No Chat Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any chat yet. Get started by creating your
          first chat.
        </EmptyDescription>
      </EmptyHeader>
      <Button
        variant="link"
        asChild
        className="text-muted-foreground"
        size="sm"
      >
        <a href="https://dogbot.ai/docs/getting-started" target="_blank">
          Learn More <HiOutlineArrowUpRight />
        </a>
      </Button>
    </Empty>
  );
}

function ConversationList({
  historyConversations,
  setAlertId,
  setAlertOpen,
}: ConversationListProps) {
  const { currentConversationId, setCurrentConversationId } =
    useShallowChatBotStore((state) =>
      pick(state, [
        "currentConversationId",
        "setCurrentConversationId",
        "addNewConversation",
        "setCurrentConversationId",
      ])
    );

  const checkoutConversation = (id: string) => {
    // 注意：keep alive
    setCurrentConversationId(id);
  };

  const copyConversationId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Copied");
    } catch (_err) {
      toast.error("Failed to copy");
    }
  };

  return (
    <>
      {historyConversations?.length > 0 ? (
        historyConversations.map((group) => (
          <SidebarGroup key={group.period}>
            <SidebarGroupLabel>{group.period}</SidebarGroupLabel>
            <SidebarMenu>
              {group.conversations.map((conversation) => (
                <SidebarMenuItem
                  key={conversation.id}
                  onClick={() => checkoutConversation(conversation.id)}
                >
                  <SidebarMenuButton
                    asChild
                    className={`cursor-pointer ${
                      currentConversationId === conversation.id
                        ? "bg-neutral-100"
                        : ""
                    } transition-colors duration-200`}
                  >
                    <div className="flex justify-between items-center">
                      <Space>
                        <HiOutlineChatBubbleLeftEllipsis className="text-neutral-500" />
                        <span className="overflow-hidden text-ellipsis whitespace-nowrap max-w-43">
                          {conversation.title}
                        </span>
                      </Space>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <MdOutlineMoreVert className="text-neutral-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => copyConversationId(conversation.id)}
                            className="cursor-pointer"
                          >
                            <MdOutlineContentCopy />
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-400! cursor-pointer"
                            onClick={() => {
                              setAlertId(conversation.id);
                              setAlertOpen(true);
                            }}
                          >
                            <RiDeleteBin5Line className="text-red-400" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))
      ) : (
        <EmptyConversationList />
      )}
    </>
  );
}

export default ConversationList;
