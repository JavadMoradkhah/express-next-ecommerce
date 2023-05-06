export interface CreateColorDto {
  name: string;
  code: string;
}

export interface UpdateColorDto extends Partial<CreateColorDto> {}
