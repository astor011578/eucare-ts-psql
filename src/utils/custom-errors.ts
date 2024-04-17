export class CustomError extends Error {
  statusCode = 400;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getMessage(): string {
    return this.message;
  }

  getStatusCode(): number {
    return this.statusCode;
  }
}

/**
 * @description 處理前端有缺少必要輸入值的情況
 */
export class MissingFieldError extends CustomError {
  constructor(valueName: string, message = `Missing required field: ${valueName}`) {
    super(message, 400);
  }
}

/**
 * @description 處理前端輸入值格式錯誤的情況
 */
export class IncorrectFormatError extends CustomError {
  constructor(valueName: string, message = `Incorrect format field: ${valueName}`) {
    super(message, 400);
  }
}

/**
 * @description 處理查無資料的情況
 */
export class DataNotFoundError extends CustomError {
  constructor(value: string, message = `${value} data cannot be found`) {
    super(message, 404);
  }
}
