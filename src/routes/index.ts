// src/routes/index.ts
import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transactionRoutes from "./transaction.routes"; // Importe as rotas de transação

async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/health", async () => {
    return { status: "ok", message: "DevBills API rodando normalmente" };
  });
  fastify.register(categoryRoutes, { prefix:"/categories"});
  fastify.register(transactionRoutes, { prefix:"/transactions"}); // Mude para /transactions (plural)
}
export default routes;
