import { CreateUserDto } from '../dto';

export interface SessionUser extends Omit<CreateUserDto, 'password'> {
  id: string;
}
