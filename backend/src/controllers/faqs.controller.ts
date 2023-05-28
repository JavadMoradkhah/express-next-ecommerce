import { faqsRepo } from '../repositories';
import { BadRequestException, NotFoundException } from '../common/exceptions';
import { CreateFaqDto, UpdateFaqDto } from '../dto';
import * as faqCategoriesController from './faq-categories.controller';
import ErrorMessages from '../enums/error-messages.enum';

export const findAll = async () => {
  const faqs = await faqsRepo.find({
    order: {
      question: 'ASC',
    },
  });

  return faqs;
};

export const findOne = async (id: string) => {
  const faq = await faqsRepo.findOneBy({ id });

  if (!faq) {
    throw new NotFoundException(ErrorMessages.FAQ_NOT_FOUND);
  }

  return faq;
};

export const create = async ({ category: categoryId, question, answer }: CreateFaqDto) => {
  const exists = await faqsRepo.exist({ where: { question } });

  if (exists) {
    throw new BadRequestException(ErrorMessages.FAQ_ALREADY_EXISTS);
  }

  const category = await faqCategoriesController.findOne(categoryId);

  const faq = await faqsRepo.save({
    question,
    answer,
    category: {
      id: category.id,
    },
  });

  return faq;
};

export const update = async (
  id: string,
  { category: categoryId, question, answer }: UpdateFaqDto
) => {
  let faq = await findOne(id);

  if (categoryId) {
    faq.category = await faqCategoriesController.findOne(categoryId);
  }

  if (question) {
    const exists = await faqsRepo.exist({ where: { question } });

    if (exists) {
      throw new BadRequestException(ErrorMessages.FAQ_ALREADY_EXISTS);
    }

    faq.question = question;
  }

  if (answer) {
    faq.answer = answer;
  }

  faq = await faqsRepo.save(faq);

  return faq;
};

export const remove = async (id: string) => {
  const faq = await findOne(id);
  await faqsRepo.remove(faq);
};
