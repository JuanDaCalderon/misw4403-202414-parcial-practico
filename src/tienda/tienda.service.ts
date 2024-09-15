import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {TiendaEntity} from './tienda.entity';
import {BusinessError, BusinessLogicException, MESSAGES} from '../shared';

@Injectable()
export class TiendaService {
  private relations: string[] = ['productos'];

  constructor(
    @InjectRepository(TiendaEntity)
    private readonly tiendaRepository: Repository<TiendaEntity>
  ) {}

  private cityValidation({ciudad}: TiendaEntity): boolean {
    const regexp: RegExp = new RegExp('^[A-Z]{3,3}$');
    return regexp.test(ciudad);
  }

  async findAll(): Promise<TiendaEntity[]> {
    return await this.tiendaRepository.find({relations: this.relations});
  }

  async findOne(id: string): Promise<TiendaEntity> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: this.relations});
    if (!tienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    return tienda;
  }

  async create(tienda: TiendaEntity): Promise<TiendaEntity> {
    if (!this.cityValidation(tienda)) throw new BusinessLogicException(MESSAGES.TIENDACITYERROR, BusinessError.PRECONDITION_FAILED);
    return await this.tiendaRepository.save(tienda);
  }

  async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
    const persistedTienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
    if (!persistedTienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    if (!this.cityValidation(tienda)) throw new BusinessLogicException(MESSAGES.TIENDACITYERROR, BusinessError.PRECONDITION_FAILED);
    return await this.tiendaRepository.save({...persistedTienda, ...tienda});
  }

  async delete(id: string): Promise<void> {
    const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
    if (!tienda) throw new BusinessLogicException(MESSAGES.TIENDANOTFOUND, BusinessError.NOT_FOUND);
    await this.tiendaRepository.remove(tienda);
  }
}
