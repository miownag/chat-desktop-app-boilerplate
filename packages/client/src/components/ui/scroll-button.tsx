import { Button, type buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"
import { FaAngleDown } from "react-icons/fa6";
import { useStickToBottomContext } from "use-stick-to-bottom"

export type ScrollButtonProps = {
  className?: string
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  loading?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

function ScrollButton({
  className,
  variant = "outline",
  size = "sm",
  loading = false,
  ...props
}: ScrollButtonProps) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()

  return (
    <div className="relative inline-flex items-center justify-center">
      {loading && !isAtBottom && (
        <div className="absolute inset-0 -m-0.5 animate-spin rounded-full border-2 border-transparent border-t-blue-500" />
      )}
      <Button
        variant={variant}
        size={size}
        className={cn(
          "h-10 w-10 rounded-full transition-all duration-150 ease-out",
          !isAtBottom
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0",
          className
        )}
        onClick={() => scrollToBottom()}
        {...props}
      >
        <FaAngleDown className="h-5 w-5" />
      </Button>
    </div>
  )
}

export { ScrollButton }
