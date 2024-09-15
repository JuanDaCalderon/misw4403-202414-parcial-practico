import {IsNotEmpty, IsString, MinLength, IsOptional} from 'class-validator';
/** DTO for create Tienda entitie */
export class TiendaDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly direccion: string;
}
/** DTO for update Tienda entitie */
export class TiendaUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly ciudad: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly direccion: string;
}
