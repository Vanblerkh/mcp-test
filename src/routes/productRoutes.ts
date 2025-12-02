import { Router } from "express";
import {
    listProducts,
    getProduct,
    addProduct,
    modifyProduct,
    removeProduct
} from "../controllers/productController";

const router = Router();

router.get("/products", listProducts);
router.get("/products/:id", getProduct);
router.post("/products", addProduct);
router.put("/products/:id", modifyProduct);
router.delete("/products/:id", removeProduct);

export default router;
