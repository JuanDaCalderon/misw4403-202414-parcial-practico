/**
 * Bussines logic Exception
 * @param {string} message Message of the error
 * @param {number} type Type of error
 */
export function BusinessLogicException(message: string, type: number): void {
  this.message = message;
  this.type = type;
}

/** BusinessError */
export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST
}
