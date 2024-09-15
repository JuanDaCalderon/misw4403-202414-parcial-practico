import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
import {ENTITIES, MODULES} from './shared';
import {AppController} from './app.controller';
import { ProductoTiendaModule } from './producto-tienda/producto-tienda.module';

@Module({
  imports: [
    ...MODULES,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: '123456',
      database: 'postgres',
      entities: ENTITIES,
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    ProductoTiendaModule
  ],
  controllers: [AppController]
})
export class AppModule {}
