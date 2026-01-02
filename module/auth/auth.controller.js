import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./auth.model.js";
import httpStatus from "../../utils/httpStatus.js";
import appConfig from "../../config/env/index.js";

const authController = {};

// Register
authController.register = async (req, res, next) => {
  try {
    const { email, password, role, name, mobile, address, skills, availability } = req.body;

    // Block ADMIN and STAFF creation
    if (role === "ADMIN" || role === "STAFF") {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Cannot register as ADMIN or STAFF",
      });
    }

    // Validate required fields for volunteers
    if (role === "VOLUNTEER") {
      if (!skills || !availability) {
        return res.status(httpStatus.BAD_REQUEST).json({
          message: "Skills and availability are required for volunteers",
        });
      }
    }

    const isExistingUser = await UserModel.findOne({ email });
    if (isExistingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Email already exists!",
      });
    }

    // Set status based on role
    let status = "PENDING";
    if (role === "DONOR") {
      status = "ACTIVE";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role,
      status,
      skills: role === "VOLUNTEER" ? skills : undefined,
      availability: role === "VOLUNTEER" ? availability : undefined,
    });

    await user.save();

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.CREATED).json({ data: { user: userResponse } });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: e.message,
    });
  }
};

// Login
authController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    console.log("User found:", user);
    if (user && (await bcrypt.compare(password, user.password))) {
      // Check if status is ACTIVE
      if (user.status !== "ACTIVE") {
        return res.status(httpStatus.UNAUTHORIZED).json({
          message: "Account not active",
        });
      }
      const token = jwt.sign({ sub: user._id }, appConfig.jwt_key, {
        expiresIn: "7d",
      });
      return res.status(httpStatus.OK).json({
        message: "Auth successful",
        token: token,
        role: user.role,
      });
    } else {
      return res.status(httpStatus.UNAUTHORIZED).json({
        message: "Auth failed!",
      });
    }
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: e.message,
    });
  }
};

const ADMIN_KEY = "supersecretadmin123"; // Static password for creating ADMIN/STAFF

// Register Admin or Staff with key
authController.registerAdminStaff = async (req, res, next) => {
  try {
    const { email, password, role, name, mobile, adminKey } = req.body;

    // Check static key
    if (adminKey !== ADMIN_KEY) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: "Invalid admin key",
      });
    }

    // Allow only ADMIN or STAFF
    if (role !== "ADMIN" && role !== "STAFF") {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Role must be ADMIN or STAFF",
      });
    }

    const isExistingUser = await UserModel.findOne({ email });
    if (isExistingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Email already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
      status: "ACTIVE", // Always ACTIVE for ADMIN/STAFF
    });

    await user.save();

    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.CREATED).json({ data: { user: userResponse } });
  } catch (e) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: e.message,
    });
  }
};

export default authController;