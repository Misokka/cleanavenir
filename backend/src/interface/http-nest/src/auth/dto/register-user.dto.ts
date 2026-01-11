import { IsEnum, IsString } from "class-validator"

export enum UserRole {
  CLIENT = 'CLIENT',
  ADVISOR = 'ADVISOR',
  DIRECTOR = 'DIRECTOR'
}
export class RegisterUserDto {
  
  @IsString()
  firstname: string

  @IsString()
  lastname: string

  @IsString()
  email: string

  @IsString()
  password: string
  
  @IsEnum(UserRole)
  role: UserRole
}