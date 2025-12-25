import type { UIDataTypes, UIMessagePart, UITools } from 'ai';

function MessageRenderer({
  part,
}: {
  part: UIMessagePart<UIDataTypes, UITools>;
}) {
  switch (part.type) {
    case 'text':
      return <span>{part.text}</span>;
    case 'reasoning':
      return <span>{part.text}</span>;
    default:
      return null;
  }
}

export default MessageRenderer;
