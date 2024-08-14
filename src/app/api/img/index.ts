import { Image } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getImages() {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/images`
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

export async function addImage({ cardId, file }: { cardId: string; file: File }) {
    try {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('id', cardId);

        const response = await fetch(`${BASE_URL}/api/v1/images`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("There was an error!", error);
    }
}

export async function updateImage(image: {
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
            `${BASE_URL}/api/v1/images/${image.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(image),
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

export async function getImageId(id: string) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/images/${id}`
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
