import express from "express";
import volunteerController from "./volunteer.controller.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";
import auth from "../../middlewares/auth.js";
import permit from "../../middlewares/permit.js";

const volunteerRoutes = express.Router();

// Require authentication and ADMIN or STAFF role
volunteerRoutes.use(auth);
volunteerRoutes.use(permit("ADMIN", "STAFF"));

// GET /volunteers
volunteerRoutes.get("/", asyncWrapper(volunteerController.getVolunteers));

export default volunteerRoutes;