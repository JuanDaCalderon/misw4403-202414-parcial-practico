import {Module} from '@nestjs/common';
import {ProductoTiendaService} from './producto-tienda.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductoEntity} from '../producto/producto.entity';
import {TiendaEntity} from '../tienda/tienda.entity';
import {ProductoService} from '../producto/producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, TiendaEntity])],
  providers: [ProductoService, ProductoTiendaService]
})
export class ProductoTiendaModule {}
