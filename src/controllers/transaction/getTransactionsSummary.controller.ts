// src/controllers/transaction/getTransactionsSummary.controller.ts

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import { prisma } from "../../config/prisma";
import type { categorySummary } from "../../types/category.types";
import type { TransactionSummary } from "../../types/transaction.types";
import { TransactionType } from '@prisma/client';


dayjs.extend(utc);

export const getTransactionsSummary = async (
    request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId = request.userId; 
    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }

    const { month, year } = request.query;
  
    if (!month || !year) {
        reply.status(400).send({ error: "Os parâmetros 'month' e 'year' devem ser fornecidos" });
        return;
    }

    const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
    const endDate = dayjs.utc(`${year}-${month}-01`).endOf("month").toDate();

    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
          
            include: {
                category: true,
            },
        });

        let totalIncome = 0;
        let totalExpenses = 0;
        const groupedExpenses = new Map<string, categorySummary>(); 

        for (const transaction of transactions) {
            if (transaction.type === TransactionType.expense) {
                const existing = groupedExpenses.get(transaction.Id) ?? {
                    categoryId: transaction.categoryId,
                    categoryName: transaction.category.name,
                    categoryColor: transaction.category.color,
                    amount: 0,
                    percentage: 0,
                };
                existing.amount += transaction.amount;
                groupedExpenses.set(transaction.categoryId, existing);
                totalExpenses += transaction.amount; // Removida a vírgula extra
            } else {
                totalIncome += transaction.amount; // Removida a vírgula extra
            }
        }

        // Calcular porcentagens para despesas agrupadas
        const summary: TransactionSummary = {
            totalExpense: totalExpenses,
            totalIncome,
            balance: Number((totalIncome - totalExpenses).toFixed(2)),
            expenseByCategory: Array.from(groupedExpenses.values()).map((entry) =>({
                ...entry,
                percentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
            })).sort((a, b) => b.amount - a.amount),
        };

        reply.send(summary);
    } catch (error) {
        request.log.error(error, "🚨 Erro ao buscar resumo de transações:");
        reply.status(500).send({ error: "Erro ao buscar resumo de transações" });
    }
};
