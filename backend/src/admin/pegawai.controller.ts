import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { AssignShiftPegawaiDto } from './dto/assign-shift-pegawai.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'generated/prisma/enums';

@Roles(Role.ADMIN)
@Controller('pegawai')
export class PegawaiController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @Roles(Role.ADMIN, Role.HR)
  getPegawai(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.adminService.getPegawai(Number(page), Number(limit), search);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.HR)
  getPegawaiById(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getPegawaiById(id);
  }

  @Post()
  createPegawai(@Body() dto: CreatePegawaiDto) {
    return this.adminService.createPegawai(dto);
  }

  @Patch(':id')
  updatePegawai(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePegawaiDto) {
    return this.adminService.updatePegawai(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deletePegawai(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.deletePegawai(id);
  }

  @Get(':id/shift')
  @Roles(Role.ADMIN, Role.HR)
  getShiftPegawai(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getShiftPegawai(id);
  }

  @Post(':id/assign-shift')
  @Roles(Role.ADMIN, Role.HR)
  assignShiftPegawai(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignShiftPegawaiDto) {
    return this.adminService.assignShiftPegawai(id, dto);
  }
}
