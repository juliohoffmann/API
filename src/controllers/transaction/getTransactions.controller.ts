// src/controllers/transaction/getTransactions.controller.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { GetTransactionsQuery } from "../../schemas/transaction.schema";
import type { TransactionFilter } from "../../types/transaction.types";
import { prisma } from "../../config/prisma"; 

dayjs.extend(utc);

export const getTransaction = async (
    request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId= request.userId;
    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }

    const {categoryId, month, year, type } = request.query;
    const filters : TransactionFilter = {userId};

    if (month && year) {
        
        const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
        const endDate = dayjs.utc(`${year}-${month}-01`).endOf("month").toDate();
        filters.date = { gte: startDate, lte: endDate };
    }

    if (categoryId) {
        filters.categoryId = categoryId;
    }

    if (type) {
        filters.type = type ;
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: filters,
            orderBy: { date: "desc" },
            include: {
                
                category: { 
                    select: {
                        color: true,
                        name: true,
                        type: true,
                    },
                },
            }, // <-- Esta chave fecha o objeto 'include'
        }); // <-- Esta chave fecha o objeto de configuração de findMany

        reply.send(transactions);
    } catch(error){
        request.log.error(error, "🚨 Erro ao buscar transações:");
        reply.status(500).send({ error: "Erro ao buscar transações" });
    }
};

       
  