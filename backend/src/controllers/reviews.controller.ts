import * as productsController from './products.controller';
import { BadRequestException, NotFoundException } from '../common/exceptions';
import { reviewsRepo } from '../repositories';
import { CreateReviewDto, UpdateReviewDto } from '../dto';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (userId: string) => {
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

export const findOrFail = async (id: string, userId: string) => {
  const review = await reviewsRepo.findOne({
    where: {
      id,
      user: {
        id: userId,
      },
    },
    select: {
      id: true,
      rating: true,
      comment: true,
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
  let review = await findOrFail(id, userId);

  if (rating !== undefined) review.rating = rating;
  if (comment) review.comment = comment;

  review = await reviewsRepo.save(review);

  return review;
};

export const remove = async (id: string, userId: string) => {
  const review = await findOrFail(id, userId);
  await reviewsRepo.remove(review);
};
