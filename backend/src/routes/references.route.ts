import { Router } from "express";
import { getDepartmentsController, getLevelsController, getMininmumPaymentAmountController } from "../controllers/references.controller";

const ReferenceRouter = Router();

ReferenceRouter.get("/departments", getDepartmentsController);
ReferenceRouter.get("/levels", getLevelsController);
ReferenceRouter.get("/minimum-payment-amount", getMininmumPaymentAmountController);
export default ReferenceRouter;