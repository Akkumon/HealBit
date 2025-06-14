
import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group relative flex w-full max-w-[368px] translate-y-0 flex-col gap-1 rounded-md border border-border bg-card p-4 shadow-lg transition-all data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:zoom-out-95 data-[side=top]:translate-y-[-100%] data-[side=bottom]:translate-y-[100%] data-[side=left]:translate-x-[-100%] data-[side=right]:translate-x-[100%]",
        className
      )}
      {...props}
    >
      <div className="grid gap-1 pr-8">
        {props.title && (
          <ToastPrimitives.Title className="text-sm font-semibold leading-none text-foreground">
            {props.title}
          </ToastPrimitives.Title>
        )}
        {props.description && (
          <ToastPrimitives.Description className="text-sm text-muted-foreground">
            {props.description}
          </ToastPrimitives.Description>
        )}
      </div>
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

export { Toast as Toaster }
