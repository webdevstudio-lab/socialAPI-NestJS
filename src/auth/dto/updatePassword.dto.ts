import { IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly newPassword: string;
}
