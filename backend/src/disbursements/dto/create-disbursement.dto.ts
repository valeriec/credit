import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Bank } from '../../common/enums';

export class CreateDisbursementDto {
  @IsEnum(Bank)
  @IsNotEmpty()
  bank: Bank;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;
}
