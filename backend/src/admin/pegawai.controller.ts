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
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreatePegawaiDto } from './dto/create-pegawai.dto';
import { UpdatePegawaiDto } from './dto/update-pegawai.dto';
import { AssignShiftPegawaiDto } from './dto/assign-shift-pegawai.dto';

@Controller('pegawai')
@UseGuards(JwtAuthGuard)
export class PegawaiController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  getPegawai(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.adminService.getPegawai(Number(page), Number(limit), search);
  }

  @Get(':id')
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
  getShiftPegawai(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.getShiftPegawai(id);
  }

  @Post(':id/assign-shift')
  assignShiftPegawai(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignShiftPegawaiDto) {
    return this.adminService.assignShiftPegawai(id, dto);
  }
}
