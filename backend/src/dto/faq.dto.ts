export interface CreateFaqDto {
  category: string;
  question: string;
  answer: string;
}

export interface UpdateFaqDto extends Partial<CreateFaqDto> {}
