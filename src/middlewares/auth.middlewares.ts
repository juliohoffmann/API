import { FastifyReply, FastifyRequest } from "fastify";
import admin from "firebase-admin";

declare module 'fastify' {
    interface FastifyRequest {
        userId?: string;
    }
}

export const authMiddleware = async (
request: FastifyRequest, 
     reply: FastifyReply,
): Promise<void> => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        reply.status(401).send({ error: 'Token de autenticação não fornecido' });
        return;
    }
    const Token = authHeader.replace('Bearer ', '');
    try {
        const decodedToken = await admin.auth().verifyIdToken(Token);
        request.userId = decodedToken.uid;
       
    } catch (error) {
       reply.status(401).send({ error: 'Token de autenticação inválido' });
        
        return;
    }

};
export default authMiddleware;
