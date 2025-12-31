import mongoose from "mongoose";

const validateObjectId = (req, res, next) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      status: "ERROR",
      message: "Invalid user ID",
    });
  }
  next();
};

export default validateObjectId;