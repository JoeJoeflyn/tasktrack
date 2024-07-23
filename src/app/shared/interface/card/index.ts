import { Color } from "../color";

export type Card = {
  id: string;
  listId: string;
  userId: string;
  name: string;
  description?: string;
  position: number;
  cardColors: {
    cardId: string;
    colorId: string;
    isChecked: boolean;
    color: Color;
  }[];
  dueDate?: Date;
};
