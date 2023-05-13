import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateCountryDto, UpdateCountryDto } from '../dto';
import { countriesRepo } from '../repositories';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const countries = await countriesRepo.find({
    order: {
      name: 'ASC',
    },
  });

  return countries;
};

export const findOne = async (id: string) => {
  const country = await countriesRepo.findOneBy({ id });

  if (!country) {
    throw new NotFoundException(ErrorMessages.COUNTRY_NOT_FOUND);
  }

  return country;
};

export const create = async ({ name }: CreateCountryDto) => {
  await checkConflicts(name);

  const country = await countriesRepo.save(
    countriesRepo.create({
      name: name,
    })
  );

  return country;
};

export const update = async (id: string, { name }: UpdateCountryDto) => {
  let country = await findOne(id);

  await checkConflicts(name);

  country.name = name;

  country = await countriesRepo.save(country);

  return country;
};

export const remove = async (id: string) => {
  const country = await findOne(id);
  await countriesRepo.remove(country);
};

async function checkConflicts(name: string): Promise<void | never> {
  const exists = await countriesRepo.exist({
    where: { name },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COUNTRY_ALREADY_EXISTS);
  }
}
