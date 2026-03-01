import { Request, Response } from "express";  
import { getDepartments, getLevels } from "../services/references.service";

export const getDepartmentsController = async (req: Request, res: Response) => {
    try{
        const departments = await getDepartments();
        res.status(200).json({
            success: true,
            data: departments
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
        res.status(200).json({
            success: true,
            data: levels
        });
    }catch(error: unknown){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        } else {
            res.status(500).json({success: false, message: "An unexpected error occurred"});
        }
    }
}