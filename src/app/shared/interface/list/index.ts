import { Card } from "../card";

export type List = {
    id: string;
    boardId: string;
    name: string;
    position: number;
    cards: Card[];
};