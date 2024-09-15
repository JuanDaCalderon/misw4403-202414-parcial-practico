import {CallHandler, ExecutionContext, HttpException, HttpStatus} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {faker} from '@faker-js/faker';
import {throwError} from 'rxjs';
import {Repository} from 'typeorm';
import {BusinessError, BusinessErrorsInterceptor, PRODUCTOS_TYPE, TypeOrmTestingConfig} from '../shared';
import {ProductoController} from './producto.controller';
import {ProductoService} from './producto.service';
import {ProductoEntity} from './producto.entity';

describe('producto controller', () => {
  let controller: ProductoController;
  let repository: Repository<ProductoEntity>;
  let productosList: ProductoEntity[];
  let interceptor: BusinessErrorsInterceptor;
  const productoMock: ProductoEntity = {
    nombre: faker.lorem.word(),
    precio: faker.commerce.price(),
    tipo: PRODUCTOS_TYPE.PERECEDERO,
    tiendas: []
  } as ProductoEntity;

  const seedDatabase = async () => {
    repository.clear();
    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await repository.save({...productoMock} as ProductoEntity);
      productosList.push(producto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService, BusinessErrorsInterceptor],
      controllers: [ProductoController]
    }).compile();
    controller = module.get<ProductoController>(ProductoController);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    interceptor = module.get<BusinessErrorsInterceptor>(BusinessErrorsInterceptor);
    await seedDatabase();
  });

  describe('controller', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should return all producto', async () => {
      const productos: ProductoEntity[] = await controller.findAll();
      expect(productos.length).toBe(productosList.length);
    });

    it('should return the first producto', async () => {
      const producto: ProductoEntity = await controller.findOne(productosList[0].id);
      expect(producto.nombre).toBe(productosList[0].nombre);
    });

    it('should create a producto', async () => {
      const producto: ProductoEntity = {...productoMock} as ProductoEntity;
      const productoCreated: ProductoEntity = await controller.create(producto);
      expect(productoCreated).not.toBeNull();
    });

    it('should update the first producto', async () => {
      const producto: ProductoEntity = {...productoMock, nombre: 'new producto name'} as ProductoEntity;
      const productoUpdate: ProductoEntity = await controller.update(productosList[0].id, producto);
      expect(productoUpdate.nombre).toBe(producto.nombre);
    });

    it('should delete a producto', async () => {
      await controller.delete(productosList[0].id);
      const productos: ProductoEntity[] = await controller.findAll();
      expect(productos.length).toBe(4);
    });
  });

  describe('interceptor', () => {
    it('should be defined', () => {
      expect(interceptor).toBeDefined();
    });

    it('should handle BusinessError.NOT_FOUND correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.NOT_FOUND, message: 'Resource not found'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.NOT_FOUND);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.PRECONDITION_FAILED correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.PRECONDITION_FAILED, message: 'Precondition failed'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.PRECONDITION_FAILED);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should handle BusinessError.BAD_REQUEST correctly', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: BusinessError.BAD_REQUEST, message: 'Bad request'};
      const callHandler: CallHandler = {handle: () => throwError(() => error)};
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(HttpException);
          expect(err.getStatus()).toBe(HttpStatus.BAD_REQUEST);
          expect(err.message).toBe(error.message);
        }
      });
    });

    it('should rethrow unexpected errors', () => {
      const executionContext: ExecutionContext = {} as ExecutionContext;
      const error = {type: 'UNKNOWN_ERROR', message: 'Unknown error'};
      const callHandler: CallHandler = {
        handle: () => throwError(() => error)
      };
      interceptor.intercept(executionContext, callHandler).subscribe({
        error: (err) => {
          expect(err).toEqual(error);
        }
      });
    });
  });
});
