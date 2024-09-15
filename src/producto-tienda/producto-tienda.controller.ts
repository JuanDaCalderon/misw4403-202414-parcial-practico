import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {ProductoTiendaService} from './producto-tienda.service';
import {TiendaEntity} from '../tienda/tienda.entity';
import {ProductoEntity} from '../producto/producto.entity';
import {TiendaDto} from '../tienda/tienda.dto';
import {BusinessErrorsInterceptor} from '../shared';

@Controller('products')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
  constructor(private readonly productoTiendaService: ProductoTiendaService) {}

  @Post(':productoId/stores/:tiendaId')
  async addStoreToProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string): Promise<ProductoEntity> {
    return await this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
  }

  @Get(':productoId/stores/:tiendaId')
  async findStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string): Promise<TiendaEntity> {
    return await this.productoTiendaService.findStoreFromProduct(productoId, tiendaId);
  }

  @Get(':productoId/stores')
  async findStoresFromProduct(@Param('productoId') productoId: string): Promise<TiendaEntity[]> {
    return await this.productoTiendaService.findStoresFromProduct(productoId);
  }

  @Put(':productoId/stores')
  async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string): Promise<ProductoEntity> {
    const tiendas = plainToInstance(TiendaEntity, tiendasDto);
    return await this.productoTiendaService.updateStoresFromProduct(productoId, tiendas);
  }

  @Delete(':productoId/stores/:tiendaId')
  @HttpCode(204)
  async deleteStoresFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string): Promise<void> {
    return await this.productoTiendaService.deleteStoreFromProduct(productoId, tiendaId);
  }
}
