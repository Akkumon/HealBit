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

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Action
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[[data-swipe=cancel]]:translate-x-0 group-[[data-swipe=end]]:translate-x-[calc(var(--radix-toast-swipe-end-x)*1%)] group-[[data-state=open]]:animate-in group-[[data-state=open]]:slide-in-from-bottom-10 group-[[data-state=open]]:slide-in-from-left-10 group-[[data-state=open]]:slide-in-from-right-10",
        className
      )}
      {...props}
    />
  )
})
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => {
  return (
    <ToastPrimitives.Close
      ref={ref}
      className={cn(
        "absolute right-2 top-2 rounded-md text-gray-400 opacity-0 transition-opacity hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-hover:opacity-100",
        className
      )}
      aria-label="Close"
      {...props}
    />
  )
})
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = ToastPrimitives.Title
const ToastDescription = ToastPrimitives.Description
const ToastViewport = ToastPrimitives.Viewport

export {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastViewport,
}
