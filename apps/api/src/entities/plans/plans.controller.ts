import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { SearchPlanDto } from './dto/search-plan.dto';
import { Plan } from './entities/plan.entity';

@ApiTags('plans')
@ApiBearerAuth()
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({ summary: 'Создать тариф' })
  @ApiOkResponse({ type: Plan })
  async create(@Body() createPlanDto: CreatePlanDto) {
    return await this.plansService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список тарифов' })
  @ApiOkResponse({ type: Plan, isArray: true })
  async findAll(@Query() dto?: SearchPlanDto) {
    return await this.plansService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Тариф по id' })
  @ApiOkResponse({ type: Plan })
  async findOne(@Param('id') id: string) {
    return await this.plansService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить тариф' })
  @ApiOkResponse({ type: Plan })
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return await this.plansService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить тариф' })
  async remove(@Param('id') id: string) {
    return await this.plansService.remove(+id);
  }
}
