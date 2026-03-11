import { fetcher} from "./client";

export interface Reference {
    success: boolean, 
    data: { 
    id: number;
    name: string;
}[]
}

export const fetchDepartments = async (): Promise<{id: number, name: string}[]> => {
    const response= await fetcher<Reference>("/references/departments");
    return response.data;
}

export const fetchLevels = async () => {
    const response = await fetcher<Reference>("/references/levels");

    return response.data;
}

export const fetchMinimumAmount = async (): Promise <number> => {
    const response = await fetcher<{success: boolean, data: number}>("/references/minimum-payment-amount");
    return response.data;
}