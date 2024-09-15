import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
import {BusinessErrorsInterceptor, TypeOrmTestingConfig} from '../shared';
import {TiendaController} from './tienda.controller';
import {TiendaService} from './tienda.service';
import {TiendaEntity} from './tienda.entity';

describe('tienda controller', () => {
  let controller: TiendaController;
  let repository: Repository<TiendaEntity>;
  let tiendasList: TiendaEntity[];
  const tiendaMock: TiendaEntity = {
    nombre: faker.lorem.word(),
    ciudad: 'BOG',
    direccion: faker.location.streetAddress(),
    productos: []
  } as TiendaEntity;

  const seedDatabase = async () => {
    repository.clear();
    tiendasList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({...tiendaMock} as TiendaEntity);
      tiendasList.push(tienda);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService, BusinessErrorsInterceptor],
      controllers: [TiendaController]
    }).compile();
    controller = module.get<TiendaController>(TiendaController);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await controller.findAll();
    expect(tiendas.length).toBe(tiendasList.length);
  });

  it('should return the first tienda', async () => {
    const tienda: TiendaEntity = await controller.findOne(tiendasList[0].id);
    expect(tienda.nombre).toBe(tiendasList[0].nombre);
  });

  it('should create a tienda', async () => {
    const tienda: TiendaEntity = {...tiendaMock} as TiendaEntity;
    const tiendaCreated: TiendaEntity = await controller.create(tienda);
    expect(tiendaCreated).not.toBeNull();
  });

  it('should update the first tienda', async () => {
    const tienda: TiendaEntity = {...tiendaMock, nombre: 'new tienda name'} as TiendaEntity;
    const tiendaUpdate: TiendaEntity = await controller.update(tiendasList[0].id, tienda);
    expect(tiendaUpdate.nombre).toBe(tienda.nombre);
  });

  it('should delete a tienda', async () => {
    await controller.delete(tiendasList[0].id);
    const tiendas: TiendaEntity[] = await controller.findAll();
    expect(tiendas.length).toBe(4);
  });
});
