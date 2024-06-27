import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class NewComDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly content: string;
}
