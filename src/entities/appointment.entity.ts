import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";

@Entity({ name: "appointments" })
export class Appointment extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'patient_id' })
    patient_id: number;

    @Column({ name: 'content' })
    content: string;

    @Column({ name: 'appointment_date' })
    appointment_date: Date;

    @Column({ name: 'appointment_time' })
    appointment_time: Date;

    @ManyToOne(type => Patient, patient => patient.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
}
