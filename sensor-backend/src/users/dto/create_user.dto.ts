// sensor-backend/src/users/dto/create-user.dto.ts
import { UserRole } from '../user.entity';

export class CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
}