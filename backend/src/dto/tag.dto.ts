export interface CreateTagDto {
  name: string;
  slug: string;
}

export interface UpdateTagDto extends Partial<CreateTagDto> {}
