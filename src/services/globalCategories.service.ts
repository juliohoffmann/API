    // src/services/globalCategories.service.ts
   
    // Importe a instância 'prisma' nomeadamente do seu arquivo de configuração
    import { prisma } from "../config/prisma"; // <-- Adicione esta linha
import { category } from "../../generated/prisma";

    type GlobalCategoryInput = Pick<category, "name" | "color" | "type">;

    export const initializeGlobalCategories = async (): Promise<category[]> => {
      const globalCategories: GlobalCategoryInput[] = [
        // Despesas
        { name: "Alimentação", color: "#FF5733", type: "expense" },
        { name: "Transporte", color: "#33A8FF", type: "expense" },
        { name: "Moradia", color: "#33FF57", type: "expense" },
        { name: "Saúde", color: "#F033FF", type: "expense" },
        { name: "Educação", color: "#FF3366", type: "expense" },
        { name: "Lazer", color: "#FFBA33", type: "expense" },
        { name: "Compras", color: "#33FFF6", type: "expense" },
        { name: "Outros", color: "#B033FF", type: "expense" },
        // Receitas
        { name: "Salário", color: "#33FF57", type: "income" },
        { name: "Freelance", color: "#33A8FF", type: "income" },
        { name: "Investimentos", color: "#FFBA33", type: "income" },
        { name: "Outros", color: "#B033FF", type: "income" },
      ];

      const createCategories: category[] = [];
      for (const category of globalCategories) {
        try {
          
          const existing = await prisma.category.findFirst({
            where: {
              name: category.name,
              type: category.type,
            },
          });
          if (!existing) {
            const newCategory = await prisma.category.create({ data: category });
            createCategories.push(newCategory);
          } else {
            createCategories.push(existing);
          }
        } catch (error) {
          console.error('🚨Erro ao criar categorias globais:', error);
        }
      }
      console.log('✅Todas as categorias Inicializadas');
      return createCategories;
    };

