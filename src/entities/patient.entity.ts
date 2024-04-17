import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, BaseEntity } from "typeorm";
import { User } from "./user.entity";
import { Appointment } from "./appointment.entity";

@Entity({ name: "Patient" })
export class Patient extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'user_id' })
    user_id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'identity_number', length: 10, unique: true })
    identity_number: string;

    @Column({ name: 'birth_date' })
    birth_date: Date;

    @Column({ name: 'address' })
    address: string;

    @ManyToOne(type => User, user => user.patients)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments: Appointment[];
}
