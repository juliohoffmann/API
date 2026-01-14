
import type { DeleteTransactionParams } from "../../schemas/transaction.schema."
import type { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../config/prisma";

export const deleteTransaction = async (
    request: FastifyRequest <{Params: DeleteTransactionParams}>, 
    reply: FastifyReply
): Promise<void> => {
      const userId= request.user.id;
      const {id} = request.params;

    if (!userId) {
        reply.status(400).send({ error: "Usuário não encontrado" });
        return;
    }
    try {
        const transaction = await prisma.transaction.findFirst({
            where: {
                id,
                userId,
            },
        });
        if (!transaction) {
            reply.status(404).send({ error: "ID da Transação não encontrada" });
            return;
            
        }
        await prisma.transaction.delete({
            where: {
                id,
            },
        });
        reply.status(204).send({message: "Transação deletada com sucesso"});
    } catch (error) {
        request.log.error(error, "🚨 Erro ao deletar transação:"); // <-- Mude para isso
        reply.status(500).send({ error: "Erro ao deletar transação" });
    }
};