import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class PrecificationGroup {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('decimal', { precision: 5, scale: 2 })
    profitPercentage: number;

    constructor(
        name: string,
        profitPercentage: number
    ) {
        this.name = name;
        this.profitPercentage = profitPercentage;
    }
}