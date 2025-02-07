import { FinansesList } from "@/components/finances-list"
import { useExpenses } from "@/hooks/use-expenses";
import { useIncomes } from "@/hooks/use-incomes"

export const FinancesPage = () => {
    const { data: IncomesData } = useIncomes();
    const { data: ExpensesData } = useExpenses();

    return (
        <div>
            <h1>Финансы</h1>
            <FinansesList incomes={IncomesData} expenses={ExpensesData} />
        </div>
    )
}
