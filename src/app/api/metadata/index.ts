const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getMetadata(url: string) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/v1/metadata?url=${url}`
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