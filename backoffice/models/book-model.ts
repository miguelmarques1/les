import { CategoryModel } from "./category-model"
import { Dimensions } from "./dimensions"
import { PrecificationGroup } from "./precification-group"

export class BookModel {
  id?: number
  title: string
  author: string
  categories: CategoryModel[]
  year: number
  publisher: string
  pages: number
  edition: number
  isbn: string
  price: number
  stockCount: number
  status: boolean
  dimensions: Dimensions
  precificationGroup: PrecificationGroup

  constructor(
    title: string,
    author: string,
    categories: CategoryModel[],
    year: number,
    publisher: string,
    pages: number,
    edition: number,
    isbn: string,
    price: number,
    stockCount: number,
    status: boolean,
    dimensions: Dimensions,
    precificationGroup: PrecificationGroup,
    id?: number,
  ) {
    this.id = id
    this.title = title
    this.author = author
    this.categories = categories
    this.year = year
    this.publisher = publisher
    this.pages = pages
    this.edition = edition
    this.isbn = isbn
    this.price = price
    this.stockCount = stockCount
    this.status = status
    this.dimensions = dimensions
    this.precificationGroup = precificationGroup
  }

  static fromMap(map: any): BookModel {
    return new BookModel(
      map.title,
      map.author,
      (map.categories as []).map((category) => CategoryModel.fromMap(category)),
      map.year,
      map.publisher,
      map.pages,
      map.edition,
      map.isbn,
      map.price,
      map.stock_count,
      map.status,
      Dimensions.fromMap(map),
      PrecificationGroup.fromMap(map.precification_group),
      map.id,
    )
  }

  toMap(): Record<string, any> {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      categories: this.categories,
      year: this.year,
      publisher: this.publisher,
      pages: this.pages,
      edition: this.edition,
      isbn: this.isbn,
      price: this.price,
      stock_count: this.stockCount,
      status: this.status,
      dimensions: this.dimensions.toMap(),
      precification_group: this.precificationGroup.toMap(),
    }
  }

  calculatePrice(): number {
    return this.price
  }
}


export interface BookCreateRequest {
  title: string
  author: string
  year: string
  publisher: string
  edition: string
  isbn: string
  pages: number
  synopsis: string
  height: number
  width: number
  weight: number
  depth: number
  category_ids: number[]
  precification_group_id: number
}