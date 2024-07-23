import { Card } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getCards() {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/cards`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function addCard(card: Card) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/cards`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function updateCard(card: {
  id: string;
  listId?: string;
  name?: string;
  description?: string;
  position?: number;
  dueDate?: Date;
  colorId?: string;
  isChecked?: boolean;
}) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/cards/${card.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function getCardId(id: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/cards/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}
