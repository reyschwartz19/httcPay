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
  clientSecret: string;
}

export async function createPayment(input: CreatePaymentInput) {
    const {name, amount, departmentId, levelId, matricule} = input;

    const normalizedMatricule = matricule.trim().toUpperCase();

    
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

   

  return await prisma.$transaction(async (tx) => 
    {  
         const existingCompletedPayment = await tx.payment.findFirst({
        where: {
            matricule: normalizedMatricule,
            schoolYearId: schoolYear.id,
            status: "COMPLETED",
        },
    });
    if (existingCompletedPayment) {
        throw new Error("Payment already completed for this student this year");
    }

        
        const pendingPayment = await tx.payment.findFirst({
    where: {
        matricule: normalizedMatricule,
        schoolYearId: schoolYear.id,
        status: "PENDING",
        createdAt: {
            gt: new Date(Date.now() - 10 * 60 * 1000), 
        },
    },
});

if (pendingPayment) {
    return pendingPayment; 
}

    const settings = await tx.adminSetting.findFirst();
    if(!settings){
        throw new Error("Admin settings not found");
    }
    if(amount < settings.minimumPaymentAmount){
        throw new Error(`Payment amount must be at least ${settings.minimumPaymentAmount}`);
    }
   
    const level = await tx.level.findUnique({
        where: {id: levelId}
    });
    if(!level){
        throw new Error("Level not found");
    }

    let retries = 3;

    while(retries > 0){
    const internalRef = generateInternalRef();

    try{
        const payment = await prisma.payment.create({
            data: {
                name,
                amount,
                matricule: normalizedMatricule,
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
           retries--;
           continue;
        }
        throw error;
    }
    }

   throw new Error("Failed to generate unique payment reference")
});
    function generateInternalRef(): string {
        const randoPart = crypto.randomBytes(4).toString("hex").toUpperCase();
        const timestampPart = Date.now().toString(36).toUpperCase();
        return `PAY-${timestampPart}-${randoPart}`;
    }
}

export const updatePaymentProviderTransactionId =  async (paymentId: number, transactionId: string) => {
    return prisma.payment.update({
        where: {id: paymentId},
        data: {
            providerTransactionId: transactionId
        }
    })
}

export const updatePaymentStatusByInternalRef = async (
    internalRef: string,
    status: "COMPLETED" | "FAILED"
) => {
    const payment = await prisma.payment.findUnique({
        where: {internalRef}
    });
    if(!payment){
        throw new Error(`Payment with internalRef ${internalRef} not found`);
    }
    return prisma.payment.update({
        where: {internalRef},
        data: {status}
    })
}