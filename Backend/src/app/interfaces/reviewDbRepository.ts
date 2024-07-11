// src/app/interfaces/reviewDbRepository.ts
import { reviewRepositoryMongodbType } from '../../frameworks/database/repositories/reviewRepositoryMongodb';
import { ReviewInterface } from '../../types/reviewInterface';

export const reviewDbRepository = (repository: ReturnType<reviewRepositoryMongodbType>) => {

  const createReview = async (review: Partial<ReviewInterface>) => await repository.createReview(review);

  const getAllReviews = async (doctorId: string) => await repository.getAllReviews(doctorId);

  const submitReply = async (reviewId: string, replyText: string) => await repository.submitReply(reviewId, replyText);

  return {
    createReview,
    getAllReviews,
    submitReply,
  };
};

export type ReviewDbRepositoryInterface = ReturnType<typeof reviewDbRepository>;
