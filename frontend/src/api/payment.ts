import {fetcher} from "./client";

export interface PaymentResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    matricule: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "FAILED";
    internalRef: string;
    createdAt: string;
  };
}

export const createPayment = async (payload: {
    name: string;
    matricule: string;
    departmentId: string;
    levelId: string;
    amount: number;
}): Promise<PaymentResponse> => {
    return fetcher<PaymentResponse>("/payments",{
        method: "POST",
        body: JSON.stringify(payload)
    });
};