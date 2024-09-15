import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {Repository} from 'typeorm';
import {ProductoTiendaService} from './producto-tienda.service';
import {TypeOrmTestingConfig, PRODUCTOS_TYPE, MESSAGES} from '../shared';
import {TiendaEntity} from '../tienda/tienda.entity';
import {ProductoEntity} from '../producto/producto.entity';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let ProductoRepository: Repository<ProductoEntity>;
  let TiendaRepository: Repository<TiendaEntity>;
  let Producto: ProductoEntity;
  let TiendaList: TiendaEntity[];

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
    tiendas: TiendaList
  } as ProductoEntity;

  const seedDatabase = async () => {
    TiendaRepository.clear();
    ProductoRepository.clear();
    TiendaList = [];
    for (let i = 0; i < 5; i++) {
      const tienda: TiendaEntity = await TiendaRepository.save({
        nombre: faker.lorem.word(),
        ciudad: faker.location.city(),
        direccion: faker.location.streetAddress(),
        productos: []
      } as TiendaEntity);
      TiendaList.push(tienda);
    }
    Producto = await ProductoRepository.save({
      nombre: faker.lorem.word(),
      precio: faker.commerce.price(),
      tipo: faker.lorem.word(),
      tiendas: TiendaList
    } as ProductoEntity);
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService]
    }).compile();
    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    ProductoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    TiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add a Tienda to a Producto', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({
      ...tiendaMock
    } as TiendaEntity);
    const newProducto: ProductoEntity = await ProductoRepository.save({
      ...productoMock,
      tiendas: TiendaList
    });
    const result: ProductoEntity = await service.addStoreToProduct(newProducto.id, newTienda.id);
    expect(result.tiendas.length).toBe(6);
    expect(result.tiendas[5]).not.toBeNull();
    expect(result.tiendas[5].nombre).toBe(newTienda.nombre);
  });

  it('addStoreToProduct should thrown exception for an invalid Tienda', async () => {
    const newProducto: ProductoEntity = await ProductoRepository.save({
      ...productoMock
    } as ProductoEntity);
    await expect(() => service.addStoreToProduct(newProducto.id, '0')).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });

  it('addStoreToProduct should throw an exception for an invalid Producto', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({
      ...tiendaMock
    } as TiendaEntity);
    await expect(() => service.addStoreToProduct('0', newTienda.id)).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('findStoreFromProduct should return tienda by Producto', async () => {
    const tienda: TiendaEntity = TiendaList[0];
    const storedTienda: TiendaEntity = await service.findStoreFromProduct(Producto.id, tienda.id);
    expect(storedTienda).not.toBeNull();
    expect(storedTienda.nombre).toBe(tienda.nombre);
  });

  it('findStoreFromProduct should throw an exception for an invalid Tienda', async () => {
    await expect(() => service.findStoreFromProduct(Producto.id, '0')).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });

  it('findStoreFromProduct should throw an exception for an invalid Producto', async () => {
    const tienda: TiendaEntity = TiendaList[0];
    await expect(() => service.findStoreFromProduct('0', tienda.id)).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('findStoreFromProduct should throw an exception for an Tienda not associated to the Producto', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({
      ...tiendaMock
    });
    await expect(() => service.findStoreFromProduct(Producto.id, newTienda.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.TIENDANOASSOCIATEDPRODUCT
    );
  });

  it('findStoresFromProduct should return Tiendas by Producto', async () => {
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(Producto.id);
    expect(tiendas.length).toBe(5);
  });

  it('findStoresFromProduct should throw an exception for an invalid Producto', async () => {
    await expect(() => service.findStoresFromProduct('0')).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('updateStoresFromProduct should update Tiendas list for a Producto', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({...tiendaMock});
    const updatedProducto: ProductoEntity = await service.updateStoresFromProduct(Producto.id, [newTienda]);
    expect(updatedProducto.tiendas.length).toBe(1);
    expect(updatedProducto.tiendas[0].nombre).toBe(newTienda.nombre);
  });

  it('updateStoresFromProduct should throw an exception for an invalid Producto', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({...tiendaMock});
    await expect(() => service.updateStoresFromProduct('0', [newTienda])).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('updateStoresFromProduct should throw an exception for an invalid Tienda', async () => {
    const newTienda: TiendaEntity = TiendaList[0];
    newTienda.id = '0';
    await expect(() => service.updateStoresFromProduct(Producto.id, [newTienda])).rejects.toHaveProperty(
      'message',
      MESSAGES.TIENDANOTFOUND
    );
  });

  it('deleteStoreFromProduct should remove an Tienda from a Producto', async () => {
    const Tienda: TiendaEntity = TiendaList[0];
    await service.deleteStoreFromProduct(Producto.id, Tienda.id);
    const storedProducto: ProductoEntity = await ProductoRepository.findOne({
      where: {id: Producto.id},
      relations: ['tiendas']
    });
    const deletedTienda: TiendaEntity = storedProducto.tiendas.find((a) => a.id === Tienda.id);
    expect(deletedTienda).toBeUndefined();
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid Tienda', async () => {
    await expect(() => service.deleteStoreFromProduct(Producto.id, '0')).rejects.toHaveProperty('message', MESSAGES.TIENDANOTFOUND);
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid Producto', async () => {
    const Tienda: TiendaEntity = TiendaList[0];
    await expect(() => service.deleteStoreFromProduct('0', Tienda.id)).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated Tienda', async () => {
    const newTienda: TiendaEntity = await TiendaRepository.save({...tiendaMock});
    await expect(() => service.deleteStoreFromProduct(Producto.id, newTienda.id)).rejects.toHaveProperty(
      'message',
      MESSAGES.TIENDANOASSOCIATEDPRODUCT
    );
  });
});
