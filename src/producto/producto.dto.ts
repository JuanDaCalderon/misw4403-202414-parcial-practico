import {IsNotEmpty, IsString, MinLength, IsOptional} from 'class-validator';
/** DTO for create producto entitie */
export class ProductoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly precio: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  readonly tipo: string;
}
/** DTO for update producto entitie */
export class ProductoUpdateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly precio: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @IsOptional()
  readonly tipo: string;
}
