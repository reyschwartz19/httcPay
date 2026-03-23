import prisma from "../config/prisma"
import { Prisma } from "@prisma/client"
import crypto from "crypto";
import { createStripePaymentIntent } from "./createStripePaymentIntent.service";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

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
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
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
    const internalRef = generateInternalRef();

 
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
    if(pendingPayment.providerTransactionId){
        try {
            await stripe.paymentIntents.cancel(
                pendingPayment.providerTransactionId
            );
        } catch(e){
            console.error("Stripe cancel failed", e)
        }
    }
    await tx.payment.update({
        where: {id: pendingPayment.id},
        data: {status: "CANCELLED"},
    });
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

      const paymentIntent = await createStripePaymentIntent({
    amount,
    internalRef
   });


    let retries = 3;

    while(retries > 0){
    

    try{
        const payment = await tx.payment.create({
            data: {
                name,
                amount,
                matricule: normalizedMatricule,
                departmentId,
                levelId,
                schoolYearId: schoolYear.id,
                status: "PENDING",
                internalRef,
                providerTransactionId: paymentIntent.id,
            }
        });
        return {
            ...payment,
            clientSecret: paymentIntent.client_secret
        };
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
    return prisma.$transaction(async (tx) => {

        const payment = await tx.payment.findUnique({
            where: { internalRef }
        });

        if (!payment) {
            throw new Error(`Payment with internalRef ${internalRef} not found`);
        }

       
        if (payment.status === "CANCELLED") {
            return payment;
        }

      
        if (payment.status === "COMPLETED") {
            return payment;
        }

        
        if (payment.status === "FAILED" && status === "COMPLETED") {
            return tx.payment.update({
                where: { internalRef },
                data: { status: "COMPLETED" }
            });
        }

        
        if (payment.status === status) {
            return payment;
        }

        
        if (payment.status === "PENDING") {
            return tx.payment.update({
                where: { internalRef },
                data: { status }
            });
        }

        throw new Error("Invalid payment state transition");
    });
};