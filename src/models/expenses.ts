export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date; // Formato ISO (YYYY-MM-DD)
}
