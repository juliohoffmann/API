    // src/controllers/category.controller.ts
    import { FastifyRequest, FastifyReply } from "fastify";
    import { prisma } from "../config/prisma"; // <-- Certifique-se de que a importação do prisma é nomeada aqui

    export const getCategories = async (
      request: FastifyRequest,
      reply: FastifyReply,
    ): Promise<void> => {
      try {
        // Certifique-se de que 'prisma' está disponível e que 'Category' é o nome correto do modelo
        const categories = await prisma.Category.findMany({
          orderBy: { name: 'asc' },
        });
        reply.send(categories);
      } catch (error) {
        // Log o erro completo para depuração, passando o objeto 'error' como o primeiro argumento
        request.log.error(error, "🚨 Erro ao buscar categorias:"); // <-- Mude para isso
        reply.status(500).send({ error: "Erro ao buscar categorias" });
      }
    };
