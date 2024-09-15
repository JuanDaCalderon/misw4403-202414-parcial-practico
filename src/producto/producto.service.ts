import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {ProductoEntity} from './producto.entity';
import {BusinessError, BusinessLogicException, MESSAGES, PRODUCTOS_TYPE} from '../shared';

@Injectable()
export class ProductoService {
  private relations: string[] = ['tiendas'];

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly productoRepository: Repository<ProductoEntity>
  ) {}

  private typeValidation({tipo}: ProductoEntity): boolean {
    return Object.values(PRODUCTOS_TYPE).includes(tipo as PRODUCTOS_TYPE);
  }

  async findAll(): Promise<ProductoEntity[]> {
    return await this.productoRepository.find({relations: this.relations});
  }

  async findOne(id: string): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: this.relations});
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    return producto;
  }

  async create(producto: ProductoEntity): Promise<ProductoEntity> {
    if (!this.typeValidation(producto)) throw new BusinessLogicException(MESSAGES.PRODUCTOTYPEERROR, BusinessError.PRECONDITION_FAILED);
    return await this.productoRepository.save(producto);
  }

  async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
    const persistedProducto: ProductoEntity = await this.productoRepository.findOne({where: {id}});
    if (!persistedProducto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    if (!this.typeValidation(producto)) throw new BusinessLogicException(MESSAGES.PRODUCTOTYPEERROR, BusinessError.PRECONDITION_FAILED);
    return await this.productoRepository.save({...persistedProducto, ...producto});
  }

  async delete(id: string): Promise<void> {
    const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}});
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    await this.productoRepository.remove(producto);
  }
}
