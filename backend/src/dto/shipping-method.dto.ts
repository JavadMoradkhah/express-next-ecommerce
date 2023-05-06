export interface CreateShippingMethodDto {
  name: string;
  price: number;
}

export interface UpdateShippingMethodDto extends Partial<CreateShippingMethodDto> {}
