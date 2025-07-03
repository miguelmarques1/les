"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrecificationGroup = exports.Category = exports.Book = void 0;
class Book {
    id;
    author;
    categories;
    year;
    title;
    publisher;
    precification_group;
    edition;
    pages;
    synopsis;
    height;
    width;
    weight;
    depth;
    isbn;
    status;
    constructor(id, author, categories, year, title, publisher, precification_group, edition, pages, synopsis, height, width, weight, depth, isbn, status) {
        this.id = id;
        this.author = author;
        this.categories = categories;
        this.year = year;
        this.title = title;
        this.publisher = publisher;
        this.precification_group = precification_group;
        this.edition = edition;
        this.pages = pages;
        this.synopsis = synopsis;
        this.height = height;
        this.width = width;
        this.weight = weight;
        this.depth = depth;
        this.isbn = isbn;
        this.status = status;
    }
}
exports.Book = Book;
class Category {
    id;
    name;
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
exports.Category = Category;
class PrecificationGroup {
    id;
    name;
    profit_percentage;
    constructor(id, name, profit_percentage) {
        this.id = id;
        this.name = name;
        this.profit_percentage = profit_percentage;
    }
}
exports.PrecificationGroup = PrecificationGroup;
//# sourceMappingURL=interfaces.js.map