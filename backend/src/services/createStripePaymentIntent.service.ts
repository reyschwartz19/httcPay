import Stripe from "stripe";
import dotenv from "dotenv";



dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});


export const createStripePaymentIntent = async ({
    amount,
    internalRef
}: {
    amount: number;
    internalRef: string;
}): Promise<Stripe.PaymentIntent> => {
   

   
    try{
        const paymentIntent = await stripe.paymentIntents.create(
            {
           amount,
           currency: "xaf",
           
           metadata: {
            internalRef
           },
        },
        {
            idempotencyKey: internalRef,
        }
    );
        return paymentIntent;

    } catch(error: unknown){
        if(error instanceof stripe.errors.StripeError){
            throw new Error(`Stripe error: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while creating payment intent");
    }
}


