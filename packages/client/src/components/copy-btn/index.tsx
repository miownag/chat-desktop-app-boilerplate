import { Button } from "@/components/ui/button";
import { LuCopy } from "react-icons/lu";
import { MdCheck } from "react-icons/md";

function CopyBtn({
  content,
  copied,
  setCopied,
}: {
  content: string;
  copied: any;
  setCopied: any;
}) {
  return !copied ? (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full cursor-pointer"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(content);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        } catch (err) {
          console.error("Failed to copy text: ", err);
        }
      }}
    >
      <LuCopy />
    </Button>
  ) : (
    <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
      <MdCheck color="green" />
    </Button>
  );
}

export default CopyBtn;
