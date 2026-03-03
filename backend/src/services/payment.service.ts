import prisma from "../config/prisma"
import { Prisma } from "@prisma/client"
import crypto from "crypto";

type CreatePaymentInput = {
    name: string;
    amount: number;
    departmentId: number;
    levelId: number;
    matricule: string;
}

export interface PaymentResponseDto {
  id: number;
  name: string;
  matricule: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  internalRef: string;
  createdAt: Date;
}

export async function createPayment(input: CreatePaymentInput) {
    const {name, amount, departmentId, levelId, matricule} = input;

    
    const department  = await prisma.department.findUnique({
        where: {id: departmentId}
    });
    if(!department){
        throw new Error("Department not found");
    }
    
    const schoolYear = await prisma.schoolYear.findFirst({
        where: {isActive: true}
    });
    if(!schoolYear){
        throw new Error("No active school year found");
    }
   
    const settings = await prisma.adminSetting.findFirst();
    if(!settings){
        throw new Error("Admin settings not found");
    }
    if(amount < settings.minimumPaymentAmount){
        throw new Error(`Payment amount must be at least ${settings.minimumPaymentAmount}`);
    }
   
    const level = await prisma.level.findUnique({
        where: {id: levelId}
    });
    if(!level){
        throw new Error("Level not found");
    }

    const internalRef = generateInternalRef();

    try{
        const payment = await prisma.payment.create({
            data: {
                name,
                amount,
                matricule,
                departmentId,
                levelId,
                schoolYearId: schoolYear.id,
                status: "PENDING",
                internalRef
            }
        });
        return payment;
    } catch(error: any){
        if(
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ){
            throw new Error("A payment with the same internal reference already exists. Please try again.");
        }
        throw error;
    }

    function generateInternalRef(): string {
        const randoPart = crypto.randomBytes(4).toString("hex").toUpperCase();
        const timestampPart = Date.now().toString(36).toUpperCase();
        return `PAY-${timestampPart}-${randoPart}`;
    }
}