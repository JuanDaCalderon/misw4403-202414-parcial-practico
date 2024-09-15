/** Mensajes de error */
export enum MESSAGES {
  PRODUCTONOTFOUND = 'El producto con este id no fue encontrado',
  PRODUCTOTYPEERROR = "El tipo del producto debe ser 'perecedero' o 'no perecedero'",
  PRODUCTONOASSOCIATEDTIENDA = 'El producto con este id no esta asociado a esta tienda',

  TIENDANOTFOUND = 'La tienda con este id no fue encontrada',
  TIENDACITYERROR = 'La ciudad de la tienda debe ser una cadena de 3 caracteres en mayusculas',
  TIENDANOASSOCIATEDPRODUCT = 'La tienda con este id no esta asociada a este producto'
}
