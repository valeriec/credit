import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DisbursementsService } from './disbursements.service';
import { CreateDisbursementDto } from './dto/create-disbursement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/credits')
@UseGuards(JwtAuthGuard)
export class DisbursementsController {
  constructor(private disbursementsService: DisbursementsService) {}

  @Post(':id/disbursement')
  async createDisbursement(@Param('id') id: string, @Body() createDisbursementDto: CreateDisbursementDto) {
    return this.disbursementsService.createDisbursement(+id, createDisbursementDto);
  }
}
