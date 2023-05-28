export interface CreateProductTagDto {
  product: string;
  tag: string;
}

export interface UpdateProductTagDto extends Partial<CreateProductTagDto> {}
