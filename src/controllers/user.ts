import { Request, Response } from "express";
import { CustomError, DataNotFoundError } from "../utils/custom-errors";
import { checkMissingFields, checkPhoneNumber } from "../utils/check-fields";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    /**
     * 1. 檢查是否有缺少欄位
     */
    checkMissingFields('username (phone number)', username);
    checkMissingFields('password', password);

    /**
     * 2. 檢查手機號碼的格式是否正確
     */
    checkPhoneNumber(username);

    /**
     * 3. 欄位檢查正確，準備新增一筆使用者資料
     */
    const user = new User();
    user.phone_number = username;
    user.password = password;
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save(user);

    res.status(200).json({
      message: `The phone number ${username} signed up successfully`
    });

  } catch (err: any) {
    const isMissingField = err?.name === 'MissingFieldError';
    const isIncorrectFormat = err?.name === 'IncorrectFormatError';
    const isDuplicateUser = err?.message.indexOf('duplicate') !== -1;

    /**
     * 1. 如果有必要欄位未輸入, 或是手機號碼欄位格式錯誤
    */
    const { message, statusCode } = err;
    if (isMissingField || isIncorrectFormat) res.status(statusCode).json({ message });

    /**
     * 2. 如果手機號碼已經被註冊過
     */
    if (isDuplicateUser) {
      res.status(409).json({
        message: `The phone number ${username} is already taken`
      });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    /**
     * 1. 檢查是否有缺少欄位
     */
    checkMissingFields('username (phone number)', username);
    checkMissingFields('password', password);

    /**
     * 2. 檢查手機號碼的格式是否正確
     */
    checkPhoneNumber(username);

    /**
     * 3. 檢查使用者手機號碼是否尚未被註冊
     */
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { phone_number: username } });
    if (!user) throw new DataNotFoundError(username);

    /**
     * 4. 檢查使用者密碼是否正確
     */
    const isCorrectPassword = user.password === password;
    if (!isCorrectPassword) throw new CustomError(`Incorrect username (phone number) or password`, 401);

    /**
     * 5. 以上驗證皆通過
     */
    res.status(200).json({ message: `User ${username} login successully` });

  } catch (err: any) {
    console.log(err.name);
    const isMissingField = err?.name === 'MissingFieldError';
    const isIncorrectFormat = err?.name === 'IncorrectFormatError';
    const isNonSignedUp = err?.name === 'DataNotFoundError';
    const isIncorrectPassword = err?.name === 'CustomError';

    /**
     * 1. 如果有必要欄位未輸入, 或是手機號碼欄位格式錯誤
    */
    const { message, statusCode } = err;
    if (isMissingField || isIncorrectFormat) res.status(statusCode).json({ message });

    /**
     * 2. 如果是尚未被註冊的手機號碼
     */
    if (isNonSignedUp) {
      res.status(statusCode).json({
        message: `The phone number ${username} has not been signed up`
      });
    }

    /**
     * 3. 如果密碼輸入錯誤
     */
    if (isIncorrectPassword) {
      res.status(statusCode).json({ message });
    }
  }
};
