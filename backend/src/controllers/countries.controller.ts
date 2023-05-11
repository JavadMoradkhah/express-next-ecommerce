import { Request, Response } from 'express';
import { ConflictException, NotFoundException } from '../common/exceptions';
import { CreateCountryDto, UpdateCountryDto } from '../dto';
import { countriesRepo } from '../repositories';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async (req: Request, res: Response) => {
  const countries = await countriesRepo.find({
    order: {
      name: 'ASC',
    },
  });

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: countries,
  } as ResponsePayload);
};

export const findOrFail = async (id: string) => {
  const country = await countriesRepo.findOneBy({ id });

  if (!country) {
    throw new NotFoundException(ErrorMessages.COUNTRY_NOT_FOUND);
  }

  return country;
};

export const findOne = async (req: Request, res: Response) => {
  const id = req.params.id;

  const country = await findOrFail(id);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: country,
  } as ResponsePayload);
};

export const create = async (req: Request, res: Response) => {
  const { name } = req.body as CreateCountryDto;

  await checkConflicts(name);

  const country = await countriesRepo.save(
    countriesRepo.create({
      name: name,
    })
  );

  res.status(StatusCode.CREATED).json({
    statusCode: StatusCode.CREATED,
    data: country,
  } as ResponsePayload);
};

export const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name } = req.body as UpdateCountryDto;

  let country = await findOrFail(id);

  await checkConflicts(name);

  country.name = name;

  country = await countriesRepo.save(country);

  res.status(StatusCode.OK).json({
    statusCode: StatusCode.OK,
    data: country,
  } as ResponsePayload);
};

export const remove = async (req: Request, res: Response) => {
  const id = req.params.id;

  const country = await findOrFail(id);

  await countriesRepo.remove(country);

  res.status(StatusCode.NO_CONTENT).json({
    statusCode: StatusCode.NO_CONTENT,
    data: null,
  } as ResponsePayload);
};

async function checkConflicts(name: string): Promise<void | never> {
  const exists = await countriesRepo.exist({
    where: { name },
  });

  if (exists) {
    throw new ConflictException(ErrorMessages.COUNTRY_ALREADY_EXISTS);
  }
}
