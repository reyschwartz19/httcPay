import { Request, Response } from "express";
import { createPayment, PaymentResponseDto, updatePaymentProviderTransactionId } from "../services/payment.service";



export const createPaymentController = async(
    req: Request,
    res: Response) : Promise<void> => {

    try{
        const payment = await createPayment(req.body);
        

      
        res.status(201).json({success: true, data: payment});
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }

}