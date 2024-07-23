import { withCn } from "@udecode/cn";

import { Toolbar } from "./toolbar";

export const FixedToolbar = withCn(
  Toolbar,
  "supports-backdrop-blur:bg-white/60 sticky left-0 top-[57px] w-full justify-between overflow-x-auto border-b border-b-[#2c333a] backdrop-blur dark:supports-backdrop-blur:bg-zinc-950/60 dark:bg-zinc-950/95"
);
