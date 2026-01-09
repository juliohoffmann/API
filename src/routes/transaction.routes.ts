// src/routes/transaction.routes.ts
import { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transaction/createTransaction.controller";
import { getTransaction } from "../controllers/transaction/getTransactions.controller";
import { getTransactionsSummary } from "../controllers/transaction/getTransactionsSummary.controller";
import {  getTransactionsSchema, getTransactionsSummarySchema, createTransactionsSchema, deleteTransactionsSchema } from "../schemas/transaction.schema.";


const transactionRoutes = async (fastify: FastifyInstance) => {
    // Rota para criar uma transação
    fastify.route({
        method: "POST",
        url: "/",
        schema: {
            body: zodToJsonSchema(createTransactionsSchema),
        }, // <-- Adicione esta vírgula aqui
        handler: createTransaction,
    });
    // Buscar com filtros
    fastify.route({
        method: "GET",
        url: "/",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSchema),
        },
        handler: getTransaction,
    });
    // Buscar o resultados de todas as transações
    fastify.route({
        method: "GET",
        url: "/summary",
        schema: {
            querystring: zodToJsonSchema(getTransactionsSummarySchema),
        }, // <-- E adicione esta vírgula aqui também
        handler: getTransactionsSummary,
    });
    // deletar uma transação
    fastify.route({
        method: "DELETE",
        url: "/:id",
        schema: {
            params: zodToJsonSchema(deleteTransactionsSchema),
        },
        handler: getTransaction,
    })




};
export default transactionRoutes;

