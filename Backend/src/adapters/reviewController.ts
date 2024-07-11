// src/adapters/reviewController.ts
import { NextFunction, Request, Response } from 'express';
import { ReviewDbRepositoryInterface } from '../app/interfaces/reviewDbRepository';
import { reviewRepositoryMongodbType } from '../frameworks/database/repositories/reviewRepositoryMongodb';
import { createReview, getAllReviews, submitReply } from '../app/use-cases/user/review/review';

const reviewController = (
    reviewDbRepository: (repository: ReturnType<reviewRepositoryMongodbType>) => ReviewDbRepositoryInterface,
    reviewDbRepositoryImpl: reviewRepositoryMongodbType
) => {
    const dbReviewRepository = reviewDbRepository(reviewDbRepositoryImpl());

    const createReviewHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { rating, reviewText, user, doctor } = req.body.review;
            const newReview = await createReview({ rating, reviewText, user, doctor }, dbReviewRepository);
            return res.status(200).json({ success: true, message: "Review submitted", data: newReview });
        } catch (error) {
            next(error);
        }
    };

    const getAllReviewsHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const doctorId = req.params.id;
            const reviews = await getAllReviews(doctorId, dbReviewRepository);
            return res.status(200).json({ success: true, message: "Successful", data: reviews });
        } catch (error) {
            next(error);
        }
    };

    const submitReplyHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const reviewId = req.params.id;
            const { replyText } = req.body;
            const updatedReview = await submitReply(reviewId, replyText, dbReviewRepository);
            return res.status(200).json({ success: true, message: "Reply submitted successfully", data: updatedReview });
        } catch (error) {
            next(error);
        }
    };

    return {
        createReviewHandler,
        getAllReviewsHandler,
        submitReplyHandler,
    };
};

export default reviewController;
