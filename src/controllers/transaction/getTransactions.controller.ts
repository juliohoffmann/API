// src/controllers/transaction/getTransactions.controller.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyRequest, FastifyReply } from "fastify";
import type { GetTransactionQuery } from "../../schemas/transaction.schema.";
import type { TransactionFilter } from "../../types/transaction.types";
import { prisma } from "../../config/prisma"; // Certifique-se de importar o prisma

dayjs.extend(utc);

export const getTransaction = async (
    request: FastifyRequest<{ Querystring: GetTransactionQuery }>,
    reply: FastifyReply,
): Promise<void> => {
    const userId= request.user.id;
    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }

    const {categoryId, month, year, type } = request.query;
    const filters : TransactionFilter = {userId};

    if (month && year) {
        // A lógica do dayjs.utc().startOf("month") e .endOf("month") está correta para UTC
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
                // CORREÇÃO AQUI: Use 'Category' (com 'C' maiúsculo) e remova a chave extra
                Category: { // Nome do relacionamento deve ser o nome do modelo no schema.prisma
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

       
  