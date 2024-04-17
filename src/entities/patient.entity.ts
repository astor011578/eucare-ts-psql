import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";

@Entity({ name: "patients" })
export class Patient {
    @PrimaryGeneratedColumn()
    patient_id: number;

    @Column({ nullable: false })
    user_id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, length: 10, unique: true })
    identity_number: string;

    @Column({ nullable: false })
    birth_date: Date;

    @Column({ nullable: false })
    address: string;

    @ManyToOne(() => User, user => user.patients)
    user: User;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments: Appointment[];
}
