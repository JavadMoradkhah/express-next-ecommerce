import { BadRequestException, NotFoundException } from '../common/exceptions';
import { CreateCartDto, UpdateCartDto } from '../dto';
import { cartItemsRepo, cartsRepo } from '../repositories';
import * as variationsController from './variations.controller';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (userId: string) => {
  const cart = await cartsRepo.findOne({ where: { user: { id: userId } } });

  //  When no cart has been created for the user, assume the cart is empty
  if (!cart) {
    return [];
  }

  return cart.items;
};

export const findOne = async (id: string, userId: string, includeRelations = false) => {
  const cartItem = await cartItemsRepo.findOne({
    where: {
      id,
      cart: {
        user: {
          id: userId,
        },
      },
    },
    ...(includeRelations && {
      relations: {
        variation: {
          product: true,
        },
      },
    }),
  });

  if (!cartItem) {
    throw new NotFoundException(ErrorMessages.CART_ITEM_NOT_FOUND);
  }

  return cartItem;
};

export const create = async (userId: string, createCartDto: CreateCartDto) => {
  let variation = await variationsController.findOne(createCartDto.variation, true);

  if (!variation.product?.orderable) {
    throw new BadRequestException(ErrorMessages.PRODUCT_IS_NOT_ORDERABLE);
  }

  if (
    createCartDto.quantity > variation.product?.orderLimit ||
    createCartDto.quantity > variation.numberInStock
  ) {
    throw new BadRequestException(ErrorMessages.QUANTITY_NOT_ALLOWED);
  }

  let cart = await cartsRepo.findOne({ where: { user: { id: userId } } });

  if (!cart) {
    cart = await cartsRepo.save({ user: { id: userId } });
  }

  const cartItem = await cartItemsRepo.save({
    cart: {
      id: cart.id,
    },
    variation: {
      id: variation.id,
    },
    quantity: createCartDto.quantity,
  });

  return cartItem;
};

export const update = async (id: string, userId: string, { quantity }: UpdateCartDto) => {
  const cartItem = await findOne(id, userId, true);

  if (
    quantity > cartItem.variation.product.orderLimit ||
    quantity > cartItem.variation.numberInStock
  ) {
    throw new BadRequestException(ErrorMessages.QUANTITY_NOT_ALLOWED);
  }

  cartItem.quantity = quantity;

  return await cartItemsRepo.save(cartItem);
};

export const remove = async (id: string, userId: string) => {
  const cartItem = await findOne(id, userId);
  await cartItemsRepo.remove(cartItem);
};
