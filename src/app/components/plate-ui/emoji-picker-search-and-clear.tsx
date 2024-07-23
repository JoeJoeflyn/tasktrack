import React from "react";
import { cn } from "@udecode/cn";
import { UseEmojiPickerType } from "@udecode/plate-emoji";

export type EmojiPickerSearchAndClearProps = Pick<
  UseEmojiPickerType,
  "i18n" | "searchValue" | "clearSearch"
>;

export function EmojiPickerSearchAndClear({
  i18n,
  searchValue,
  clearSearch,
}: EmojiPickerSearchAndClearProps) {
  return (
    <>
      <span
        className={cn(
          "absolute left-2 top-1/2 z-10 flex size-5 -translate-y-1/2 text-gray-400"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-search"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
      </span>
      {searchValue && (
        <button
          title={i18n.clear}
          aria-label="Clear"
          type="button"
          className={cn(
            "absolute right-0 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer border-none bg-transparent text-gray-400"
          )}
          onClick={clearSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-x size-full"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  );
}
