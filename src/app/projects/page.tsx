import { ProjectsList } from "@/components/projects-list"
import { Button } from "@/components/ui/button";
import { useModal } from "@/context/modal-context";
import { PlusCircleIcon } from "lucide-react";

export const ProjectsPage = () => {
    const { openModal, closeModal } = useModal();

    const handleEditProfileClick = () => {
        openModal("addProjectModal", {
            title: "Добавить нового клиента",
            footer: <>
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="destructive" onClick={closeModal}>Закрыть</Button>
            </>,
        });
    };

    return (
        <div>

            <h1>Проекты</h1>
            <div className="flex gap-3 mb-4">
                <Button onClick={handleEditProfileClick}>
                    <PlusCircleIcon />
                    Добавить проект
                </Button>
            </div>
            <ProjectsList />
        </div>
    )
}
