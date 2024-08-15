import { Board } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getBoards({ sortBy, sortOrder }: { sortBy?: string, sortOrder?: string }) {
    try {

        const queryParams = new URLSearchParams();

        if (sortBy) queryParams.append('sortBy', sortBy);
        if (sortOrder) queryParams.append('sortOrder', sortOrder);

        const queryString = queryParams.toString();

        const url = `${BASE_URL}/api/v1/boards${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("There was an error!", error);
    }
}

export async function addBoard(board: Omit<Board, "id" | "star" | "publicId" | "url">) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/boards`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(board),
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

export async function updateBoard(board: Omit<Board, "email" | "name" | "publicId" | "url">) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/boards/${board.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(board),
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

export async function getBoardId(id: string) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/boards/${id}`
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
