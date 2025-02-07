import { ReactNode } from "react";

import { ModalsWrapper } from "./modals/modals-wrapper";
import { AddClientModal } from "./modals/add-clients-modal";
import { ModalConfig } from "@/types/modal.types";
import { AddProjectModal } from "./modals/add-project-modal";
import { AddFinanceModal } from "./modals/add-finance-modal";

export const renderModalContent = (type: string, config?: ModalConfig): ReactNode => {
    switch (type) {
        case "addClientModal":
            return (
                <ModalsWrapper config={config || {}}>
                    <AddClientModal />
                </ModalsWrapper>
            );
        case "addProjectModal":
            return (
                <ModalsWrapper config={config || {}}>
                    <AddProjectModal />
                </ModalsWrapper>
            );
        case "addFinanceModal":
            return (
                <ModalsWrapper config={config || {}}>
                    <AddFinanceModal />
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
