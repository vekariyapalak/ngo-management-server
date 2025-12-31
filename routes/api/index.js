import express from "express";
import { authRoutes } from "../../module/auth/auth.routes.js";
import userRoutes from "../../module/user/user.routes.js";
import volunteerRoutes from "../../module/volunteer/volunteer.routes.js";
import donationRoutes from "../../module/donation/donation.routes.js";

const apiRoutes = express.Router();

apiRoutes.get("/", function (req, res, next) {
  res.json({ message: "from index api" });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/volunteers", volunteerRoutes);
apiRoutes.use("/donations", donationRoutes);

export default apiRoutes;
