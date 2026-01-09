    // src/config/prisma.ts
    import { PrismaClient } from '../../generated/prisma';

    console.log('DATABASE_URL (in prisma.ts):', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');

    const prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });

    // Exporta a função de conexão como default
    const connectToPrisma = async() => {
        try {
            await prisma.$connect()
            console.log('✅Conectado ao banco de dados')
        } catch (error) {
            console.error('🚨Falha ao se conectar', error)
        }
    }

    export { prisma }; // Exporta a instância do PrismaClient nomeadamente
    export default connectToPrisma; // Exporta a função de conexão como default












