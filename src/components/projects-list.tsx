import { EyeIcon, Loader2, PhoneOutgoingIcon, Trash2Icon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

import { useAlertDialog } from "@/context/alert-dialog-context";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

export const ProjectsList = () => {
    const { data, deleteProject, isLoading } = useProjects();

    const { showConfirmation } = useAlertDialog();

    const statusVariants: Record<string, 'outline' | 'waiting' | 'default' | 'secondary'> = {
        'В очереди': 'waiting',
        'В работе': 'default',
        'Завершен': 'secondary',
    };

    const handleDelete = async (projectId: string) => {
        const confirmed = await showConfirmation({
            title: "Удаление проекта",
            description: "Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.",
            confirmLabel: "Удалить",
            cancelLabel: "Отмена",
        });

        if (confirmed) {
            deleteProject(projectId);
        }
    };

    return (
        <div>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-96 w-full">
                    <Loader2 className="animate-spin" />
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
                        {data?.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="text-xs lg:text-lg font-bold">{item.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {item.client ? (
                                            <>
                                                <a href={`tel:${item.client.phone}`} className="flex items-center gap-2 text-sm">
                                                    <PhoneOutgoingIcon className="flex-shrink-0 basis-4 size-4" />
                                                    <span className="hidden lg:block">{item.client.phone}</span>
                                                </a>

                                                <a href={`https://wa.me/${item.client.phone?.replace(/[^+\d]/g, '')}`} target="_blank" className="flex-shrink-0 basis-4">
                                                    <img src="/whatsapp.png" alt="whatsapp" className="size-4" />
                                                </a>
                                                <a href={`https://t.me/${item.client.phone?.replace(/[^+\d]/g, '')}`} target="_blank" className="flex-shrink-0 basis-4">
                                                    <img src="/telegram.png" alt="telegram" className="size-4" />
                                                </a>
                                            </>
                                        ) : <p>Клиент не задан</p>}

                                    </div>
                                </TableCell>
                                <TableCell>
                                    {item.client && (
                                        <NavLink to={`/clients/${item.client.documentId}`} className="flex gap-4 items-center">
                                            <Avatar>
                                                {item.client.avatar && <AvatarImage src="https://github.com/shadcn.png" />}
                                                <AvatarFallback className="font-bold">{item.client.title[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="hidden lg:block font-bold">{item.client.title}</span>
                                        </NavLink>
                                    )}

                                </TableCell>
                                <TableCell>
                                    <Badge variant={statusVariants[item.project_status] || 'outline'}>
                                        {item.project_status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <NavLink to={`/projects/${item.documentId}`}>
                                        <Button
                                            variant="default"
                                        >
                                            <EyeIcon className="size-4" />
                                        </Button>
                                    </NavLink>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(item.documentId)}
                                    >
                                        <Trash2Icon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};