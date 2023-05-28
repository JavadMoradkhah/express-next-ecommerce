export interface CreatePromotionDto {
  product: string;
  startDate: string;
  endDate: string;
  discountRate: number;
}

export interface UpdatePromotionDto extends Omit<CreatePromotionDto, 'product'> {}
