import type { ChatMessage } from "@/components/message-list";
import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { cn } from "@/lib/utils";
import { LuCopy } from "react-icons/lu";

interface UserMessageProps {
  message: ChatMessage;
}

function UserMessage({ message }: UserMessageProps) {
  return (
    <Message
      key={message.id}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 items-start"
    >
      <div className="group flex flex-col items-end gap-1">
        <div className="flex flex-row-reverse gap-4">
          <MessageAvatar src="https://github.com/ibelick.png" alt="Ibelick" />
          <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%]">
            {message.content}
          </MessageContent>
        </div>
        <MessageActions
          className={cn("mr-10 flex gap-0 opacity-0 group-hover:opacity-100")}
        >
          <MessageAction tooltip="Copy" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <LuCopy />
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}

export default UserMessage;
