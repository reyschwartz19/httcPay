import { Request, Response } from "express";  
import { getDepartments, getLevels, ReferenceDTO, getMinimunPaymentAmount } from "../services/references.service";

export const getDepartmentsController = async (req: Request, res: Response) => {
    try{
        const departments = await getDepartments();
        const response: ReferenceDTO[] = departments.map(dept => ({
            id: dept.id,
            name: dept.name
        }));
        res.status(200).json({
            success: true,
            data: response
        });
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }
}

export const getLevelsController = async (req: Request, res: Response) => {
    try{
        const levels = await getLevels();
         const response: ReferenceDTO[] = levels.map(level => ({
            id: level.id,
            name: level.name
        }));
        res.status(200).json({
            success: true,
            data: response
        });
        res.status(200).json({
            success: true,
            data: response
        });
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }
}

export const getMininmumPaymentAmountController = async (req: Request, res: Response) => {
    try{
        const amount = await getMinimunPaymentAmount();
        res.status(200).json({
            success: true,
            data: amount
        });
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }
}