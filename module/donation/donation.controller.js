import { UserModel } from "../user/user.model.js";
import { Donation } from "./donation.model.js";
import httpStatus from "../../utils/httpStatus.js";
import bcrypt from "bcrypt";

const donationController = {};

// POST /donations - Public
donationController.createDonation = async (req, res) => {
  try {
    const { email, name, mobile, amount, paymentId, paymentStatus } = req.body;

    let user = await UserModel.findOne({ email });
    if (!user) {
      // Auto-create DONOR user
      const hashedPassword = await bcrypt.hash("defaultpassword", 10); // Or generate random
      user = new UserModel({
        name,
        email,
        password: hashedPassword,
        mobile,
        role: "DONOR",
        status: "ACTIVE",
      });
      await user.save();
    }

    const donation = new Donation({
      userId: user._id,
      amount,
      paymentId,
      paymentStatus,
    });

    await donation.save();

    return res.status(httpStatus.CREATED).json({
      data: {
        donation,
        user: { ...user.toObject(), password: undefined },
      },
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// GET /donations - ADMIN only
donationController.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("userId", "-password");
    return res.status(httpStatus.OK).json({ data: donations });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// GET /donations/user/:userId - ADMIN or DONOR (own data only)
donationController.getDonationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    // Check if ADMIN or own userId
    if (req.user.role !== "ADMIN" && req.user._id.toString() !== userId) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Access denied",
      });
    }

    const donations = await Donation.find({ userId }).populate("userId", "-password");
    return res.status(httpStatus.OK).json({ data: donations });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export default donationController;