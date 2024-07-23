import React, { ReactNode } from "react";
import { UseEmojiPickerType } from "@udecode/plate-emoji";

export type EmojiPickerSearchBarProps = {
  children: ReactNode;
} & Pick<UseEmojiPickerType, "i18n" | "searchValue" | "setSearch">;

export function EmojiPickerSearchBar({
  i18n,
  searchValue,
  setSearch,
  children,
}: EmojiPickerSearchBarProps) {
  return (
    <div className="flex items-center p-3 border-b-2 border-[#a6c5e229]">
      <div className="relative flex grow">
        <input
          type="text"
          placeholder={i18n.search}
          autoComplete="off"
          aria-label="Search"
          className="block w-full appearance-none rounded border-0 bg-[#22272b] text-gray-400 px-8 py-2 outline-none ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]"
          onChange={(event) => setSearch(event.target.value)}
          value={searchValue}
        />
        {children}
      </div>
    </div>
  );
}
