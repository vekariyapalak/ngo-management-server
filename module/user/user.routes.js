import express from "express";
import userController from "./user.controller.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";
import auth from "../../middlewares/auth.js";
import permit from "../../middlewares/permit.js";
import validateObjectId from "../../middlewares/validateObjectId.js";

const userRoutes = express.Router();

// All user routes require authentication and ADMIN role
userRoutes.use(auth);
userRoutes.use(permit("ADMIN"));

// GET /users
userRoutes.get("/", asyncWrapper(userController.getAllUsers));

// GET /users/:userId
userRoutes.get("/:userId", validateObjectId, asyncWrapper(userController.getUserById));

// POST /users/staff
userRoutes.post("/staff", asyncWrapper(userController.createStaff));

// PATCH /users/:userId/approve
userRoutes.patch("/:userId/approve", validateObjectId, asyncWrapper(userController.approveUser));

// PATCH /users/:userId/reject
userRoutes.patch("/:userId/reject", validateObjectId, asyncWrapper(userController.rejectUser));

// PUT /users/:userId
userRoutes.put("/:userId", validateObjectId, asyncWrapper(userController.updateUser));

// DELETE /users/:userId
userRoutes.delete("/:userId", validateObjectId, asyncWrapper(userController.deleteUser));

export default userRoutes;