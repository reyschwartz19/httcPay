const API_BASE_URL = "http://localhost:3001/api";

export const fetcher = async <T> (
    endpoint: string,
    options?: RequestInit
): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An error occurred while fetching data.");
    }
    const data = await res.json();
    return data as T;
}


