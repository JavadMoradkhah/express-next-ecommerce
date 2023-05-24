export interface CreateAddressDto {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  region: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  unitNumber?: string;
  postalCode: string;
  isDefault?: boolean;
  description?: string;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}
