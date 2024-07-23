"use client";

import * as React from "react";

import type { DialogProps } from "@radix-ui/react-dialog";

import { cn, createPrimitiveElement, withCn, withRef } from "@udecode/cn";
import { Command as CommandPrimitive } from "cmdk";

import { Dialog, DialogContent } from "./dialog";

export const Command = withCn(
  CommandPrimitive,
  "flex size-full flex-col overflow-hidden rounded-md bg-zinc-800 text-gray-400 dark:bg-zinc-950 dark:text-zinc-50"
);

export function CommandDialog({ children, ...props }: DialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:size-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:size-5 dark:[&_[cmdk-group-heading]]:text-zinc-400">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export const CommandInput = withRef<typeof CommandPrimitive.Input>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="mr-2 size-4 shrink-0 opacity-50"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <CommandPrimitive.Input
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-400",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
);

export const CommandList = withCn(
  CommandPrimitive.List,
  "max-h-[500px] overflow-y-auto overflow-x-hidden"
);

export const CommandEmpty = withCn(
  CommandPrimitive.Empty,
  "py-6 text-center text-sm"
);

export const CommandGroup = withCn(
  CommandPrimitive.Group,
  "overflow-hidden p-1 text-zinc-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-zinc-500 dark:text-zinc-50 dark:[&_[cmdk-group-heading]]:text-zinc-400"
);

export const CommandSeparator = withCn(
  CommandPrimitive.Separator,
  "-mx-1 h-px bg-zinc-200 dark:bg-zinc-800"
);

export const CommandItem = withCn(
  CommandPrimitive.Item,
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-[#a6c5e229] border-l-2 border-transparent hover:border-l-[#579dff] dark:aria-selected:bg-zinc-800 dark:aria-selected:text-zinc-50"
);

export const CommandShortcut = withCn(
  createPrimitiveElement("span"),
  "ml-auto text-xs tracking-widest text-zinc-500 dark:text-zinc-400"
);
