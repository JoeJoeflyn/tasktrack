"use client";

import React from "react";

import { cn, withRef } from "@udecode/cn";
import { PlateLeaf } from "@udecode/plate-common";

export const CodeLeaf = withRef<typeof PlateLeaf>(
  ({ children, className, ...props }, ref) => {
    return (
      <PlateLeaf
        asChild
        className={cn(
          "whitespace-pre-wrap rounded-md bg-[#a1bdd914] px-[0.3em] py-[0.2em] font-mono text-sm dark:bg-zinc-800",
          className
        )}
        ref={ref}
        {...props}
      >
        <code>{children}</code>
      </PlateLeaf>
    );
  }
);
