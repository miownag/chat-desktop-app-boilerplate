import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Button } from "@/components/ui/button";
import { LuBrain, LuGlobe, LuMic, LuPlus, LuSend } from "react-icons/lu";
import { RiMoreFill } from "react-icons/ri";
import { useState } from "react";
import SelectedBtn from "../selected-btn";

// Initial chat messages
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

interface SenderProps {
  enableDeepThink: boolean;
  setEnableDeepThink: React.Dispatch<React.SetStateAction<boolean>>;
  enableSearch: boolean;
  setEnableSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

function Sender(props: SenderProps) {
  const { enableDeepThink, setEnableDeepThink, enableSearch, setEnableSearch } =
    props;
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState(initialMessages);

  const handleSubmit = () => {
    if (!prompt.trim()) return;

    setPrompt("");
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: prompt.trim(),
    };

    setChatMessages([...chatMessages, newUserMessage]);

    // Simulate API response
    setTimeout(() => {
      const assistantResponse = {
        id: chatMessages.length + 2,
        role: "assistant",
        content: `This is a response to: "${prompt.trim()}"`,
      };

      setChatMessages((prev) => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5 w-full">
      <div className="mx-auto w-2xl">
        <PromptInput
          isLoading={isLoading}
          value={prompt}
          onValueChange={setPrompt}
          onSubmit={handleSubmit}
          className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
        >
          <div className="flex flex-col">
            <PromptInputTextarea
              placeholder="Ask anything"
              className="pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
            />

            <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Add a new action">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full cursor-pointer"
                  >
                    <LuPlus size={18} />
                  </Button>
                </PromptInputAction>

                <PromptInputAction tooltip="DeepThink">
                  <SelectedBtn
                    label="Deep Think"
                    icon={<LuBrain size={18} />}
                    selected={enableDeepThink}
                    setSelected={setEnableDeepThink}
                  />
                </PromptInputAction>

                <PromptInputAction tooltip="Search">
                  <SelectedBtn
                    label="Search"
                    icon={<LuGlobe size={18} />}
                    selected={enableSearch}
                    setSelected={setEnableSearch}
                  />
                </PromptInputAction>

                <PromptInputAction tooltip="More actions">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full cursor-pointer"
                  >
                    <RiMoreFill size={18} />
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center gap-2">
                <PromptInputAction tooltip="Voice input">
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full cursor-pointer"
                  >
                    <LuMic size={18} />
                  </Button>
                </PromptInputAction>

                <Button
                  size="icon"
                  disabled={!prompt.trim() || isLoading}
                  onClick={handleSubmit}
                  className={`size-9 rounded-full cursor-pointer`}
                >
                  {!isLoading ? (
                    <LuSend size={18} />
                  ) : (
                    <span className="size-3 rounded-xs bg-white" />
                  )}
                </Button>
              </div>
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}

export default Sender;
