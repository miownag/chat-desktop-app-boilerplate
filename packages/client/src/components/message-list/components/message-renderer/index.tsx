import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import type { Components } from 'react-markdown';
import { Loader } from '@/components/ui/loader';
import { Markdown } from '@/components/ui/markdown';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ui/reasoning';
import type { ChatHookType } from '@/hooks/use-chat';

const customComponents: Partial<Components> = {
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      className="text-blue-500 underline hover:text-blue-700"
    >
      {children}
    </a>
  ),
};

function MessageRenderer({
  part,
  isThinking,
  status,
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
  isThinking: boolean;
  status: ChatHookType['status'];
}) {
  if (status === 'submitted') {
    return <Loader variant="typing" />;
  }
  switch (part.type) {
    case 'text':
      return (
        <Markdown
          components={customComponents}
          className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs dark:prose-invert"
        >
          {part.text}
        </Markdown>
      );
    case 'reasoning':
      return (
        <Reasoning isStreaming={isThinking}>
          <ReasoningTrigger>Show AI reasoning</ReasoningTrigger>
          <ReasoningContent
            markdown
            className="ml-2 border-l-2 border-l-slate-200 px-2 pb-1 dark:border-l-slate-700"
          >
            {part.text}
          </ReasoningContent>
        </Reasoning>
      );
    default:
      return null;
  }
}

export default MessageRenderer;
