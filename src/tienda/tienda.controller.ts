import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {TiendaService} from './tienda.service';
import {TiendaEntity} from './tienda.entity';
import {TiendaDto, TiendaUpdateDto} from './tienda.dto';
import {BusinessErrorsInterceptor} from '../shared';

@Controller('stores')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
  constructor(private readonly tiendaService: TiendaService) {}

  @Get()
  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaService.findAll();
  }

  @Get(':tiendaId')
  async findOne(@Param('tiendaId') tiendaId: string): Promise<TiendaEntity> {
    return await this.tiendaService.findOne(tiendaId);
  }

  @Post()
  async create(@Body() tiendaDto: TiendaDto): Promise<TiendaEntity> {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.create(tienda);
  }

  @Put(':tiendaId')
  async update(@Param('tiendaId') tiendaId: string, @Body() tiendaDto: TiendaUpdateDto): Promise<TiendaEntity> {
    const tienda: TiendaEntity = plainToInstance(TiendaEntity, tiendaDto);
    return await this.tiendaService.update(tiendaId, tienda);
  }

  @Delete(':tiendaId')
  @HttpCode(204)
  async delete(@Param('tiendaId') tiendaId: string): Promise<void> {
    return await this.tiendaService.delete(tiendaId);
  }
}
