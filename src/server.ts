    // src/server.ts
    import app from "./app.ts";
    import {env} from "./config/env.ts";
    import connectToPrisma from "./config/prisma.ts"; // <-- REMOVA AS CHAVES AQUI
    import { initializeGlobalCategories } from "./services/globalCategories.service.ts";

    const PORT = env.PORT;

    const startServer = async () => {
      try {
        await connectToPrisma();
        // Chame initializeGlobalCategories sem argumentos
        await initializeGlobalCategories();
        await app.listen({ port: PORT }).then(() => {
          console.log(`Servidor rodando na porta ${PORT}`);
        });
      } catch (err) {
        console.error('🚨Falha ao iniciar o servidor ou conectar ao banco de dados:', err);
      }
    };

    startServer();











