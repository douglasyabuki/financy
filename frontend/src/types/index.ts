import type { CategoryColor, CategoryIcon } from "@/constants/categories";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateProfileInput {
  name: string;
}

export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  transactions: Partial<Transaction>[];
  transactionCount: number;
  icon: CategoryIcon;
  color: CategoryColor;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTransactionInput {
  description: string;
  type: TransactionType;
  amount: string;
  date: string;
}

export interface UpdateTransactionInput {
  description?: string;
  type?: TransactionType;
  amount?: string;
  date?: string;
  categoryId?: string;
}
