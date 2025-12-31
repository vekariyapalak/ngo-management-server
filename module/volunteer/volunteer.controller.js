import { UserModel } from "../user/user.model.js";
import httpStatus from "../../utils/httpStatus.js";

const volunteerController = {};

// GET /volunteers - ADMIN + STAFF
volunteerController.getVolunteers = async (req, res) => {
  try {
    const volunteers = await UserModel.find({ role: "VOLUNTEER" }).select("-password");
    return res.status(httpStatus.OK).json({ data: volunteers });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

export default volunteerController;