import { Color } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getColors() {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/colors`
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

export async function addColor(color: Color) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/colors`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(color),
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

export async function updateColor(color: Color) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/colors/${color.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(color),
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

export async function getColorId(id?: string) {
    if (!id) {
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/colors/${id}`
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

export async function deleteColor(id: string) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/colors/${id}`,
            { method: 'DELETE' }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

    } catch (error) {
        console.error("There was an error!", error);
    }
}

