/* Global imports */
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
/* producto-tienda imports */
import {ProductoTiendaController} from './producto-tienda.controller';
import {ProductoTiendaService} from './producto-tienda.service';
import {TiendaEntity} from '../tienda/tienda.entity';
import {ProductoEntity} from '../producto/producto.entity';
import {TiendaDto} from '../tienda/tienda.dto';
import {PRODUCTOS_TYPE, TypeOrmTestingConfig} from '../shared';

describe('ProductoTiendaController', () => {
  let controller: ProductoTiendaController;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let productosList: ProductoEntity[];
  let tiendasList: TiendaEntity[];

  const tiendaMock: TiendaEntity = {
    nombre: faker.lorem.word(),
    ciudad: 'BOG',
    direccion: faker.location.streetAddress(),
    productos: []
  } as TiendaEntity;

  const productoMock: ProductoEntity = {
    nombre: faker.lorem.word(),
    precio: faker.commerce.price(),
    tipo: PRODUCTOS_TYPE.NOPERECEDERO,
    tiendas: tiendasList
  } as ProductoEntity;

  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();
    tiendasList = [];
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await tiendaRepository.save({
        ...tiendaMock
      } as TiendaEntity);
      tiendasList.push(tienda);
    }
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        ...productoMock,
        tiendas: []
      } as ProductoEntity);
      productosList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
      controllers: [ProductoTiendaController]
    }).compile();
    controller = module.get<ProductoTiendaController>(ProductoTiendaController);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a tienda to producto', async () => {
    const productoId: string = productosList[0].id;
    const tiendaId: string = tiendasList[0].id;
    const producto: ProductoEntity = await controller.addStoreToProduct(productoId, tiendaId);
    expect(producto.tiendas.length).toBe(1);
  });

  it('should get a tienda of producto', async () => {
    const productoId: string = productosList[0].id;
    const tiendaId: string = tiendasList[0].id;
    await controller.addStoreToProduct(productoId, tiendaId);
    const tienda: TiendaEntity = await controller.findStoreFromProduct(productoId, tiendaId);
    expect(tienda.id).toBe(tiendaId);
  });

  it('should get all the tiendas of producto', async () => {
    const productoId: string = productosList[0].id;
    await controller.addStoreToProduct(productoId, tiendasList[0].id);
    await controller.addStoreToProduct(productoId, tiendasList[1].id);
    const tiendas: TiendaEntity[] = await controller.findStoresFromProduct(productoId);
    expect(tiendas.length).toBe(2);
  });

  it('should update the tiendas of producto', async () => {
    const tiendasDto: TiendaDto[] = [{...tiendasList[2]}];
    const productoId: string = productosList[0].id;
    await controller.addStoreToProduct(productoId, tiendasList[0].id);
    await controller.addStoreToProduct(productoId, tiendasList[1].id);
    const producto: ProductoEntity = await controller.updateStoresFromProduct(tiendasDto, productoId);
    expect(producto.tiendas.length).toBe(1);
    expect(producto.tiendas[0].id).toBe(tiendasList[2].id);
  });

  it('should delete a tienda of producto', async () => {
    const productoId: string = productosList[0].id;
    const tiendaId: string = tiendasList[0].id;
    await controller.addStoreToProduct(productoId, tiendasList[0].id);
    await controller.addStoreToProduct(productoId, tiendasList[1].id);
    await controller.addStoreToProduct(productoId, tiendasList[2].id);
    await controller.deleteStoresFromProduct(productoId, tiendaId);
    const tiendas: TiendaEntity[] = await controller.findStoresFromProduct(productoId);
    expect(tiendas.length).toBe(2);
  });
});
