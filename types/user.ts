export type UserRole = 'admin' | 'manager' | 'user';
export type UserStatus = 'active' | 'blocked';

export enum UserRoleEnum {
  Admin = 'admin',
  Manager = 'manager',
  User = 'user',
}

export enum UserStatusEnum {
  Active = 'active',
  Blocked = 'blocked',
}

export interface UserModel {
  _id: string;
  username: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  deptId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  deptId?: string;
  status?: UserStatus;
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: UserRole;
  deptId?: string;
  status?: UserStatus;
}
