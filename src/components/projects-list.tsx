import { EditIcon, EyeIcon, Loader2, Trash2Icon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/use-projects";

import { useModal } from "@/context/modal-context";
import { useAlertDialog } from "@/context/alert-dialog-context";
import { NavLink } from "react-router";

export const ProjectsList = () => {
    const { data, deleteProject, isLoading } = useProjects();
    const { openModal } = useModal();
    const { showConfirmation } = useAlertDialog();

    const handleEdit = (projectId: string) => {
        const project = data?.find((item) => item.documentId === projectId);
        if (project) {
            openModal("editProject", {
                title: "Редактирование проекта",
                description: "Измените данные проекта и сохраните изменения.",
                content: (
                    <div>
                        {/* Форма редактирования проекта */}
                        <p>Здесь будет форма редактирования для проекта {project.title}</p>
                    </div>
                ),
                footer: (
                    <Button onClick={() => console.log("Save changes")}>Сохранить изменения</Button>
                ),
            });
        }
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
            <h1>Проекты</h1>

            {isLoading ? (
                <div className="flex justify-center items-center min-h-96 w-full">
                    <Loader2 className="animate-spin" />
                </div>
            ) : (
                <Table>
                    <TableCaption>Список ваших проектов.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">#</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data?.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right flex gap-2 justify-end">
                                    <NavLink to={`/projects/${item.documentId}`}>
                                        <Button
                                            variant="default"
                                        >
                                            <EyeIcon className="size-4" />
                                        </Button>
                                    </NavLink>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleEdit(item.documentId)}
                                    >
                                        <EditIcon className="size-4" />
                                    </Button>
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