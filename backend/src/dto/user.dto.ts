export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  emailVerifiedAt?: Date;
}

export interface LoginDto extends Pick<CreateUserDto, 'email' | 'password'> {}
