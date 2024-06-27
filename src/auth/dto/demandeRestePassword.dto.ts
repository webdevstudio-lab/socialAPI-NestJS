import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class demandeRestePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
