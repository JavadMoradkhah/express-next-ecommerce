import { NotFoundException } from '../../common/exceptions';
import { reviewsRepo } from '../../repositories';
import { UpdateReviewStatusDto } from '../../dto';
import { AdminQuery } from '../../interfaces';
import { getPaginationData, getPaginationParams } from '../../common/app-utils';
import ErrorMessages from '../../enums/error-messages.enum';

export const findAll = async ({ page, q }: AdminQuery) => {
  const { skip, take } = getPaginationParams(page);

  let query = reviewsRepo
    .createQueryBuilder('review')
    .select([
      'review.id',
      'review.status',
      'review.rating',
      'user.id',
      'user.firstName',
      'user.lastName',
      'product.id',
      'product.title',
    ])
    .innerJoin('review.user', 'user')
    .innerJoin('review.product', 'product')
    .orderBy('review.createdAt', 'DESC')
    .limit(take)
    .offset(skip);

  if (q) {
    query = query.where('MATCH (product.title) AGAINST (:query)', {
      query: q,
    });
  }

  const [reviews, count] = await query.getManyAndCount();

  return {
    data: reviews,
    pagination: getPaginationData(count, page, take),
  };
};

export const findOne = async (id: string) => {
  const review = await reviewsRepo.findOne({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      rating: true,
      createdAt: true,
      updatedAt: true,
      user: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
      },
      comment: true,
      product: {
        id: true,
        title: true,
      },
    },
    relations: {
      user: true,
      product: true,
    },
  });

  if (!review) {
    throw new NotFoundException(ErrorMessages.REVIEW_NOT_FOUND);
  }

  return review;
};

export const updateStatus = async (id: string, { status }: UpdateReviewStatusDto) => {
  let review = await findOne(id);

  review.status = status;

  review = await reviewsRepo.save(review);

  return review;
};

export const remove = async (id: string) => {
  const review = await findOne(id);
  await reviewsRepo.remove(review);
};
