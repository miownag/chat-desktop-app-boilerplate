import { Button } from "@/components/ui/button";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message";
import { Message as MessageType } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiOutlineSync } from "react-icons/ai";
import { LuCopy } from "react-icons/lu";
import { MdCheck } from "react-icons/md";
import {
  RiThumbUpFill,
  RiThumbUpLine,
  RiThumbDownFill,
  RiThumbDownLine,
} from "react-icons/ri";

interface AssistantMessageProps {
  message: MessageType;
  isLastMessage?: boolean;
}

function AssistantMessage({ message, isLastMessage }: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleFeedback = (actionType: "like" | "dislike") => {
    const status = message.feedback;
    if (
      (status === "liked" && actionType == "like") ||
      (status === "disliked" && actionType == "dislike")
    ) {
      // TODO: cancel and update
    } else {
      // TODO: send and update
    }
  };

  const handleOnRegenerate = () => {
    // TODO: send and update
  };

  return (
    <Message
      key={message.id}
      className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 items-start"
    >
      <div className="group flex w-full flex-col gap-0">
        <div className="flex gap-4 w-full">
          <MessageAvatar src="https://github.com/ibelick.png" alt="Ibelick" />
          <MessageContent
            className="text-foreground prose flex-1 rounded-lg bg-transparent p-0"
            markdown
          >
            {message.content}
          </MessageContent>
        </div>
        <MessageActions
          className={cn(
            "ml-10 flex gap-0 opacity-0 group-hover:opacity-100",
            isLastMessage && "opacity-100"
          )}
        >
          {isLastMessage && (
            <MessageAction tooltip="Re-Generate" delayDuration={100}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                onClick={handleOnRegenerate}
              >
                <AiOutlineSync />
              </Button>
            </MessageAction>
          )}
          <MessageAction
            tooltip={copied ? "Copied!" : "Copy"}
            delayDuration={100}
          >
            {!copied ? (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                onClick={handleCopy}
              >
                <LuCopy />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
              >
                <MdCheck color="green" />
              </Button>
            )}
          </MessageAction>
          <MessageAction tooltip="Upvote" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
              onClick={() => handleFeedback("like")}
            >
              {message.feedback === "liked" ? (
                <RiThumbUpFill />
              ) : (
                <RiThumbUpLine />
              )}
            </Button>
          </MessageAction>
          <MessageAction tooltip="Downvote" delayDuration={100}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer"
              onClick={() => handleFeedback("dislike")}
            >
              {message.feedback === "disliked" ? (
                <RiThumbDownFill />
              ) : (
                <RiThumbDownLine />
              )}
            </Button>
          </MessageAction>
        </MessageActions>
      </div>
    </Message>
  );
}

export default AssistantMessage;
