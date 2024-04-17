import { MissingFieldError, IncorrectFormatError } from "./custom-errors";

/**
 * @description 檢查是否有缺少欄位
 * @param fieldName 欄位名稱
 * @param fieldValue 欄位值
 */
export const checkMissingFields = (fieldName: string, fieldValue: string | Date) => {
  switch (typeof fieldValue) {
    case "string": {
      if (!fieldValue || !fieldValue.trim().length) throw new MissingFieldError(fieldName);
      return true;
    }
    default: {
      if (!fieldValue) throw new MissingFieldError(fieldName);
      return true;
    }
  }
};

/**
 * @description 檢查手機號碼的格式是否正確
 * @param value 手機號碼的值
 */
export const checkPhoneNumber = (value: string) => {
  const phoneReg = /^(09)[0-9]{8}$/;
  const isCorrectPhone = (value.match(phoneReg)) ? true : false;
  if (!isCorrectPhone) throw new IncorrectFormatError('username (phone number)');
};

/**
 * @description 檢查身分證字號的格式是否正確
 * @param value 身份證字號的值
 */
export const checkIdCardNumber = (value: string) => {
  const idNumberRegex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
  const isValidIdNumber = idNumberRegex.test(value);
  if (!isValidIdNumber) throw new IncorrectFormatError("patient's id card number");
};
