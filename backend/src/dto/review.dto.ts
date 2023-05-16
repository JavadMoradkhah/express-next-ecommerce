import { ReviewStatus } from '../entities';

export interface CreateReviewDto {
  product: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto extends Partial<Omit<CreateReviewDto, 'product'>> {}

export interface UpdateReviewStatusDto {
  status: ReviewStatus;
}
