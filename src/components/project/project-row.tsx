import { NavLink } from "react-router";
import { EyeIcon, PhoneOutgoingIcon, Trash2Icon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";

import { useProjectMutations } from "@/hooks/use-project";
import { useAlertDialog } from "@/context/alert-dialog-context";
import { ProjectItemProps } from "@/types/projects.types";



export const ProjectRow = ({ data }: { data: ProjectItemProps }) => {
    const { deleteProject } = useProjectMutations();


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
        <TableRow>
            <TableCell className="font-medium">{data.id - 1}</TableCell>
            <TableCell className="text-xs lg:text-lg font-bold">{data.title}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {data.client ? (
                        <>
                            <a href={`tel:${data.client.phone}`} className="flex items-center gap-2 text-sm">
                                <PhoneOutgoingIcon className="flex-shrink-0 basis-4 size-4" />
                                <span className="hidden lg:block">{data.client.phone}</span>
                            </a>

                            <a href={`https://wa.me/${data.client.phone?.replace(/[^+\d]/g, '')}`} target="_blank" className="flex-shrink-0 basis-4">
                                <img src="/whatsapp.png" alt="whatsapp" className="size-4" />
                            </a>
                            <a href={`https://t.me/${data.client.phone?.replace(/[^+\d]/g, '')}`} target="_blank" className="flex-shrink-0 basis-4">
                                <img src="/telegram.png" alt="telegram" className="size-4" />
                            </a>
                        </>
                    ) : <p>Клиент не задан</p>}

                </div>
            </TableCell>
            <TableCell>
                {data.client && (
                    <NavLink to={`/clients/${data.client.documentId}`} className="flex gap-4 items-center">
                        <Avatar>
                            {data.client.avatar && <AvatarImage src="https://github.com/shadcn.png" />}
                            <AvatarFallback className="font-bold">{data.client.title[0]}</AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:block font-bold">{data.client.title}</span>
                    </NavLink>
                )}

            </TableCell>
            <TableCell>
                <Badge variant={statusVariants[data.project_status] || 'outline'}>
                    {data.project_status || "Не задано"}
                </Badge>
            </TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
                <NavLink to={`/projects/${data.documentId}`}>
                    <Button
                        variant="default"
                    >
                        <EyeIcon className="size-4" />
                    </Button>
                </NavLink>
                <Button
                    variant="destructive"
                    onClick={() => handleDelete(data.documentId)}
                >
                    <Trash2Icon />
                </Button>
            </TableCell>
        </TableRow>
    )
}
