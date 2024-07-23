import { addCard } from "@/app/api/card";
import { useClickOutside } from "@/hooks";
import { Card } from "@/app/shared/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

export const AddCardForm: React.FC<{
  listId: string;
  isAdding: string;
  setIsAdding: React.Dispatch<React.SetStateAction<string>>;
  setIsFormVisible: React.Dispatch<React.SetStateAction<string>>;
}> = ({ listId, isAdding, setIsAdding, setIsFormVisible }) => {
  const queryClient = useQueryClient();
  const [cardTitle, setCardTitle] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  const { mutate } = useMutation({
    mutationFn: addCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  useClickOutside(formRef, () => {
    setIsAdding("");
    setIsFormVisible("");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardTitle.trim() === "") return;

    const currentCards = queryClient.getQueryData<Card[]>(["cards"]);

    // Filter the cards for the current list and find the card with the highest position
    const highestPosition =
      currentCards
        ?.filter((card) => card.listId === listId)
        .reduce((max, card) => Math.max(max, card.position), 0) || 0;

    const card: Partial<Card> = {
      listId: listId,
      userId: "3a5232d4-f4b8-4ad6-b8eb-ceeec9e7a03a",
      name: cardTitle,
      position: highestPosition + 1024, // Add 1024 to the highest position
    };

    mutate(card as Card);
    setCardTitle("");
    setIsAdding("");
    setIsFormVisible("");
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-2 px-0.5">
      {isAdding === listId ? (
        <>
          <textarea
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={2}
            autoFocus
            placeholder="Enter a title for this card..."
            className="flex-grow outline-none px-2 py-1 rounded-lg w-full resize-none bg-zinc-800 text-gray-400"
          ></textarea>
          <div className="flex items-center gap-1 mt-2">
            <button
              className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-3 rounded"
              type="submit"
            >
              Add card
            </button>
            <button
              className="hover:bg-[#a6c5e229] text-gray-400 p-1.5 rounded"
              onClick={() => {
                setIsAdding("");
                setIsFormVisible("");
              }}
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <div
          onClick={() => {
            setIsAdding(listId);
          }}
          className="text-zinc-400 flex gap-1 hover:bg-[#a6c5e229] py-1.5 px-2 cursor-pointer rounded-lg"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span>Add a card</span>
        </div>
      )}
    </form>
  );
};
