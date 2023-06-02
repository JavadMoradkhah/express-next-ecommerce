import { isExists, isAfter, isBefore } from 'date-fns';
import { BadRequestException, ConflictException, NotFoundException } from '../common/exceptions';
import { CreatePromotionDto, UpdatePromotionDto } from '../dto';
import { promotionsRepo, productsRepo } from '../repositories';
import ErrorMessages from '../enums/error-messages.enum';

const checkProductId = async (productId: string) => {
  const product = await productsRepo.findOneBy({ id: productId });

  if (!product) {
    throw new BadRequestException(ErrorMessages.PRODUCT_NOT_FOUND);
  }

  if (!product.orderable) {
    throw new BadRequestException(ErrorMessages.PRODUCT_IS_NOT_ORDERABLE_ADMIN);
  }
};

const checkPromotionExists = async (productId: string) => {
  const exists = await promotionsRepo.exist({ where: { product: { id: productId } } });

  if (exists) {
    throw new ConflictException(ErrorMessages.PROMOTION_ALREADY_EXISTS);
  }
};

function validateDates(startDateStr: string, endDateStr: string) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (!isExists(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())) {
    throw new BadRequestException(ErrorMessages.PROMOTION_START_DATE_IS_INVALID);
  }

  if (!isExists(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())) {
    throw new BadRequestException(ErrorMessages.PROMOTION_END_DATE_IS_INVALID);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // startDat >= Today
  if (isBefore(startDate, today)) {
    throw new BadRequestException(ErrorMessages.PROMOTION_START_DATE_IS_EARLY);
  }

  // startDate < endDate
  if (!isAfter(endDate, startDate)) {
    throw new BadRequestException(ErrorMessages.PROMOTION_END_DATE_MUST_BE_AFTER_START_DATE);
  }
}

export const findAll = async () => {
  const promotions = await promotionsRepo.find({
    select: {
      id: true,
      product: {
        id: true,
        title: true,
      },
      startDate: true,
      endDate: true,
      discountRate: true,
      createdAt: true,
      updatedAt: true,
    },
    relations: {
      product: true,
    },
  });

  return promotions;
};

export const findOne = async (id: string) => {
  const promotion = await promotionsRepo.findOne({
    where: { id },
    select: {
      id: true,
      product: {
        id: true,
        title: true,
      },
      startDate: true,
      endDate: true,
      discountRate: true,
      createdAt: true,
      updatedAt: true,
    },
    relations: {
      product: true,
    },
  });

  if (!promotion) {
    throw new NotFoundException(ErrorMessages.PROMOTION_NOT_FOUND);
  }

  return promotion;
};

const findPromotionById = async (id: string) => {
  const promotion = await promotionsRepo.findOneBy({ id });

  if (!promotion) {
    throw new NotFoundException(ErrorMessages.PROMOTION_NOT_FOUND);
  }

  return promotion;
};

export const create = async ({
  product: productId,
  startDate,
  endDate,
  discountRate,
}: CreatePromotionDto) => {
  await checkProductId(productId);

  await checkPromotionExists(productId);

  validateDates(startDate, endDate);

  const promotion = await promotionsRepo.save({
    product: {
      id: productId,
    },
    discountRate: discountRate,
    startDate: startDate,
    endDate: endDate,
  });

  return promotion;
};

export const update = async (
  id: string,
  { discountRate, startDate, endDate }: UpdatePromotionDto
) => {
  let promotion = await findPromotionById(id);

  validateDates(startDate, endDate);

  promotion.discountRate = discountRate;

  promotion.startDate = new Date(startDate);

  promotion.endDate = new Date(endDate);

  promotion = await promotionsRepo.save(promotion);

  return promotion;
};

export const remove = async (id: string) => {
  const promotion = await findPromotionById(id);
  await promotionsRepo.remove(promotion);
};
