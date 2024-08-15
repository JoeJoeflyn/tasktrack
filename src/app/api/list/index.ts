import { List } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function getLists() {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/lists`
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

export async function addList(list: List) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/lists`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function updateList(list: List) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/lists/${list.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(list),
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

export async function getListId(id: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/lists/${id}`
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