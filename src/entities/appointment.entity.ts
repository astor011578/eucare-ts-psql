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

    @Column({ name: 'date' })
    date: Date;

    @Column({ name: 'start_time' })
    start_time: Date;

    @Column({ name: 'end_time' })
    end_time: Date;

    /**
     * 表示此預約是否已過期
     */
    @Column({ name: 'is_expired', default: false })
    is_expired: boolean;

    @ManyToOne(type => Patient, patient => patient.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
}
