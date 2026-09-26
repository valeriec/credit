import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private creditsService: CreditsService) {}

  @Get('approved')
  async findApprovedCredits() {
    return this.creditsService.findApprovedCredits();
  }

  @Get('search')
  async searchByIdentification(@Query('identification') identification: string) {
    return this.creditsService.searchByIdentification(identification);
  }

  @Get(':id/payments')
  async getPaymentSchedule(@Param('id') id: string) {
    return this.creditsService.getPaymentSchedule(+id);
  }
}
