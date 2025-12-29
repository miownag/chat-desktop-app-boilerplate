import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import { Markdown } from '@/components/ui/markdown';

function MessageRenderer({
  part,
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
}) {
  switch (part.type) {
    case 'text':
      return (
        <Markdown className="prose prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs dark:prose-invert">
          {part.text}
        </Markdown>
      );
    case 'reasoning':
      return <span className="text-green-400">{part.text}</span>;
    default:
      return null;
  }
}

export default MessageRenderer;
