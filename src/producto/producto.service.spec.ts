import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {ProductoService} from './producto.service';
import {Repository} from 'typeorm';
import {ProductoEntity} from './producto.entity';
import {TypeOrmTestingConfig, MESSAGES, PRODUCTOS_TYPE} from '../shared';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({
        nombre: faker.lorem.word(),
        precio: faker.commerce.price(),
        tipo: faker.lorem.word(),
        tiendas: []
      } as ProductoEntity);
      productoList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService]
    }).compile();
    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productoList.length);
  });

  it('findOne should return a producto by id', async () => {
    const storedProducto: ProductoEntity = productoList[0];
    const producto: ProductoEntity = await service.findOne(storedProducto.id);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(storedProducto.nombre);
  });

  it('findOne should throw an exception for an invalid producto', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('create should return a new producto', async () => {
    const producto: ProductoEntity = {
      nombre: faker.lorem.word(),
      precio: faker.commerce.price(),
      tipo: PRODUCTOS_TYPE.PERECEDERO,
      tiendas: []
    } as ProductoEntity;
    const newProducto: ProductoEntity = await service.create(producto);
    expect(newProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({
      where: {id: newProducto.id}
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(newProducto.nombre);
  });

  it('create should throw product type error', async () => {
    const producto: ProductoEntity = {
      nombre: faker.lorem.word(),
      precio: faker.commerce.price(),
      tipo: 'Otro tipo',
      tiendas: []
    } as ProductoEntity;
    await expect(() => service.create(producto)).rejects.toHaveProperty('message', MESSAGES.PRODUCTOTYPEERROR);
  });

  it('update should modify a producto', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'New name';
    producto.tipo = PRODUCTOS_TYPE.NOPERECEDERO;
    const updatedProducto: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProducto).not.toBeNull();
    const storedProducto: ProductoEntity = await repository.findOne({
      where: {id: producto.id}
    });
    expect(storedProducto).not.toBeNull();
    expect(storedProducto.nombre).toEqual(producto.nombre);
  });

  it('update should throw product type error', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.nombre = 'New name1';
    await expect(() => service.update(producto.id, producto)).rejects.toHaveProperty('message', MESSAGES.PRODUCTOTYPEERROR);
  });

  it('update should throw an exception for an invalid producto', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto,
      nombre: 'New name'
    };
    await expect(() => service.update('0', producto)).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });

  it('delete should remove a producto', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
    const deletedCategoria: ProductoEntity = await repository.findOne({
      where: {id: producto.id}
    });
    expect(deletedCategoria).toBeNull();
  });

  it('delete should throw an exception for an invalid producto', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty('message', MESSAGES.PRODUCTONOTFOUND);
  });
});
