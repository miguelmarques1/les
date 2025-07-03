import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Book } from "./Book";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Book, book => book.categories)
    books: Book[];
}