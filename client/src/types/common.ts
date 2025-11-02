/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Types
interface Transaction {
  id?: string;
  account?: string;
  accountType?: string;
  transaction?: string;
  category?: string;
  categoryIcon?: React.ReactNode;
  date?: string;
  amount?: number;
  spend?: string;
  spendType?: string;
  spendTag?: string;
  income?: string;
  incomeType?: string;
  incomeTag?: string;
  purpose?: string;
  type?: string;
}
  
interface NavigationItem {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}
  