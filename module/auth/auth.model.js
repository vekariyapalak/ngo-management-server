import mongoose from "mongoose";

const schema = mongoose.Schema;

const userSchema = new schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
    enum: ['ADMIN', 'STAFF', 'VOLUNTEER', 'DONOR']
  },
  status: {
    type: String,
    enum: ["PENDING", "ACTIVE", "REJECTED"],
    default: "PENDING"
  },
});

const UserModel = mongoose.model("user", userSchema);
export { UserModel };
