"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerInterestSchema = exports.AllCategoriesSchema = exports.AllBooksSchema = exports.BookCategorySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.BookCategorySchema = {
    categoryID: zod_1.default.number().describe("The ID of the book category"),
};
exports.AllBooksSchema = {};
exports.AllCategoriesSchema = {};
exports.CustomerInterestSchema = {
    customerID: zod_1.default.number().describe("The customer ID as integer"),
};
//# sourceMappingURL=index.js.map