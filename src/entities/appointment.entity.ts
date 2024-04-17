import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Patient } from "./patient.entity";

@Entity({ name: "appointments" })
export class Appointment {
    @PrimaryGeneratedColumn()
    appointment_id: number;

    @Column({ nullable: false })
    patient_id: number;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: false })
    appointment_date: Date;

    @Column({ nullable: false })
    appointment_time: Date;

    @ManyToOne(() => Patient, patient => patient.appointments)
    patient: Patient;
}
