// src/schemas/trasaction.schema.ts

import { z } from "zod";
import { ObjectId } from "mongodb";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionsSchema = z.object({
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    amount: z.number().positive("O valor deve ser positivo"),
    date: z.coerce.date().catch(() => new Date()).pipe(
        z.date({ errorMap: () => ({ message: "Data inválida" }) })
    ),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria inválida",
    }),
    type: z.enum(["expense", "income"]).catch("expense"),
});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum(["expense", "income"]).optional(),
    categoryId: z.string()
        .refine(isValidObjectId, {
            message: "Categoria inválida",
        }).optional(),
});

export const getHistoricalTransactionsSchema = z.object({
    // Correção aqui: use required_error para mensagens de campos obrigatórios
    month: z.coerce.number().min(1).max(12),
    year: z.coerce.number().min(2000).max(2100),
    months:z.coerce.number().min(1).max(12).optional(),
});
export const getTransactionsSummarySchema = z.object({
    // Correção aqui: use required_error para mensagens de campos obrigatórios
    month: z.string({ required_error: "O mês é obrigatório" }),
    year: z.string({ required_error: "O ano é obrigatório" }),
});

export const deleteTransactionsSchema = z.object({
    id:z.string().refine(isValidObjectId, {
        message: "Id inválido",
    }),
});
export type GetHistoricalTransactionsQuery = z.infer<typeof getHistoricalTransactionsSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionsSchema>;



