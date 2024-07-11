// src/app/use-cases/user/review/review.ts
import { ReviewDbRepositoryInterface } from '../../../interfaces/reviewDbRepository';
import { ReviewInterface } from '../../../../types/reviewInterface';

export const createReview = async (
  review: any, 
  reviewDbRepository: ReviewDbRepositoryInterface
) => {
  const newReview = await reviewDbRepository.createReview(review);
  return newReview;
};

export const getAllReviews = async (
  doctorId: string, 
  reviewDbRepository: ReviewDbRepositoryInterface
) => {
  const reviews = await reviewDbRepository.getAllReviews(doctorId);
  return reviews;
};

export const submitReply = async (
  reviewId: string, 
  replyText: string, 
  reviewDbRepository: ReviewDbRepositoryInterface
) => {
  const updatedReview = await reviewDbRepository.submitReply(reviewId, replyText);
  return updatedReview;
};
