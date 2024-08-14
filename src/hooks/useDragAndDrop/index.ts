import { updateCard, updateList } from "@/app/api";
import { Card, List } from "@/app/shared/interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DropResult } from "@hello-pangea/dnd";

export const useDragAndDrop = (cardsData: Card[] | undefined, listsData: List[] | undefined) => {
    const queryClient = useQueryClient();

    const { mutate: cardMutation } = useMutation({
        mutationFn: updateCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
    });

    const { mutate: listMutation } = useMutation({
        mutationFn: updateList,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lists"] });
        },
    });

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId, type } = result;


        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        if (type === "LIST") {

            let destinationList = listsData
                ?.sort((a, b) => a.position - b.position);

            if (!destinationList) return;

            let newPosition: number;
            if (destination.index === 0) {
                newPosition = Math.round(destinationList[0]?.position / 2) || 1000;
            } else if (destination.index === destinationList.length) {
                newPosition = Math.round(destinationList[destinationList.length - 1]?.position + 1024) || 1000;
            } else {
                if (destination.index > source.index) {
                    // Moving down
                    const nextPosition = destinationList[destination.index]?.position;
                    const afterNextPosition = destinationList[destination.index + 1]?.position;
                    if (afterNextPosition) {
                        newPosition = Math.round((afterNextPosition + nextPosition) / 2);
                    } else {
                        const assumedPosition = nextPosition + 1024;
                        newPosition = Math.round((nextPosition + assumedPosition) / 2);
                    }
                } else {
                    // Moving up
                    const prevPosition = destinationList[destination.index - 1]?.position;
                    const currentPosition = destinationList[destination.index]?.position;
                    if (prevPosition) {
                        newPosition = Math.round((prevPosition + currentPosition) / 2);
                    } else {
                        const assumedPosition = currentPosition - 1024;
                        newPosition = Math.round((currentPosition + assumedPosition) / 2);
                    }
                }
            }

            const checkForOverlap = () => {
                const positions = destinationList.map((list) => list.position);
                positions.push(newPosition);
                const uniquePositions = new Set(positions);
                return positions.length !== uniquePositions.size;
            };

            if (checkForOverlap()) {
                // Reassign positions by multiplying by 1024
                destinationList.sort((a, b) => b.position - a.position);
                for (let i = 0; i < destinationList.length; i++) {
                    destinationList[i].position = (destinationList.length - i) * 1024;
                }
                newPosition = (destination.index + 1) * 1024;
            }

            listMutation({
                id: draggableId,
                position: newPosition,
            } as List);
        }

        if (type === "CARD") {
            const destinationListId = destination.droppableId;

            const destinationListCards = cardsData
                ?.filter((card) => card.listId === destinationListId)
                ?.sort((a, b) => a.position - b.position);

            if (!destinationListCards) return;

            let newPosition: number = 0;
            if (destination.index === 0) {
                newPosition = Math.round(destinationListCards[0]?.position / 2) || 1000;
            } else if (destination.index === destinationListCards.length) {
                newPosition = Math.round(destinationListCards[destinationListCards.length - 1]?.position + 1024) || 1000;
            } else {
                if (destination.index > source.index) {
                    // Moving down
                    const beforeLastCard = destinationListCards[destinationListCards.length - 2];
                    const lastCard = destinationListCards[destinationListCards.length - 1];

                    if (beforeLastCard) {
                        // Calculate newPosition based on beforeLastCard and lastCard
                        const beforeLastPosition = beforeLastCard.position;
                        const lastPosition = lastCard.position;

                        if (lastPosition) {
                            newPosition = Math.round((beforeLastPosition + lastPosition) / 2);
                        } else {
                            const assumedPosition = beforeLastPosition + 1024;
                            newPosition = Math.round((beforeLastPosition + assumedPosition) / 2);
                        }
                    }
                } else {
                    // Moving up
                    const prevPosition = destinationListCards[destination.index - 1]?.position;
                    const currentPosition = destinationListCards[destination.index]?.position;

                    // Calculate newPosition based on prevPosition and currentPosition
                    if (prevPosition) {
                        newPosition = Math.round((prevPosition + currentPosition) / 2);
                    } else {
                        const assumedPosition = currentPosition - 1024;
                        newPosition = Math.round((currentPosition + assumedPosition) / 2);
                    }
                }
            }

            const checkForOverlap = () => {
                const positions = destinationListCards.map((card) => card.position);
                positions.push(newPosition);
                const uniquePositions = new Set(positions);
                return positions.length !== uniquePositions.size;
            };

            if (checkForOverlap()) {
                // Reassign positions by multiplying by 1024
                destinationListCards.sort((a, b) => b.position - a.position);
                for (let i = 0; i < destinationListCards.length; i++) {
                    destinationListCards[i].position =
                        (destinationListCards.length - i) * 1024;
                }
                // Also set the new position appropriately
                newPosition = (destination.index + 1) * 1024;
            }

            cardMutation({
                id: draggableId,
                listId: destinationListId,
                position: newPosition,
            } as Card);
        }
    };

    return { onDragEnd };

};
