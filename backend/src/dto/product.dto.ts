export interface CreateProductDto {
  category: string;
  title: string;
  description: string;
  price: number;
  discount?: number;
  orderLimit?: number;
  orderable: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
