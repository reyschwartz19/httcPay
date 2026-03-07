import { Router } from "express";
import { getAllPaymentsController, getFilteredPaymentsController } from "../controllers/adminFilters.controller";

const filterRouter = Router();

filterRouter.get("/payments", getAllPaymentsController);
filterRouter.get("/payments/filter", getFilteredPaymentsController);

export default filterRouter;