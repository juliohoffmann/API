    // src/controllers/category.controller.ts
    import { FastifyRequest, FastifyReply } from "fastify";
    import { prisma } from "../config/prisma"; // <-- Certifique-se de que a importação do prisma é nomeada aqui

    export const getCategories = async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        
        const categories = await prisma.category.findMany({
          orderBy: { name: 'asc' },
        });
        reply.send(categories);
      } catch (error) {
        
        request.log.error(error, "🚨 Erro ao buscar categorias:"); // <-- Mude para isso
        reply.status(500).send({ error: "Erro ao buscar categorias" });
      }
    };
