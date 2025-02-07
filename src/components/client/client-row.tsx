import { NavLink } from "react-router"
import { EyeIcon, Trash2Icon } from "lucide-react"

import { TableCell, TableRow } from "../ui/table"
import { Button } from "../ui/button"

import { useAlertDialog } from "@/context/alert-dialog-context"
import { useClientMutations } from "@/hooks/use-client"
import { ClientItemProps } from "@/types/clients.types"

export const ClientRow = ({ data }: { data: ClientItemProps }) => {
    const { deleteClient } = useClientMutations();


    const { showConfirmation } = useAlertDialog();


    const handleDelete = async (projectId: string) => {
        const confirmed = await showConfirmation({
            title: "Удаление клиента",
            description: "Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.",
            confirmLabel: "Удалить",
            cancelLabel: "Отмена",
        });

        if (confirmed) {
            deleteClient(projectId);
        }
    }


    return (
        <TableRow>
            <TableCell className="font-medium">{data.id - 1}</TableCell>
            <TableCell>{data.title}</TableCell>
            <TableCell>{data.email}</TableCell>
            <TableCell className="text-right">{data.phone}</TableCell>
            <TableCell className="text-right flex gap-2 justify-end">
                <NavLink to={`/clients/${data.documentId}`}>
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
