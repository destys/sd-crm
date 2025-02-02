export interface IncomeItemProps {
  id: number;
  documentId: string;
  amount: number;
  type?: string;
  date: Date;
  description: string;
}
