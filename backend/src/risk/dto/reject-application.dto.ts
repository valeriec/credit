import { IsString, IsOptional } from 'class-validator';

export class RejectApplicationDto {
  @IsString()
  @IsOptional()
  observations?: string;
}
