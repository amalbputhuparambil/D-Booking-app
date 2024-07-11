// src/frameworks/database/repositories/reviewRepositoryMongodb.ts
import Review from '../../database/models/Review';
import Doctor from '../../database/models/doctor';
import { ReviewInterface } from '../../../types/reviewInterface';

export const reviewRepositoryMongodb = () => {
  const createReview = async (review: Partial<ReviewInterface>) => {
    const newReview = new Review(review);
    const savedReview = await newReview.save();
    await Doctor.findByIdAndUpdate(review.doctor, {
      $push: { reviews: savedReview._id },
    });
    return savedReview;
  };

  const getAllReviews = async (doctorId: string) => {
    return await Review.find({ doctor: doctorId });
  };

  const submitReply = async (reviewId: string, replyText: string) => {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new Error('Review not found');
    }
    // review.replyText = replyText;
    return await review.save();
  };

  return {
    createReview,
    getAllReviews,
    submitReply,
  };
};

export type reviewRepositoryMongodbType = typeof reviewRepositoryMongodb;
