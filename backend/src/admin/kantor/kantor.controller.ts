import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { AdminKantorService } from './kantor.service';
import { CreateKantorDto } from './dto/create-kantor.dto';
import { UpdateKantorDto } from './dto/update-kantor.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Roles(Role.ADMIN)
@Controller('kantor')
export class AdminKantorController {
  constructor(private readonly service: AdminKantorService) {}

  @Get()
  getKantor(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('keyword') keyword?: string,
  ) {
    return this.service.getKantor(Number(page), Number(limit), keyword);
  }

  @Get(':id')
  getKantorById(@Param('id', ParseIntPipe) id: number) {
    return this.service.getKantorById(id);
  }

  @Post()
  createKantor(@Body() dto: CreateKantorDto) {
    return this.service.createKantor(dto);
  }

  @Patch(':id')
  updateKantor(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateKantorDto) {
    return this.service.updateKantor(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteKantor(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteKantor(id);
  }
}
