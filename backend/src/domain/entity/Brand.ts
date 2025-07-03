import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}