import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {ProductoService} from './producto.service';
import {ProductoEntity} from './producto.entity';
import {ProductoDto, ProductoUpdateDto} from './producto.dto';
import {BusinessErrorsInterceptor} from '../shared';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoService.findAll();
  }

  @Get(':productoId')
  async findOne(@Param('productoId') productoId: string): Promise<ProductoEntity> {
    return await this.productoService.findOne(productoId);
  }

  @Post()
  async create(@Body() productoDto: ProductoDto): Promise<ProductoEntity> {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.create(producto);
  }

  @Put(':productoId')
  async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoUpdateDto): Promise<ProductoEntity> {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.update(productoId, producto);
  }

  @Delete(':productoId')
  @HttpCode(204)
  async delete(@Param('productoId') productoId: string): Promise<void> {
    return await this.productoService.delete(productoId);
  }
}
