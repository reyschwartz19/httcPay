import { Router } from "express";
import { createPaymentController } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/", createPaymentController);

export default paymentRouter;