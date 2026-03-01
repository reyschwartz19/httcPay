import { Router } from "express";
import { getDepartmentsController, getLevelsController } from "../controllers/references.controller";

const ReferenceRouter = Router();

ReferenceRouter.get("/departments", getDepartmentsController);
ReferenceRouter.get("/levels", getLevelsController);

export default ReferenceRouter;