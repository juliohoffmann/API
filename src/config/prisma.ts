import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

console.log('DATABASE_URL (in prisma.ts):', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const connectToPrisma = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');
  } catch (error) {
    console.error('🚨 Falha ao se conectar', error);
  }
};

export { prisma };
export default connectToPrisma;





















