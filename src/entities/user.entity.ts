import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Patient } from "./patient.entity";

@Entity({ name: "users" })
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ nullable: false, length: 10, unique: true })
    phone_number: string;

    @Column({ nullable: false })
    password: string;

    @OneToMany(() => Patient, patient => patient.user)
    patients: Patient[];
}
