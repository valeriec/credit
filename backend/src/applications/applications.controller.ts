import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../common/interfaces';

@Controller('api/applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  async create(@Body() createApplicationDto: CreateApplicationDto, @CurrentUser() user: JwtPayload) {
    return this.applicationsService.create(createApplicationDto, user.userId);
  }

  @Get()
  async findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(+id);
  }
}
