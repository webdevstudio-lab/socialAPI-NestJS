import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
