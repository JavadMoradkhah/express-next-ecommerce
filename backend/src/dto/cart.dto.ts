export interface CreateCartDto {
  variation: string;
  quantity: number;
}

export interface UpdateCartDto extends Pick<CreateCartDto, 'quantity'> {}
