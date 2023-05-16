import * as productsController from './products.controller';
import { BadRequestException, NotFoundException } from '../common/exceptions';
import { reviewsRepo } from '../repositories';
import { CreateReviewDto, UpdateReviewDto, UpdateReviewStatusDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const reviews = await reviewsRepo.find({
    select: {
      id: true,
      status: true,
      user: {
        id: true,
        firstName: true,
        lastName: true,
      },
      createdAt: true,
      updatedAt: true,
    },
    relations: {
      user: true,
    },
    order: {
      updatedAt: 'DESC',
    },
  });

  return reviews;
};

export const findUserReviews = async (userId: string) => {
  const reviews = await reviewsRepo.find({
    select: {
      id: true,
      status: true,
      rating: true,
      product: {
        id: true,
        title: true,
      },
      createdAt: true,
      updatedAt: true,
    },
    relations: {
      product: true,
    },
    order: {
      updatedAt: 'DESC',
    },
    where: {
      user: {
        id: userId,
      },
    },
  });

  return reviews;
};

export const findOne = async (
  id: string,
  options?: {
    userId?: string;
    includeRelations?: boolean;
  }
) => {
  const review = await reviewsRepo.findOne({
    where: {
      id,
      //  Filter by user id too if a user id was provided
      ...(options?.userId && {
        user: {
          id: options.userId,
        },
      }),
    },
    select: {
      id: true,
      status: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      user: {
        id: true,
        ...(options?.includeRelations && {
          firstName: true,
          lastName: true,
          email: true,
        }),
      },
      ...(options?.includeRelations && {
        comment: true,
        product: {
          id: true,
          title: true,
        },
      }),
    },
    relations: {
      user: true,
      ...(options?.includeRelations && { product: true }),
    },
  });

  if (!review) {
    throw new NotFoundException(ErrorMessages.REVIEW_NOT_FOUND);
  }

  return review;
};

export const create = async (userId: string, createReviewDto: CreateReviewDto) => {
  const product = await productsController.findOne(createReviewDto.product);

  const exists = await reviewsRepo.findOne({
    where: {
      user: {
        id: userId,
      },
      product: {
        id: product.id,
      },
    },
  });

  if (exists) {
    throw new BadRequestException(ErrorMessages.REVIEW_ALREADY_EXISTS);
  }

  const review = await reviewsRepo.save({
    user: {
      id: userId,
    },
    product: {
      id: product.id,
    },
    rating: createReviewDto.rating,
    comment: createReviewDto.comment,
  });

  return review;
};

export const update = async (id: string, userId: string, { rating, comment }: UpdateReviewDto) => {
  let review = await findOne(id, { userId });

  if (rating !== undefined) review.rating = rating;
  if (comment) review.comment = comment;

  review = await reviewsRepo.save(review);

  return review;
};

export const updateStatus = async (id: string, { status }: UpdateReviewStatusDto) => {
  let review = await findOne(id);

  review.status = status;

  review = await reviewsRepo.save(review);

  return review;
};

export const remove = async (id: string, userId: string) => {
  const review = await findOne(id, { userId });
  await reviewsRepo.remove(review);
};
