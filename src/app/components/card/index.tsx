import { updateCard } from "@/app/api";
import { CardActions } from "@/app/shared/actions";
import { Card as CardType } from "@/app/shared/interface";
import { useClickOutside } from "@/hooks";
import { useMyContext } from "@/hooks/useMyContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { CardLabels } from "./label";

const CardComponent = ({ card, index }: { card: CardType; index: number }) => {
  const queryClient = useQueryClient();
  const { setOpen, setCardDetail } = useMyContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [cardTitle, setCardTitle] = React.useState("");
  const formRef = React.useRef<HTMLFormElement>(null);

  useClickOutside(
    formRef,
    React.useCallback(() => setIsEditing(false), [])
  );

  const { mutate } = useMutation({
    mutationFn: updateCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (cardTitle.trim() === "") return;

      const editedCard: Partial<CardType> = {
        id: card.id,
        userId: "3a5232d4-f4b8-4ad6-b8eb-ceeec9e7a03a",
        name: cardTitle,
      };

      mutate(editedCard as CardType);
      setIsEditing(false);
    },
    [cardTitle, card.id]
  );

  return (
    <div>
      {isEditing && (
        <div
          className="fixed inset-0 backdrop-blur-0 z-10"
          style={{ backgroundColor: "hsla(0, 0%, 0%, 0.6)" }}
        ></div>
      )}
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          autoFocus
          className="relative z-10 mt-2 px-0.5"
        >
          <textarea
            value={cardTitle || card.name}
            onChange={(e) => setCardTitle(e.target.value)}
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={3}
            autoFocus
            placeholder="Enter a title for this card..."
            className="flex-grow outline-none px-2 py-1 rounded-lg w-full resize-none bg-zinc-800 text-gray-400"
          ></textarea>
          <div className="absolute top-0 -right-2.5">
            <div className="fixed">
              <div className="flex flex-col items-start gap-1">
                {CardActions.map(({ action, icon }) => (
                  <div className="flex items-center gap-2 bg-[#2c333a] hover:bg-[#454f59] text-zinc-400 font-medium py-1.5 pr-3 pl-2.5 rounded">
                    <div dangerouslySetInnerHTML={{ __html: icon }} />
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <button
              className="bg-blue-400 hover:bg-[#85b8ff] text-[#1d2125] font-medium py-1.5 px-3 rounded"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="relative bg-zinc-800 text-sm flex flex-col gap-2 py-2 px-3 rounded-lg hover:ring-2 hover:ring-[#85b8ff] cursor-pointer group"
              style={{ ...provided.draggableProps.style }}
              draggable
              onContextMenu={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              onClick={(e) => {
                e.preventDefault();
                setOpen((prev) => !prev);
                setCardDetail(card);
              }}
            >
              <CardLabels card={card} />
              <div className="text-zinc-400">{card.name}</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="absolute top-0.5 right-0.5 py-2 px-2 rounded-2xl text-white bg-zinc-800 opacity-0 group-hover:opacity-100 hover:bg-[#a6c5e229] transition-opacity duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>
          )}
        </Draggable>
      )}
    </div>
  );
};

export const Card = React.memo(CardComponent);
