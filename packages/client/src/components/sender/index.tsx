import { pick } from 'es-toolkit';
import { useState } from 'react';
import { LuArrowUp, LuBrain, LuGlobe, LuMic, LuPlus } from 'react-icons/lu';
import { RiMoreFill } from 'react-icons/ri';
import SelectedBtn from '@/components/selected-btn';
import { Button } from '@/components/ui/button';
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from '@/components/ui/prompt-input';
import useCreateConversation from '@/hooks/apis/use-create-conversation';
import { useRefreshConversationList } from '@/hooks/apis/use-get-conversation-list';
import type { OnRequestParams } from '@/hooks/use-chat';
import { useShallowChatBotStore } from '@/stores';
import { Separator } from '../ui/separator';

interface SenderProps {
  enableDeepThink: boolean;
  setEnableDeepThink: React.Dispatch<React.SetStateAction<boolean>>;
  enableSearch: boolean;
  setEnableSearch: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
  onRequest: (params: OnRequestParams) => void;
  isRequesting: boolean;
  abort: () => void;
}

function Sender(props: SenderProps) {
  const {
    enableDeepThink,
    setEnableDeepThink,
    enableSearch,
    setEnableSearch,
    isActive,
    onRequest,
    isRequesting,
    abort,
  } = props;
  const [prompt, setPrompt] = useState('');
  const { currentConversationId, setCurrentConversationId, setPendingMessage } =
    useShallowChatBotStore((state) =>
      pick(state, [
        'currentConversationId',
        'setCurrentConversationId',
        'setPendingMessage',
      ]),
    );
  const { mutateAsync: createConversationAndSend } = useCreateConversation();
  const refreshConversationList = useRefreshConversationList();

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    const trimmedPrompt = prompt.trim();
    setPrompt('');

    if (currentConversationId === 'new') {
      // 保存用户输入的内容到状态管理
      setPendingMessage(trimmedPrompt);
      const { data } = await createConversationAndSend();
      if (data.id) {
        await refreshConversationList();
        setCurrentConversationId(data.id);
      }
      return;
    }

    // Add user message immediately
    const newUserMessage = {
      id: `msg-${crypto.randomUUID()}`,
      role: 'user',
      content: trimmedPrompt,
      status: 'completed' as const,
    };

    onRequest({
      message: newUserMessage,
      enableDeepThink,
      enableSearch,
    });
  };

  return (
    isActive && (
      <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5 w-full">
        <div className="mx-auto w-2xl">
          <PromptInput
            isLoading={isRequesting}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSubmit}
            className="border-input bg-popover relative z-10 w-full rounded-3xl border p-0 pt-1 shadow-xs"
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder="Ask anything"
                className="pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
                autoFocus
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
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-9 rounded-full cursor-pointer"
                  >
                    <LuMic size={18} />
                  </Button>
                  <Separator orientation="vertical" className="h-5!" />
                  <Button
                    size="icon"
                    disabled={!prompt.trim() && !isRequesting}
                    onClick={isRequesting ? abort : handleSubmit}
                    className={`size-9 rounded-full cursor-pointer`}
                  >
                    {!isRequesting ? (
                      <LuArrowUp size={18} />
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
    )
  );
}

export default Sender;
