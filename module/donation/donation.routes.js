import express from "express";
import donationController from "./donation.controller.js";
import { asyncWrapper } from "../../utils/asyncWrapper.js";
import auth from "../../middlewares/auth.js";
import permit from "../../middlewares/permit.js";
import validateObjectId from "../../middlewares/validateObjectId.js";

const donationRoutes = express.Router();

// POST /donations - Public
donationRoutes.post("/", asyncWrapper(donationController.createDonation));

// GET /donations - ADMIN only
donationRoutes.get("/", auth, permit("ADMIN"), asyncWrapper(donationController.getAllDonations));

// GET /donations/user/:userId - ADMIN or DONOR (own data)
donationRoutes.get("/user/:userId", auth, validateObjectId, asyncWrapper(donationController.getDonationsByUser));

export default donationRoutes;