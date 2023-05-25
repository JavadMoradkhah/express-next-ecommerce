import { NotFoundException } from '../common/exceptions';
import { CreateWishlistDto } from '../dto';
import { productsRepo, wishlistsRepo } from '../repositories';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (userId: string) => {
  const wishlist = await wishlistsRepo.find({
    where: {
      user: {
        id: userId,
      },
      product: {
        orderable: true,
      },
    },
    select: {
      id: true,
      product: {
        id: true,
        title: true,
        price: true,
        discount: true,
        images: true,
      },
    },
    relations: {
      product: {
        images: true,
      },
    },
  });

  return wishlist;
};

export const findOne = async (id: string, userId: string) => {
  const wishlistItem = await wishlistsRepo.findOne({
    where: {
      id: id,
      user: {
        id: userId,
      },
    },
  });

  if (!wishlistItem) {
    throw new NotFoundException(ErrorMessages.WISHLIST_ITEM_NOT_FOUND);
  }

  return wishlistItem;
};

export const create = async (userId: string, { product: productId }: CreateWishlistDto) => {
  await productsRepo.findOneBy({ id: productId });

  const wishlistItem = await wishlistsRepo.save({
    user: {
      id: userId,
    },
    product: {
      id: productId,
    },
  });

  return wishlistItem;
};

export const remove = async (id: string, userId: string) => {
  const wishlistItem = await findOne(id, userId);
  await wishlistsRepo.remove(wishlistItem);
};
