"use client";
import { getCards, getLists } from "@/app/api";
import { Card as CardType, List as ListType } from "@/app/shared/interface";
import { MyContext } from "@/context";
import { StrictModeDroppable as Droppable } from "@/helpers/StrictModeDroppable";
import { useDragAndDrop } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { DragDropContext, Draggable } from "@hello-pangea/dnd";
import { AddCardForm } from "../addCardForm";
import { AddListForm } from "../addListForm";
import { Card } from "../card";
import { InlineInput } from "../inlineInput";
import Modal from "../modal";
import { ListPopover } from "../listPopover";

export default function List() {
  const [isAdding, setIsAdding] = React.useState("");
  const [isFormVisible, setIsFormVisible] = React.useState("");
  const [cardDetail, setCardDetail] = React.useState<CardType>(
    () => ({} as CardType)
  );
  const [open, setOpen] = React.useState(false);

  const value = { cardDetail, setCardDetail, open, setOpen };

  const { data: listsData } = useQuery<ListType[]>({
    queryKey: ["lists"],
    queryFn: getLists,
  });

  const { data: cardsData } = useQuery<CardType[]>({
    queryKey: ["cards"],
    queryFn: getCards,
  });

  const { onDragEnd: dragAndDrop } = useDragAndDrop(cardsData, listsData);

  const onDragEnd = useCallback(dragAndDrop, [cardsData, listsData]);

  return (
    <MyContext.Provider value={value}>
      <Modal />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" type="LIST" direction="horizontal">
          {(provided) => (
            <div className="flex">
              {listsData
                ?.sort((a, b) => a.position - b.position)
                .map((list, index) => {
                  const listCards = cardsData?.filter(
                    (card) => card.listId === list.id
                  );
                  return (
                    <Draggable
                      key={list.id}
                      draggableId={list.id}
                      index={index}
                    >
                      {(provided) => (
                        <div className="m-2" key={list.id}>
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            draggable
                            className="bg-neutral-900 cursor-pointer w-72 p-2 rounded-lg"
                          >
                            <div className="flex items-center justify-between font-bold text-lg text-zinc-400">
                              <InlineInput list={list} />
                              <ListPopover
                                listId={list.id}
                                setIsAdding={setIsAdding}
                                setIsFormVisible={setIsFormVisible}
                              ></ListPopover>
                            </div>
                            {/* If click from isFormVisible */}
                            {isFormVisible === list.id && (
                              <AddCardForm
                                listId={list.id}
                                isAdding={isAdding}
                                setIsAdding={setIsAdding}
                                setIsFormVisible={setIsFormVisible}
                              />
                            )}
                            {/* Droppable area for cards */}
                            <Droppable droppableId={list.id} type="CARD">
                              {(provided) => (
                                <div
                                  className="flex flex-col gap-2 p-0.5 mt-2 relative overflow-y-auto overflow-x-hidden"
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {listCards
                                    ?.sort((a, b) => a.position - b.position)
                                    .map((card, index) => (
                                      <Card
                                        key={card.id}
                                        card={card}
                                        index={index}
                                      />
                                    ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            {/* Add card button or form */}
                            {isFormVisible !== list.id && (
                              <AddCardForm
                                listId={list.id}
                                isAdding={isAdding}
                                setIsAdding={setIsAdding}
                                setIsFormVisible={setIsFormVisible}
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
              <AddListForm />
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </MyContext.Provider>
  );
}
