import { useState } from "react";
import { Loader2Icon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ClientsActions } from "@/components/clients-actions";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import { useClients } from "@/hooks/use-clients";
import { ClientRow } from "@/components/client/client-row";

export const ClientsList = () => {
    const [page, setPage] = useState(1);
    const pageSize = 25;
    const { data: clients, total, isLoading } = useClients(page, pageSize);

    const totalPages = Math.ceil((total || 1) / pageSize);

    return (
        <div>
            <h1>Клиенты</h1>
            <ClientsActions />
            <Table>
                <TableCaption>Список клиентов</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Имя</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="text-right">Телефон</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                <div className="flex justify-center">
                                    <Loader2Icon className=" animate-spin" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        clients?.map((client) => (
                            <ClientRow data={client} key={client.documentId} />
                        ))
                    )}
                </TableBody>
            </Table>


            {/* Пагинация */}
            {total && total > pageSize && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} isActive={page === 1} />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} isActive={page === totalPages} />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    )
}