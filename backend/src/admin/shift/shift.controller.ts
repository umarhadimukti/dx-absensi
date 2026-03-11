import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shift')
@UseGuards(JwtAuthGuard)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get()
  getShift(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    return this.shiftService.getShift(Number(page), Number(limit), search);
  }

  @Get(':id')
  getShiftById(@Param('id', ParseIntPipe) id: number) {
    return this.shiftService.getShiftById(id);
  }

  @Post()
  createShift(@Body() dto: CreateShiftDto) {
    return this.shiftService.createShift(dto);
  }

  @Patch(':id')
  updateShift(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateShiftDto) {
    return this.shiftService.updateShift(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteShift(@Param('id', ParseIntPipe) id: number) {
    return this.shiftService.deleteShift(id);
  }
}
