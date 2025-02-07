import { EditIcon, EyeIcon, PlusCircleIcon, Trash2Icon } from 'lucide-react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from '@/components/ui/button'
import { IncomeItemProps } from '@/types/incomes.types';
import { ExpenseItemProps } from '@/types/expenses.types';
import { calculateTotal, cn, formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { NavLink } from 'react-router';
import { useModal } from '@/context/modal-context';
import { useAlertDialog } from '@/context/alert-dialog-context';
import { useIncomeMutations } from '@/hooks/use-income';
import { useExpenseMutations } from '@/hooks/use-expense';


interface InvoiceItemProps {
    incomes?: IncomeItemProps[];
    expenses?: ExpenseItemProps[];
}

export const FinansesList = ({ incomes, expenses }: InvoiceItemProps) => {
    const { openModal } = useModal();
    const invoices = [];
    const { deleteIncome } = useIncomeMutations();
    const { deleteExpense } = useExpenseMutations();

    if (incomes) {
        invoices.push(...incomes.map(item => ({ ...item, type: 'income' })));
    }

    if (expenses) {
        invoices.push(...expenses);
    }

    const totalAmount = calculateTotal(invoices);


    const { showConfirmation } = useAlertDialog();

    const handleAddFinance = () => {
        openModal("addFinanceModal", {
            title: "Добавить новый расчет",
        });
    };

    const handleDelete = async (projectId: string, type: string) => {
        const confirmed = await showConfirmation({
            title: "Удаление записи о расчете",
            description: "Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.",
            confirmLabel: "Удалить",
            cancelLabel: "Отмена",
        });

        if (confirmed) {
            if (type === 'Приход') {
                deleteIncome(projectId);
            } else {
                deleteExpense(projectId)
            }

        }
    };

    return (
        <div>
            <Button className="mt-5 mb-10" onClick={handleAddFinance}>
                <PlusCircleIcon />
                Добавить
            </Button>
            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Описание</TableHead>
                        <TableHead>Тип</TableHead>
                        <TableHead>Сумма</TableHead>
                        <TableHead>Способ оплаты</TableHead>
                        <TableHead>Дата операции</TableHead>
                        <TableHead>Проект</TableHead>
                        <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Сортировка по убыванию (новые сверху)
                        .map((invoice, index) => (
                            <TableRow key={invoice.documentId} className={cn(invoice.type === 'income' ? 'bg-green-50' : 'bg-red-50')}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="first-letter:uppercase">{invoice.description}</TableCell>
                                <TableCell>{invoice.type === 'income' ? 'Приход' : 'Расход'}</TableCell>
                                <TableCell>{formatPrice(invoice.amount)}</TableCell>
                                <TableCell>Безнал</TableCell>
                                <TableCell>{format(new Date(invoice.date), 'dd-MM-yyyy HH:mm')}</TableCell>
                                <TableCell>{invoice.project?.title}</TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <NavLink to={`/projects/${invoice.documentId}`}>
                                        <Button
                                            variant="default"
                                        >
                                            <EyeIcon className="size-4" />
                                        </Button>
                                    </NavLink>

                                    <Button
                                        variant="outline"
                                        onClick={() => { }}
                                    >
                                        <EditIcon className="size-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(invoice.documentId, invoice.type === 'income' ? 'Приход' : 'Расход')}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={7}>Итого</TableCell>
                        <TableCell className="text-right">{formatPrice(totalAmount)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}