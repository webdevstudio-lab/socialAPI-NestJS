import { IsNotEmpty, IsEmail } from 'class-validator';

export class demandeRestePasswordDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
