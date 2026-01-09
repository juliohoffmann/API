// src/schemas/trasaction.schema.ts

import { z } from "zod";
import { ObjectId } from "mongodb";

const isValidObjectId = (id: string): boolean => ObjectId.isValid(id);

export const createTransactionsSchema = z.object({
    description: z.string().min(1, { message: "A descrição é obrigatória" }),
    amount: z.number().positive("O valor deve ser positivo"),
    date: z.coerce.date({
        errorMap: () => ({ message: "Data inválida" })
    }),
    categoryId: z.string().refine(isValidObjectId, {
        message: "Categoria inválida",
    }),
    type: z.enum(["expense", "income"], {
        errorMap: () => ({ message: "Tipo inválido" })
    }),
});

export const getTransactionsSchema = z.object({
    month: z.string().optional(),
    year: z.string().optional(),
    type: z.enum(["expense", "income"], {
        errorMap: () => ({ message: "Tipo inválido" }), // Corrigido para "Tipo inválido"
    }).optional(),
    categoryId: z.string()
        .refine(isValidObjectId, {
            message: "Categoria inválida",
        }).optional(),
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

export type GetTransactionsQuery = z.infer<typeof getTransactionsSchema>;
export type GetTransactionsSummaryQuery = z.infer<typeof getTransactionsSummarySchema>;
export type DeleteTransactionParams = z.infer<typeof deleteTransactionsSchema>;



