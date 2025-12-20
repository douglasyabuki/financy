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

export type TransactionType = "income" | "expense";

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
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
}
