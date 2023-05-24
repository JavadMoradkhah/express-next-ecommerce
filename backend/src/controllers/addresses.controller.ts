import { NotFoundException } from '../common/exceptions';
import { CreateAddressDto, UpdateAddressDto } from '../dto';
import { addressesRepo } from '../repositories';
import * as countriesController from './countries.controller';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (userId: string) => {
  const addresses = await addressesRepo.find({
    where: {
      user: {
        id: userId,
      },
    },
    select: {
      id: true,
      country: {
        id: true,
        name: true,
      },
      region: true,
      city: true,
      addressLine1: true,
      postalCode: true,
      isDefault: true,
    },
    relations: {
      country: true,
    },
    order: {
      createdAt: 'DESC',
    },
  });

  return addresses;
};

export const findOne = async (id: string, userId: string) => {
  const address = await addressesRepo.findOne({
    where: {
      id: id,
      user: {
        id: userId,
      },
    },
  });

  if (!address) {
    throw new NotFoundException(ErrorMessages.ADDRESS_NOT_FOUND);
  }

  return address;
};

export const create = async (userId: string, createAddressDto: CreateAddressDto) => {
  const country = await countriesController.findOne(createAddressDto.country);

  const address = await addressesRepo.save({
    user: {
      id: userId,
    },
    firstName: createAddressDto.firstName,
    lastName: createAddressDto.lastName,
    phoneNumber: createAddressDto.phoneNumber,
    country: {
      id: country.id,
    },
    region: createAddressDto.region,
    city: createAddressDto.city,
    addressLine1: createAddressDto.addressLine1,
    postalCode: createAddressDto.postalCode,
    ...(createAddressDto.addressLine2 && { addressLine2: createAddressDto.addressLine2 }),
    ...(createAddressDto.unitNumber && { unitNumber: createAddressDto.unitNumber }),
    ...(createAddressDto.isDefault !== undefined && { isDefault: createAddressDto.isDefault }),
    ...(createAddressDto.description && { description: createAddressDto.description }),
  });

  return address;
};

export const update = async (id: string, userId: string, updateAddressDto: UpdateAddressDto) => {
  let address = await findOne(id, userId);

  const {
    firstName,
    lastName,
    phoneNumber,
    region,
    city,
    addressLine1,
    addressLine2,
    postalCode,
    unitNumber,
    isDefault,
    description,
  } = updateAddressDto;

  let country = null;

  if (updateAddressDto.country) {
    country = await countriesController.findOne(updateAddressDto.country);
  }

  if (firstName) address.firstName = firstName;
  if (lastName) address.lastName = lastName;
  if (phoneNumber) address.phoneNumber = phoneNumber;
  if (country) address.country = country;
  if (region) address.region = region;
  if (city) address.city = city;
  if (addressLine1) address.addressLine1 = addressLine1;
  if (addressLine2) address.addressLine2 = addressLine2;
  if (postalCode) address.postalCode = postalCode;
  if (unitNumber) address.unitNumber = unitNumber;
  if (isDefault !== undefined) address.isDefault = isDefault;
  if (description) address.description = description;

  return addressesRepo.save(address);
};

export const remove = async (id: string, userId: string) => {
  const address = await findOne(id, userId);
  await addressesRepo.remove(address);
};
