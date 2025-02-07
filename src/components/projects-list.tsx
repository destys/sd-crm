import { Loader2Icon } from "lucide-react";

import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useProjects } from "@/hooks/use-projects";

import { useState } from "react";
import { ProjectRow } from "./project/project-row";

export const ProjectsList = () => {
    const [page, setPage] = useState(1);
    const pageSize = 25;
    const { data: projects, total, isLoading } = useProjects(page, pageSize);

    const totalPages = Math.ceil((total || 1) / pageSize);



    return (
        <div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-96 w-full">
                    <Loader2Icon className="animate-spin" />
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Контакт</TableHead>
                            <TableHead>Клиент</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects?.map((item) => (
                            <ProjectRow data={item} key={item.id} />
                        ))}
                    </TableBody>
                </Table>
            )}

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
    );
};