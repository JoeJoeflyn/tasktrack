import { updateList } from "@/app/api";
import { useClickOutside, useMoveListFormState } from "@/hooks";
import { List } from "@/app/shared/interface";
import { useClose } from "@headlessui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function MoveList({
  listId,
  setMode,
}: {
  listId: string;
  setMode: React.Dispatch<React.SetStateAction<"copy" | "move" | "actions">>;
}) {
  const queryClient = useQueryClient();
  const close = useClose();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef(null);
  const {
    isOpen,
    setIsOpen,
    searchTerm,
    selectedOption,
    setSelectedOption,
    filteredPositions,
    handleSearchTermChange,
    currentList,
  } = useMoveListFormState(listId);

  useClickOutside(
    dropdownRef,
    React.useCallback(() => {
      setIsOpen(false);
      inputRef.current?.blur();
    }, [])
  );

  const { mutate } = useMutation({
    mutationFn: updateList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedOption === undefined) return;

      // Fetch the current lists
      const currentLists = queryClient.getQueryData<List[]>(["lists"]);
      // Find the current list
      const currentList = currentLists?.find((list) => list.id === listId);
      if (!currentList) return;

      const selectedList = currentLists?.[selectedOption - 1].position;

      const sortedLists = [...(currentLists || [])].sort(
        (a, b) => a.position - b.position
      );

      let newPosition: number;
      const currentIndex = sortedLists.findIndex(
        (list) => list.position === selectedList
      );

      if (currentIndex === 0) {
        newPosition = Math.round(sortedLists[0]?.position / 2) || 1000;
      } else if (currentIndex === sortedLists.length - 1) {
        newPosition = Math.round(
          sortedLists[sortedLists.length - 1]?.position + 1024
        );
      } else {
        const previousListPosition = sortedLists[selectedOption - 1]?.position;
        const nextListPosition = sortedLists[selectedOption]?.position;

        newPosition = Math.round((previousListPosition + nextListPosition) / 2);
      }

      const list: Partial<List> = {
        id: listId,
        position: newPosition,
      };

      mutate(list as List);
      close();
    },
    [selectedOption]
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
        <p className="col-span-1 text-center font-semibold">Move list</p>
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
        <div className="flex flex-col gap-2">
          <div className="relative" ref={dropdownRef}>
            <div className="flex bg-zinc-800 rounded-sm ring-1 ring-[#738496] focus-within:ring-2 focus-within:ring-[#85b8ff]">
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                placeholder={selectedOption?.toString()}
                onChange={handleSearchTermChange}
                onClick={() => setIsOpen(true)}
                className="flex-grow outline-none px-2 py-1 text-sm bg-inherit"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(!isOpen);
                  inputRef?.current?.focus();
                }}
                className="outline-none px-2 py-1 text-sm border-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
            {isOpen && (
              <div className="absolute w-full mt-2.5 py-2 rounded bg-zinc-800 ring-1 ring-gray-700 focus-within:ring-[#85b8ff] shadow-lg z-10">
                {filteredPositions.map((position, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedOption(position);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col px-2 py-1 text-sm border-l-2 border-transparent ${
                      position === currentList?.position
                        ? "text-[#579dff] bg-[#1c2b41] active:bg-[#0055cc] hover:bg-[#09326c] border-l-[#579dff] cursor-pointer"
                        : "hover:border-l-[#579dff] hover:bg-[#a6c5e229]"
                    }`}
                  >
                    <span>{position}</span>
                    {position === currentList?.position && (
                      <span>(current)</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 font-bold">
          <button
            className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-6 rounded"
            type="submit"
          >
            Move
          </button>
        </div>
      </form>
    </div>
  );
}
