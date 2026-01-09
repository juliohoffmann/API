// src/controllers/transaction/createTrasaction.controller.ts
import type { FastifyRequest, FastifyReply } from "fastify";
import { createTransactionsSchema } from "../../schemas/transaction.schema.";
import { prisma } from "../../config/prisma"; // Certifique-se de que o caminho para 'prisma' está correto
import { TransactionType } from "@prisma/client"; // Importe TransactionType para tipagem

const createTransaction = async (request:FastifyRequest, reply:FastifyReply):Promise<void> => {
    const userId= "1212325256FTRTR"; // Considere obter isso do request.user.id após autenticação
    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }

    const result = createTransactionsSchema.safeParse(request.body);
    if (!result.success) {
        const errorMessages = result.error.errors[0].message || "Validacao falhou";
        reply.status(400).send({ error: errorMessages });
        return;
    }

    const transaction = result.data;

    try {
        const category = await prisma.category.findFirst({
            where: {
                id: transaction.categoryId,
                type: transaction.type as TransactionType // Adicione o cast para TransactionType
            },
        });

        if (!category) {
            reply.status(400).send({ error: "Categoria não encontrada" });
            return;
        }

        const parsedDate = new Date(transaction.date);

        // CORREÇÃO AQUI:
        const newTransaction = await prisma.transaction.create({
            data: { // <-- Use 'data' como a propriedade principal
                description: transaction.description,
                amount: transaction.amount,
                date: parsedDate,
                type: transaction.type as TransactionType, // Adicione o cast
                userId: userId, // Use o userId obtido
                categoryId: transaction.categoryId,
            },
            include: { // <-- Use 'include' com 'i' minúsculo
                Category: true, // O nome do relacionamento no seu schema.prisma deve ser 'Category'
            },
        });

        reply.status(201).send(newTransaction);

    } catch (error) {
        request.log.error(error, "🚨 Erro ao criar transação:");
        reply.status(500).send({ error: "Erro ao criar transação" });
    }
};

export default createTransaction;


