import { Request, Response } from "express";
import { CustomError, MissingFieldError, IncorrectFormatError, DataNotFoundError } from "../utils/custom-errors";
import { AppDataSource } from "../data-source";
import { Patient } from "../entities/patient.entity";
import { User } from "../entities/user.entity";

export const getPatients = async (req: Request, res: Response): Promise<void> => {
  const username = req.params.username.trim();

  try {
    /**
     * 1. 檢查是否有缺少欄位
     */
    checkMissingFields('username', username);

    /**
     * 2. 檢查手機號碼的格式是否正確
     */
    const phoneReg = /^(09)[0-9]{8}$/;
    const isCorrectPhone = (username.match(phoneReg)) ? true : false;
    if (!isCorrectPhone) throw new IncorrectFormatError('username (phone number)');

    /**
     * 3. 查詢此會員的 id
     */
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { phone_number: username } });
    if (!user) throw new DataNotFoundError(username);

    /**
     * 4. 查詢登記於此使用者名下之所有病患資料
     */
    const patientRepo = AppDataSource.getRepository(Patient);
    const patients = await patientRepo.find({ where: { user_id: user.id } });

    res.status(200).json({
      message: `Get patients data successfully, totally ${patients.length} data`,
      data: patients
    });

  } catch (err: any) {
    const { statusCode, message } = err;
    res.status(statusCode).json({ message });
  }
};

export const addPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * 1. 檢查是否有缺少欄位
     */
    const fieldNames = ["username", "patientName", "patientIdNumber", "patientBirthDate", "patientAddress"];
    for (const fieldName of fieldNames) {
      checkMissingFields(fieldName, req.body[fieldName]);
    }

    const { username, patientName, patientIdNumber, patientBirthDate, patientAddress } = req.body;

    /**
     * 2. 檢查病患身分證字號格式
     */
    const idNumberRegex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
    const isValidIdNumber = idNumberRegex.test(patientIdNumber);
    if (!isValidIdNumber) throw new IncorrectFormatError("patient's id card number");

    const patientRepo = AppDataSource.getRepository(Patient);
    const userRepo = AppDataSource.getRepository(User);

    /**
     * 3. 查詢病患資料是否已存在
     */
    const existingPatient = await patientRepo.findOne({ where: { identity_number: patientIdNumber } });
    if (existingPatient) throw new CustomError(`The patient data has been created, id card number: ${patientIdNumber}`, 400);

    /**
     * 4. 查詢使用者資料
     */
    const user = await userRepo.findOne({ where: { phone_number: username } });
    if (!user) throw new DataNotFoundError(username);

    /**
     * 5. 新增一筆病患資料
     */
    const patient = new Patient();
    patient.name = patientName;
    patient.identity_number = patientIdNumber;
    patient.birth_date = new Date(patientBirthDate);
    patient.address = patientAddress;
    patient.user = { id: user.id } as any;
    await patientRepo.save(patient);

    res.status(200).json({
      message: `Adding a patient data (${patientName}) successfully`
    });

  } catch (err: any) {
    const { message, statusCode } = err;
    res.status(statusCode).json({ message });
  }
};

/**
 * @description 檢查是否有缺少欄位
 * @param fieldName 欄位名稱
 * @param fieldValue 欄位值
 */
const checkMissingFields = (fieldName: string, fieldValue: string | Date) => {
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
