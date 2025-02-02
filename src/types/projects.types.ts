import { ClientItemProps } from "./clients.types";
import { ExpenseItemProps } from "./expenses.types";
import { IncomeItemProps } from "./incomes.types";

export interface ProjectItemProps {
  id: number;
  documentId: string;
  title: string;
  description: string;
  budget?: number;
  project_status: "В очереди" | "В работе" | "На проверке" | "Заверешен";
  start_date: Date;
  end_date: Date;

  incomes: IncomeItemProps[];
  expenses: ExpenseItemProps[];
  client: ClientItemProps | null;
}
