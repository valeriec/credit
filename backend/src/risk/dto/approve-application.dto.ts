import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveApplicationDto {
  @IsString()
  @IsNotEmpty()
  observations: string;
}
