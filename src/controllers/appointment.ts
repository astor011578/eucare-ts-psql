import { Request, Response } from "express";
import { CustomError, DataNotFoundError } from "../utils/custom-errors";
import { checkMissingFields, checkPhoneNumber } from "../utils/check-fields";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { Patient } from "../entities/patient.entity";
import { Appointment } from "../entities/appointment.entity";

export const addAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    /**
     * 1. 檢查是否有缺少欄位
     */
    const fieldNames = ["patientId", "content", "appointmentDate", "appointmentStartTime", "appointmentEndTime"];
    for (const fieldName of fieldNames) {
      checkMissingFields(fieldName, req.body[fieldName]);
    }
    const username = req.params.username.trim();
    checkMissingFields('username', username);

    /**
     * 2. 檢查手機號碼的格式是否正確
    */
    checkPhoneNumber(username);

    const { patientId, content, appointmentDate, appointmentStartTime, appointmentEndTime } = req.body;
    const patientRepo = AppDataSource.getRepository(Patient);
    const userRepo = AppDataSource.getRepository(User);
    const appointmentRepo = AppDataSource.getRepository(Appointment);

    /**
     * 3. 檢查預約時段長度是否為 1 小時
    */
    const startDatetime = new Date(appointmentStartTime).getTime();
    const endDatetime = new Date(appointmentEndTime).getTime();
    const timeDiff = (endDatetime - startDatetime) / (1000 * 60 * 60);
    if (timeDiff !== 1) {
      const message = `The duration of each appointment slot must be 1 hour, please input the right value of 'start time' and 'end time'`;
      throw new CustomError(message, 400);
    };

    /**
     * 4. 檢查此病患是否預約超過 2 個時段
    */
    const patient = await patientRepo.findOne({ where: { id: patientId } });
    if (!patient) throw new DataNotFoundError(`Patient #${patientId}`);
    const appointmentsOfPatient = await appointmentRepo.find({ where: { patient_id: patientId } });
    let patientCounter = 0;
    for await (const appointment of appointmentsOfPatient) {
      if (!appointment.is_expired) patientCounter++;
    }
    if (patientCounter >= 2) throw new CustomError(`The patient #${patientId} has made 2 appointment`, 400);

    /**
     * 5. 檢查此使用者名下的所有病患是否預約超過 5 個時段
     */
    const user = await userRepo.findOne({ where: { phone_number: username } });
    if (!user) throw new DataNotFoundError(`User ${username}`);
    const patientsOfUser = await patientRepo.find({ where: { user_id: user.id } });
    let userCounter = 0;
    for await (const patient of patientsOfUser) {
      const appointments = await appointmentRepo.find({ where: { patient_id: patient.id } });
      for await (const appointment of appointments) {
        if (!appointment.is_expired) userCounter++;
      }
    }
    if (userCounter >= 5) throw new CustomError(`The user ${username} has made 5 appointment`, 400);

    /**
     * 6. 通過檢查，新增一筆預約時段
     */
    const appointment = new Appointment();
    appointment.patient_id = patientId;
    appointment.content = content;
    appointment.date = new Date(appointmentDate);
    appointment.start_time = new Date(appointmentStartTime);
    appointment.end_time = new Date(appointmentEndTime);
    appointment.is_expired = false;
    appointment.patient = { id: patientId } as any;
    await appointmentRepo.save(appointment);

    res.status(200).json({
      message: `Making a appointment successfully`,
      data: appointment
    });

  } catch (err: any) {
    const { statusCode, message } = err;
    res.status(statusCode).json({ message });
  }
};
