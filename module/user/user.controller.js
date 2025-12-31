import { UserModel } from "./user.model.js";
import httpStatus from "../../utils/httpStatus.js";
import bcrypt from "bcrypt";

const userController = {};

// GET /users - ADMIN only, optional ?role=
userController.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.role = role;
    }
    const users = await UserModel.find(query).select("-password");
    return res.status(httpStatus.OK).json({ data: users });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// GET /users/:userId - ADMIN only
userController.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId).select("-password");
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }
    return res.status(httpStatus.OK).json({ data: user });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// POST /users/staff - ADMIN only
userController.createStaff = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: "STAFF",
      status: "ACTIVE",
    });

    await user.save();

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.CREATED).json({ data: { user: userResponse } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// PATCH /users/:userId/approve - ADMIN only
userController.approveUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }
    user.status = "ACTIVE";
    await user.save();

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.OK).json({ data: { user: userResponse } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// PATCH /users/:userId/reject - ADMIN only
userController.rejectUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }
    user.status = "REJECTED";
    await user.save();

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.OK).json({ data: { user: userResponse } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// PUT /users/:userId - ADMIN only
userController.updateUser = async (req, res) => {
  try {
    const { name, mobile } = req.body; // Only allow updating basic info
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    await user.save();

    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return res.status(httpStatus.OK).json({ data: { user: userResponse } });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

// DELETE /users/:userId - ADMIN only
userController.deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "User not found",
      });
    }
    return res.status(httpStatus.OK).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export default userController;