import express from "express";
import authController from "./auth.controller.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";

const authRoutes = express.Router();

// POST /auth/register
authRoutes.post("/register", asyncWrapper(authController.register));

// POST /auth/login
authRoutes.post("/login", asyncWrapper(authController.login));

// POST /auth/register-admin-staff
authRoutes.post("/register-admin-staff", asyncWrapper(authController.registerAdminStaff));

export { authRoutes };