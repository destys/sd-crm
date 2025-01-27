import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ModalConfig } from "@/types/modal.types";
import { ReactNode } from "react";

export const ModalsWrapper: React.FC<{ config: ModalConfig; children: ReactNode }> = ({ config, children }) => {
    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{config?.title || "Default Title"}</DialogTitle>
                {config?.description && <DialogDescription>{config?.description}</DialogDescription>}
            </DialogHeader>
            <div className="py-4">{children}</div>
            {config?.footer && <DialogFooter>{config.footer}</DialogFooter>}
        </DialogContent>
    );
};