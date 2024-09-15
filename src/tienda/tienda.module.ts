import {Module} from '@nestjs/common';
import {TiendaService} from './tienda.service';
import {TiendaEntity} from './tienda.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TiendaEntity])],
  providers: [TiendaService]
})
export class TiendaModule {}
