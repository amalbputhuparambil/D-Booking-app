import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    phoneNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    address: {
      type: String,
    },
    dateofbirth: {
      type: Date,
    },
    marital_status: {
      type: String,
      enum: ["single", "married"],
      default: "single",
    },
    bloodGroup: {
      type: String,
    },
    height: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    allergies: {
      type: [String],
    },
    chronicConditions: {
      type: [String],
    },

    emergencyContactName: {
      type: String,
    },
    emergencyContactRelationship: {
      type: String,
    },
    emergencyContactPhoneNumber: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    authenticationMethod: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    verificationCode: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
