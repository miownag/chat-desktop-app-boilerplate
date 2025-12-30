import { cn } from '@/lib/utils';
import Typewriter from '../typewriter';

function Welcome(props: { className?: string }) {
  return (
    <div
      className={cn(
        'w-2xl flex flex-col items-center justify-center mb-8  -mt-30',
        props.className,
      )}
    >
      <img src="/bricks.png" alt="Hello" className="w-30 h-30 mb-4" />
      <Typewriter
        textProps={{
          baseText: "Hello, I'm Bricks. ",
          dynamicTexts: ['May I help you?', 'Ask me anything!'],
        }}
        delay={100}
        className="text-lg font-mono gradient-text"
        cursorClassName="bg-neutral-700 w-0.5 h-5"
        loop
        loopDelay={2000}
      />
    </div>
  );
}

export default Welcome;
