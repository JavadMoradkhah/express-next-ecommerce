export interface CreateCategoryDto {
  name: string;
  slug: string;
  parent?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
