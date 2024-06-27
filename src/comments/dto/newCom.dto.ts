import { IsNotEmpty } from 'class-validator';
export class NewComDto {
  @IsNotEmpty()
  readonly content: string;
}
