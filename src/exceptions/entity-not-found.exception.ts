import { ErrorCode } from '../enums/error-code.enum';
import { ApplicationException } from './application.exception';

export class EntityNotFoundException extends ApplicationException {
  constructor(message: string = 'Entity not found') {
    super(ErrorCode.ENTITY_NOT_FOUND, message);
  }
}
