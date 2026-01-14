import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transaction.schema.";
import { Dayjs } from "dayjs";


export const getHistoricalTransaction = async (
    request: FastifyRequest <{Querystring: GetHistoricalTransactionsQuery}>,
    reply: FastifyReply
): Promise<void> => {
     const userId= request.userId;
    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }
const { month, year, months=6 } = request.query;

const baseDate= new Date(year, month-1, 1);
const startDate = Dayjs(baseDate).subtract(months -1, "month").startOf("month").toDate();
const endDate =  dayjs(baseDate).endOf("month").toDate();

try {
    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        select:{
            amount: true,
            type: true,
            date: true,
        }
              
    });
    reply.status(200).send(transactions);
} catch (error) {
    reply.status(500).send({ error: "Erro ao buscar transações" });
}
};