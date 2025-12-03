import "reflect-metadata"
import { DataSource } from "typeorm"
import * as dotenv from "dotenv"
import { Address } from "./domain/entity/Address"
import { Book } from "./domain/entity/Book"
import { Brand } from "./domain/entity/Brand"
import { Card } from "./domain/entity/Card"
import { Cart } from "./domain/entity/Cart"
import { CartItem } from "./domain/entity/CartItem"
import { Category } from "./domain/entity/Category"
import { Coupon } from "./domain/entity/Coupon"
import { Customer } from "./domain/entity/Customer"
import { Order } from "./domain/entity/Order"
import { Phone } from "./domain/entity/Phone"
import { PrecificationGroup } from "./domain/entity/PrecificationGroup"
import { ReturnExchangeRequest } from "./domain/entity/ReturnExchangeRequest"
import { StockBook } from "./domain/entity/StockBook"
import { Document } from "./domain/vo/Document"
import { ISBN } from "./domain/vo/ISBN"
import { Transaction } from "./domain/entity/Transaction"
import { CardPayment } from "./domain/entity/CardPayment"
import { Password } from "./domain/vo/Password"
import { Admin } from "./domain/entity/Admin"

dotenv.config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number.parseInt(DB_PORT || "5432"),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    Address,
    Book,
    Brand,
    Card,
    Cart,
    CartItem,
    Category,
    Coupon,
    Customer,
    Admin,
    Order,
    Phone,
    PrecificationGroup,
    ReturnExchangeRequest,
    StockBook,
    Transaction,
    CardPayment,
    Document,
    ISBN,
    Password,
  ],
  subscribers: [],
})
