import { Router } from "express";
import { fetchContext } from "../controllers/contextController";

const router = Router();

router.get("/fetch-context", fetchContext);

export default router;
