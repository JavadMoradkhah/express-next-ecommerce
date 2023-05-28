export interface CreateBrandDto {
  name: string;
  slug: string;
}

export interface UpdateBrandDto extends Partial<CreateBrandDto> {}
