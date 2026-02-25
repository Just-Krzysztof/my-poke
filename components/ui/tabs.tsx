import * as React from "react"
import { Tabs } from "radix-ui"

import { cn } from "@/lib/utils"

function TabsRoot({ ...props }: React.ComponentProps<typeof Tabs.Root>) {
  return <Tabs.Root data-slot="tabs" {...props} />
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.List>) {
  return (
    <Tabs.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-full items-center justify-start rounded-lg p-1 gap-1",
        className,
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Trigger>) {
  return (
    <Tabs.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "data-[state=active]:bg-background data-[state=active]:text-foreground focus-visible:ring-ring inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof Tabs.Content>) {
  return (
    <Tabs.Content
      data-slot="tabs-content"
      className={cn("focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none", className)}
      {...props}
    />
  )
}

export { TabsRoot, TabsList, TabsTrigger, TabsContent }
