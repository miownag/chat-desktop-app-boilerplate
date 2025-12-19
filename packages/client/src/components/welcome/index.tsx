import { TextShimmer } from "@/components/ui/text-shimmer";
import { cn } from "@/lib/utils";

function Welcome(props: { className?: string }) {
  return (
    <div
      className={cn(
        "w-2xl flex flex-col items-center justify-center mb-8  -mt-30",
        props.className
      )}
    >
      <img
        src="../../../public/bricks.png"
        alt="Hello"
        className="w-30 h-30 mb-4"
      />
      <TextShimmer className="text-lg" duration={2.5} spread={5}>
        Hello, I'm Bricks. May I help you?
      </TextShimmer>
    </div>
  );
}

export default Welcome;
