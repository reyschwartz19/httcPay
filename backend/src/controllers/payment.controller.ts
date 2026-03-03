import { Request, Response, NextFunction } from "express";
import { createPayment, PaymentResponseDto } from "../services/payment.service";

export const createPaymentController = async(
    req: Request,
    res: Response) : Promise<void> => {

    try{
        const payment = await createPayment(req.body);
        const response: PaymentResponseDto = {
            id: payment.id,
            name: payment.name,
            matricule: payment.matricule,
            amount: payment.amount,
            status: payment.status,
            internalRef: payment.internalRef,
            createdAt: payment.createdAt
        }
        res.status(201).json({success: true, data: response});
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }

}