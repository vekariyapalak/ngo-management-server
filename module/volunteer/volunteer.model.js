import mongoose from "mongoose";

const schema = mongoose.Schema;

const volunteerProfileSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  skills: {
    type: String,
    required: true,
  },
  availability: {
    type: String,
    enum: ["FULL_TIME", "PART_TIME", "FLEXIBLE"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

const VolunteerProfile = mongoose.model("volunteerProfile", volunteerProfileSchema);
export { VolunteerProfile };