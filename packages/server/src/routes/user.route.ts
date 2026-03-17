import { getCurrentUser } from "@/controllers/user.controller";
import { authenticate } from "@/middleware/auth";
import { Router } from "express";

const route = Router();

route.get("/", authenticate, getCurrentUser);

export default route;
