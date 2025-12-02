import { Request, Response } from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    CreateUserInput
} from "../repositories/userRepository";

export async function listUsers(_req: Request, res: Response): Promise<void> {
    try {
        const users = await getAllUsers();
        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch users"
        });
    }
}

export async function getUser(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
            return;
        }

        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user"
        });
    }
}

export async function addUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, username, password_hash, first_name, last_name } = req.body;

        if (!email || !username || !password_hash) {
            res.status(400).json({
                success: false,
                error: "email, username, and password_hash are required"
            });
            return;
        }

        const input: CreateUserInput = {
            email,
            username,
            password_hash,
            first_name,
            last_name
        };

        const userId = await createUser(input);
        res.status(201).json({
            success: true,
            data: { user_id: userId }
        });
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                success: false,
                error: "Email or username already exists"
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Failed to create user"
        });
    }
}

export async function modifyUser(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
            return;
        }

        const updated = await updateUser(id, req.body);
        if (!updated) {
            res.status(404).json({
                success: false,
                error: "User not found or no changes made"
            });
            return;
        }

        res.json({
            success: true,
            message: "User updated successfully"
        });
    } catch (error: any) {
        console.error("Error updating user:", error);
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                success: false,
                error: "Email or username already exists"
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
}

export async function removeUser(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
            return;
        }

        const deleted = await deleteUser(id);
        if (!deleted) {
            res.status(404).json({
                success: false,
                error: "User not found"
            });
            return;
        }

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user"
        });
    }
}
