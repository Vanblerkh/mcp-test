import express, { Request, Response } from "express";
import cors from "cors";
import contextRoutes from "./routes/contextRoutes";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
});

// Routes
app.use(contextRoutes);
app.use(userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});