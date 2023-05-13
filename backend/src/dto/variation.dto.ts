export interface CreateVariationDto {
  product: string;
  color?: string;
  size?: string;
  price?: number;
  numberInStock: number;
}

export interface UpdateVariationDto
  extends Partial<Pick<CreateVariationDto, 'price' | 'numberInStock'>> {}
