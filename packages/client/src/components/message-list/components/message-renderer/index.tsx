import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import type { Components } from 'react-markdown';
import { Markdown } from '@/components/ui/markdown';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ui/reasoning';
import { Tool } from '@/components/ui/tool';

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
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
  isThinking: boolean;
}) {
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
    case 'dynamic-tool':
      return (
        <Tool
          className="w-full max-w-md"
          toolPart={{
            type: part.toolName,
            state: ['approval-requested', 'approval-responded'].includes(
              part.state,
            )
              ? 'input-available'
              : (part.state as
                  | 'input-streaming'
                  | 'input-available'
                  | 'output-available'
                  | 'output-error'),
            input:
              typeof part.input === 'object' && part.input !== null
                ? (part.input as Record<string, unknown>)
                : {
                    parameters: part.input,
                  },
            output:
              typeof part.output === 'object' && part.output !== null
                ? (part.output as Record<string, unknown>)
                : {
                    parameters: part.output,
                  },
            errorText: part.errorText,
          }}
        />
      );
    default:
      return null;
  }
}

export default MessageRenderer;
