import { TransactionType } from '@prisma/client';
import type { categorySummary } from "./category.types";



export interface TransactionFilter  {
    userId: string;
    date?:{
        gte?: Date;
        lte?: Date;
    }
    categoryId?: string;
    type?: TransactionType;
}

export interface TransactionSummary {
    
    totalExpense: number;
    totalIncome: number;
    balance: number;
    expenseByCategory:categorySummary[];
}

