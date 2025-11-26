import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from "typeorm";
import { DefaultValidation } from "../validation/DefaultValidation";
import { User } from "./User";

@Entity("admins")
export class Admin extends User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ length: 255 })
    name: string;

    @Column({ default: "ADMIN" })
    role: string;

    @Column({ nullable: true })
    permissions: string;

    constructor(
        email: string,
        name: string,
        password: string | null = null,
        role: string = "ADMIN",
        permissions: string | null = null
    ) {
        super(email, name, password);
        this.role = role;
        this.permissions = permissions;
    }

    @BeforeInsert()
    @BeforeUpdate()
    private validateAdmin() {
        this.validate();
        DefaultValidation.notNull(this.role, "Role do admin não pode ser nula");
    }
}
