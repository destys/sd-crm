import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dialog } from "@/components/ui/dialog";
import { renderModalContent } from "@/components/render-modal-content";

interface ModalConfig {
    title?: string;
    description?: string;
    content?: ReactNode;
    footer?: ReactNode;
}

interface ModalContextProps {
    openModal: (type: string, config?: ModalConfig, data?: never) => void;
    closeModal: () => void;
}


const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, setModalType] = useState<string | null>(null);
    const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

    const openModal = (type: string, config?: ModalConfig) => {
        setModalType(type);
        setModalConfig(config || null);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setModalType(null);
        setModalConfig(null);
    };

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {isOpen && modalType && (
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    {renderModalContent(modalType, modalConfig || undefined)}
                </Dialog>
            )}
        </ModalContext.Provider>
    );
};

export const useModal = (): ModalContextProps => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};