// src/types/reviewInterface.ts
import { Document, Types } from "mongoose";

export interface CreateReviewInterface {
    doctor: string; // Use mongoose.string
    user: string; // Use mongoose.string
    reviewText: string;
    rating: number;
    replyText?: string;
}

export interface ReviewInterface extends Document {
    doctor: string; // Use mongoose.string
    user: string; // Use mongoose.string
    reviewText: string;
    rating: number;
    replyText?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
