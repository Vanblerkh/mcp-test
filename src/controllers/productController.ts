import { Request, Response } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    CreateProductInput
} from "../repositories/productRepository";

export async function listProducts(_req: Request, res: Response): Promise<void> {
    try {
        const products = await getAllProducts();
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch products"
        });
    }
}

export async function getProduct(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid product ID"
            });
            return;
        }

        const product = await getProductById(id);
        if (!product) {
            res.status(404).json({
                success: false,
                error: "Product not found"
            });
            return;
        }

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch product"
        });
    }
}

export async function addProduct(req: Request, res: Response): Promise<void> {
    try {
        const { name, description, price, stock_quantity } = req.body;

        if (!name || price === undefined) {
            res.status(400).json({
                success: false,
                error: "name and price are required"
            });
            return;
        }

        if (typeof price !== "number" || price < 0) {
            res.status(400).json({
                success: false,
                error: "price must be a non-negative number"
            });
            return;
        }

        const input: CreateProductInput = {
            name,
            description,
            price,
            stock_quantity
        };

        const productId = await createProduct(input);
        res.status(201).json({
            success: true,
            data: { product_id: productId }
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create product"
        });
    }
}

export async function modifyProduct(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid product ID"
            });
            return;
        }

        const updated = await updateProduct(id, req.body);
        if (!updated) {
            res.status(404).json({
                success: false,
                error: "Product not found or no changes made"
            });
            return;
        }

        res.json({
            success: true,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to update product"
        });
    }
}

export async function removeProduct(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid product ID"
            });
            return;
        }

        const deleted = await deleteProduct(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: "Product not found"
            });
            return;
        }

        res.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete product"
        });
    }
}
