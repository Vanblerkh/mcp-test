import { Request, Response } from "express";
import { getAllContexts } from "../repositories/contextRepository";

export async function fetchContext(_req: Request, res: Response): Promise<void> {
    try {
        const contexts = await getAllContexts();
        res.json({
            success: true,
            data: contexts
        });
    } catch (error) {
        console.error("Error fetching context:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch context data"
        });
    }
}
