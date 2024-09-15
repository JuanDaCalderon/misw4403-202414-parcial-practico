import {Test, TestingModule} from '@nestjs/testing';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
import {TiendaService} from './tienda.service';
import {TiendaEntity} from './tienda.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {MESSAGES, TypeOrmTestingConfig} from '../shared';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await repository.save({
        nombre: faker.lorem.word(),
        ciudad: faker.location.city(),
        direccion: faker.location.streetAddress(),
        productos: []
      } as TiendaEntity);
      tiendaList.push(tienda);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService]
    }).compile();
    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all tiendas', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendaList.length);
  });

  it('findOne should return a tienda by id', async () => {
    const storedTienda: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedTienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.nombre).toEqual(storedTienda.nombre);
  });

  it('findOne should throw an exception for an invalid tienda', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });

  it('create should return a new tienda', async () => {
    const tienda: TiendaEntity = {
      nombre: faker.lorem.word(),
      ciudad: 'BOG',
      direccion: faker.location.streetAddress(),
      productos: []
    } as TiendaEntity;
    const newTienda: TiendaEntity = await service.create(tienda);
    expect(newTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: {id: newTienda.id}
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(newTienda.nombre);
  });

  it('create should throw product type error', async () => {
    const tienda: TiendaEntity = {
      nombre: faker.lorem.word(),
      ciudad: faker.location.city(),
      direccion: faker.location.streetAddress(),
      productos: []
    } as TiendaEntity;
    await expect(() => service.create(tienda)).rejects.toHaveProperty('message', MESSAGES.TIENDACITYERROR);
  });

  it('update should modify a tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'New name';
    tienda.ciudad = 'BOG';
    const updatedTienda: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedTienda).not.toBeNull();
    const storedTienda: TiendaEntity = await repository.findOne({
      where: {id: tienda.id}
    });
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toEqual(tienda.nombre);
  });

  it('update should throw product type error', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.nombre = 'New name1';
    await expect(() => service.update(tienda.id, tienda)).rejects.toHaveProperty('message', MESSAGES.TIENDACITYERROR);
  });

  it('update should throw an exception for an invalid tienda', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda,
      nombre: 'New name'
    };
    await expect(() => service.update('0', tienda)).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });

  it('delete should remove a tienda', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
    const deletedCategoria: TiendaEntity = await repository.findOne({
      where: {id: tienda.id}
    });
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid tienda', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });
});
