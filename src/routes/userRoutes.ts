import { Router } from "express";
import {
    listUsers,
    getUser,
    addUser,
    modifyUser,
    removeUser
} from "../controllers/userController";

const router = Router();

router.get("/users", listUsers);
router.get("/users/:id", getUser);
router.post("/users", addUser);
router.put("/users/:id", modifyUser);
router.delete("/users/:id", removeUser);

export default router;
