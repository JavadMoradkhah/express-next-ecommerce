export interface CreateProductImageDto {
  product: string;
  image: string;
  isMain?: boolean;
}

export interface UpdateProductImageDto {
  isMain: boolean;
}
