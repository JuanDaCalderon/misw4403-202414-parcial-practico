import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {ProductoEntity} from '../producto/producto.entity';
import {TiendaEntity} from '../tienda/tienda.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

@Injectable()
export class ProductoTiendaService {
  private relations: string[] = ['tiendas'];

  constructor(
    @InjectRepository(ProductoEntity)
    private readonly ProductoRepository: Repository<ProductoEntity>,
    @InjectRepository(TiendaEntity)
    private readonly TiendaRepository: Repository<TiendaEntity>
  ) {}

  async addStoreToProduct(ProductoId: string, TiendaId: string): Promise<ProductoEntity> {
    const tienda: TiendaEntity = await this.TiendaRepository.findOne({where: {id: TiendaId}});
    if (!tienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: {id: ProductoId},
      relations: this.relations
    });
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    producto.tiendas = [...producto.tiendas, tienda];
    return await this.ProductoRepository.save(producto);
  }

  async findStoreFromProduct(ProductoId: string, TiendaId: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.TiendaRepository.findOne({where: {id: TiendaId}});
    if (!tienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: {id: ProductoId},
      relations: this.relations
    });
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    const tiendaProducto: TiendaEntity = producto.tiendas.find((e) => e.id === tienda.id);
    if (!tiendaProducto) throw new BusinessLogicException(MESSAGES.TIENDANOASSOCIATEDPRODUCT, BusinessError.PRECONDITION_FAILED);
    return tiendaProducto;
  }

  async findStoresFromProduct(ProductoId: string): Promise<TiendaEntity[]> {
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: {id: ProductoId},
      relations: this.relations
    });
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    return producto.tiendas;
  }

  async updateStoresFromProduct(ProductoId: string, tiendas: TiendaEntity[]): Promise<ProductoEntity> {
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: {id: ProductoId},
      relations: this.relations
    });
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    for (const tienda of tiendas) {
      const thisTienda: TiendaEntity = await this.TiendaRepository.findOne({where: {id: tienda.id}});
      if (!thisTienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    }
    producto.tiendas = tiendas;
    return await this.ProductoRepository.save(producto);
  }

  async deleteStoreFromProduct(ProductoId: string, TiendaId: string): Promise<void> {
    const tienda: TiendaEntity = await this.TiendaRepository.findOne({where: {id: TiendaId}});
    if (!tienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    const producto: ProductoEntity = await this.ProductoRepository.findOne({
      where: {id: ProductoId},
      relations: this.relations
    });
    if (!producto) throw new BusinessLogicException(MESSAGES.PRODUCTONOTFOUND, BusinessError.NOT_FOUND);
    const tiendaProducto: TiendaEntity = producto.tiendas.find((e) => e.id === tienda.id);
    if (!tiendaProducto) throw new BusinessLogicException(MESSAGES.TIENDANOASSOCIATEDPRODUCT, BusinessError.PRECONDITION_FAILED);
    producto.tiendas = producto.tiendas.filter((e) => e.id !== TiendaId);
    await this.ProductoRepository.save(producto);
  }
}
