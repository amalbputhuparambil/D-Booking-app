// src/models/ReviewModel.ts
import mongoose, { Schema, Model } from 'mongoose';
import { ReviewInterface } from '../../../types/reviewInterface';

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// const Review: Model<ReviewInterface> = mongoose.model<ReviewInterface>('Review', reviewSchema);
export default mongoose.model("Review", reviewSchema);


