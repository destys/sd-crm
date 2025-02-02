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
import { calculateTotal, cn, formatPrice } from "@/lib/utils";


import { ProjectItemProps } from "@/types/projects.types";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { EditIcon, EyeIcon, Trash2Icon } from "lucide-react";
import { NavLink } from "react-router";

const ProjectFinance = ({ data }: { data: ProjectItemProps }) => {
    console.log('data: ', data);

    const invoices = [];

    invoices.push(...data.incomes.map(item => ({ ...item, type: 'income' })));
    invoices.push(...data.expenses);

    const totalAmount = calculateTotal(invoices);

    return (
        <div>
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
                                        onClick={() => { }}
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
                        <TableCell colSpan={6}>Итого</TableCell>
                        <TableCell className="text-right">{formatPrice(totalAmount)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default ProjectFinance