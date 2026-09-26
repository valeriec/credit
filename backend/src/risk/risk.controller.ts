import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RiskService } from './risk.service';
import { ApproveApplicationDto } from './dto/approve-application.dto';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/risk')
@UseGuards(JwtAuthGuard)
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Get('applications')
  async findPendingApplications() {
    return this.riskService.findPendingApplications();
  }

  @Post('applications/:id/approve')
  async approveApplication(@Param('id') id: string, @Body() approveDto: ApproveApplicationDto) {
    return this.riskService.approveApplication(+id, approveDto);
  }

  @Post('applications/:id/reject')
  async rejectApplication(@Param('id') id: string, @Body() rejectDto: RejectApplicationDto) {
    return this.riskService.rejectApplication(+id, rejectDto);
  }
}
