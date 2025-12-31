import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["ADMIN", "STAFF", "VOLUNTEER", "DONOR"],
  },
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "REJECTED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("user", userSchema);
export { UserModel };
