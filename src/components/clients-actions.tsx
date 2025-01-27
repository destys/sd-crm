import { useModal } from "@/context/modal-context";
import { Button } from "./ui/button"
import { PlusCircleIcon } from "lucide-react";

export const ClientsActions = () => {
    const { openModal, closeModal } = useModal();

    const handleEditProfileClick = () => {
        openModal("addClientModal", {
            title: "Добавить нового клиента",
            footer: <>
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="destructive" onClick={closeModal}>Закрыть</Button>
            </>,
        });
    };


    return (
        <div className="flex gap-3 mb-4">
            <Button onClick={handleEditProfileClick}>
                <PlusCircleIcon />
                Добавить клиента
            </Button>
        </div>
    )
}
