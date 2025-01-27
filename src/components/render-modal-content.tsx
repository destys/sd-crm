import { ReactNode } from "react";

import { ModalsWrapper } from "./modals/modals-wrapper";
import { AddClientModal } from "./modals/add-clients-modal";
import { ModalConfig } from "@/types/modal.types";
import { EditProjectsModal } from "./modals/edit-project-modal";

export const renderModalContent = (type: string, config?: ModalConfig): ReactNode => {
    switch (type) {
        case "addClientModal":
            return (
                <ModalsWrapper config={config || {}}>
                    <AddClientModal />
                </ModalsWrapper>
            );
        case "editProject":
            return (
                <ModalsWrapper config={config || {}}>
                    <EditProjectsModal />
                </ModalsWrapper>
            );
        default:
            return (
                <ModalsWrapper config={config || {}}>
                    <p>Modal type not found</p>
                </ModalsWrapper>
            );
    }
};
