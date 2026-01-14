// src/config/env.ts
import dotenv from 'dotenv';
import {z} from 'zod';

dotenv.config();


const envSchema = z.object({
    PORT: z.string().transform(Number).default(3001),
    // CORREÇÃO AQUI: Passe a mensagem de erro como um objeto para o método min()
    DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),
    NODE_ENV: z.enum(['dev', 'test', 'production'],{
        message: 'NODE_ENV deve ser dev, test ou production',
    }),
    FIREBASE_PROJECT_ID: z.string().optional(),
    FIREBASE_PRIVATE_KEY: z.string().optional(),
    FIREBASE_CLIENT_EMAIL: z.string().optional(),
}); 

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('Variáveis de ambiente inválidas:', _env.error.format()); // Adicione .format() para ver detalhes
    process.exit(1);
}

export const env = _env.data;
