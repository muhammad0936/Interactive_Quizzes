import { ErrorCode } from '../enums/error-code.enum';

export class ApplicationException extends Error {
  constructor(
    public code: ErrorCode,
    message?: string,
  ) {
    super(message);
  }
}
