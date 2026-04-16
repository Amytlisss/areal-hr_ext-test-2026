export class UserResponseDto {
  id: string;
  employeeId: string | null;
  lastName: string;
  firstName: string;
  middleName: string | null;
  login: string;
  roleId: string;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;
}