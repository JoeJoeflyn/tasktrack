import { User } from "@/app/shared/interface";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function addUser(user: Omit<User, 'id' | 'password'>) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/users`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
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