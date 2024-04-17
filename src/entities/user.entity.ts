import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from "typeorm";
import { Patient } from "./patient.entity";

@Entity({ name: "User" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'phone_number', length: 10, unique: true })
    phone_number: string;

    @Column({ name: 'password' })
    password: string;

    @OneToMany(type => Patient, patient => patient.user)
    patients: Patient[];
}
