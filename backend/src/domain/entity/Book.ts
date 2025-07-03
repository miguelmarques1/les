import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany, AfterLoad, BeforeInsert, BeforeUpdate } from "typeorm";
import { ISBN } from "../vo/ISBN";
import { Category } from "./Category";
import { DefaultValidation } from "../validation/DefaultValidation";
import { BookState } from "../enums/BookState";
import { PrecificationGroup } from "./PrecificationGroup";
import { fromValue } from "../utils/fromValue";
import { StockBook } from "./StockBook";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    author: string;

    @ManyToMany(() => Category, category => category.books)
    @JoinTable({
        name: 'book_categories', // Nome explícito para a tabela de junção
        joinColumn: { name: 'book_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' }
    })
    categories: Category[];

    @Column()
    year: number;

    @Column()
    title: string;

    @Column()
    publisher: string;

    @ManyToOne(() => PrecificationGroup, { eager: true }) // Carrega automaticamente
    precificationGroup: PrecificationGroup;

    @Column()
    edition: number;

    @Column()
    pages: number;

    @Column({ type: 'text' })
    synopsis: string;

    @Column('decimal', { precision: 5, scale: 2 })
    height: number;

    @Column('decimal', { precision: 5, scale: 2 })
    width: number;

    @Column('decimal', { precision: 6, scale: 3 })
    weight: number;

    @Column('decimal', { precision: 5, scale: 2 })
    depth: number;

    @Column(() => ISBN)
    isbn: ISBN;

    @Column({ 
        type: 'enum', 
        enum: BookState, 
        default: BookState.ACTIVE 
    })
    status: BookState;

    @OneToMany(() => StockBook, stockBook => stockBook.book)
    stockBooks: StockBook[];

    constructor(
        author: string,
        categories: Category[],
        year: number,
        title: string,
        publisher: string,
        precificationGroup: PrecificationGroup,
        edition: number,
        pages: number,
        synopsis: string,
        height: number,
        width: number,
        weight: number,
        depth: number,
        isbn: string,
        status?: string
    ) {
        this.author = author;
        this.categories = categories;
        this.year = year;
        this.title = title;
        this.publisher = publisher;
        this.precificationGroup = precificationGroup;
        this.edition = edition;
        this.pages = pages;
        this.synopsis = synopsis;
        this.height = height;
        this.width = width;
        this.weight = weight;
        this.depth = depth;
        this.isbn = new ISBN(isbn);
        this.status = status ? fromValue(BookState, status) : BookState.ACTIVE;
    }

    @BeforeInsert()
    @BeforeUpdate()
    validate() {
        DefaultValidation.numNotNegative(this.year, "Invalid books year");
        DefaultValidation.strDefaultLenght(this.title, "Invalid books title");
        DefaultValidation.strDefaultLenght(this.author, "Invalid books author");
        DefaultValidation.strDefaultLenght(this.publisher, "Invalid books publisher");
        DefaultValidation.numNotNegative(this.edition, "Invalid books edition");
        DefaultValidation.numNotNegative(this.pages, "Invalid books pages quantity");
        DefaultValidation.numIsInteger(this.pages, "Invalid books pages quantity");
        DefaultValidation.numNotNegative(this.height, "Invalid books height");
        DefaultValidation.numNotNegative(this.width, "Invalid books width");
        DefaultValidation.numNotNegative(this.weight, "Invalid books weight");
        DefaultValidation.numNotNegative(this.depth, "Invalid books depth");
    }
}