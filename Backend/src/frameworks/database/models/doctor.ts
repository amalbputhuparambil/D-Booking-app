import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phoneNumber:{
        type:String,
      },      
      password: {
        type: String,
      },
      
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
      role: {
        type: String,
        enum: ["doctor"],
        default: "doctor",
      },
      education:{
        type:String,
      },
      description:{
        type:String,
      },
      lisenceCertificate:{
        type:String,
      },
      gender:{
        type:String,    
    },
    profileImage:{
        type:String,
    },
    isVerified: {
        type: Boolean,
        default: false,
      },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    isApproved:{
      type:Boolean,
      default:false,
    },
    status:{
      type:String,
      default:"pending",
    },
    reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
    createdAt:{
        type:Date,
        default: new Date(),
    },
    rejectedReason:{
      type:String,
      default:"",
    },
    consultationType:{
      type:String,
    },
    verificationToken: String,
},
{timestamps:true}
)

export default mongoose.model("Doctor",doctorSchema);