import { addList } from "@/app/api";
import { List } from "@/app/shared/interface";
import { useClickOutside } from "@/hooks";
import { useClose } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function CopyList({
  listId,
  setMode,
}: {
  listId: string;
  setMode: React.Dispatch<React.SetStateAction<"copy" | "move" | "actions">>;
}) {
  const queryClient = useQueryClient();
  const close = useClose();
  const [listTitle, setListTitle] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  useClickOutside(inputRef, () => {
    inputRef.current?.blur();
  });

  const { mutate } = useMutation({
    mutationFn: addList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const lists = queryClient.getQueryData<List[]>(["lists"]);
  const currentList = React.useMemo(
    () => lists?.find((list) => list.id === listId),
    [lists, listId]
  );
  if (!currentList) return;

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (listTitle.trim() === "") return;

      // Find the list that is after the current list
      const nextList = lists?.find(
        (list) => list.position > currentList.position
      );

      const newPosition = nextList
        ? (currentList.position + nextList.position) / 2
        : currentList.position + 1024;

      const list: Partial<List> = {
        boardId: "b1251957-c1a8-4eb3-8ae9-a721025098d8",
        name: listTitle,
        position: newPosition,
      };

      mutate(list as List);
      setListTitle("");
      close();
    },
    [listTitle, lists, currentList]
  );

  return (
    <div className="p-3">
      <div className="grid grid-cols-[32px,1fr,32px] items-center">
        <button
          onClick={() => setMode("actions")}
          className="flex items-center justify-center hover:bg-[#a6c5e229] p-1.5 rounded-lg focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <p className="col-span-1 text-center font-semibold">Copy list</p>
        <button
          onClick={close}
          className="flex items-center justify-center hover:bg-[#a6c5e229] p-1.5 rounded-lg focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs" htmlFor="Name">
            Name
          </label>
          <textarea
            ref={inputRef}
            id="Name"
            value={listTitle || currentList?.name}
            onChange={(e) => setListTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            autoFocus
            rows={3}
            className="flex-grow outline-none px-2 py-1 w-full bg-zinc-800 text-sm text-gray-400 rounded-sm ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]"
          ></textarea>
        </div>
        <div className="mt-3 font-bold">
          <button
            className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-3 rounded"
            type="submit"
          >
            Create list
          </button>
        </div>
      </form>
    </div>
  );
}
