import z from "zod";

export const BookCategorySchema = {
    categoryID: z.number().describe("The ID of the book category"),
};
export const AllBooksSchema = {};
export const AllCategoriesSchema = {};
export const CustomerInterestSchema = {
    customerID: z.number().describe("The customer ID as integer"),
};