import {TypeOrmModule} from '@nestjs/typeorm';
import {ENTITIES} from '../constants';

/** TypeOrmTestingConfig en sqlite */
export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ENTITIES,
    synchronize: true,
    keepConnectionAlive: true
  }),
  TypeOrmModule.forFeature(ENTITIES)
];
