import React, { createContext, useContext, useState, ReactNode } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AlertDialogContextProps {
    showConfirmation: (options: AlertDialogOptions) => Promise<boolean>;
}

interface AlertDialogOptions {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
}

const AlertDialogContext = createContext<AlertDialogContextProps | undefined>(undefined);

export const AlertDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<AlertDialogOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

    const showConfirmation = (options: AlertDialogOptions): Promise<boolean> => {
        setOptions(options);
        setIsOpen(true);

        return new Promise((resolve) => {
            setResolvePromise(() => resolve);
        });
    };

    const handleConfirm = () => {
        if (resolvePromise) resolvePromise(true);
        setIsOpen(false);
        setOptions(null);
    };

    const handleCancel = () => {
        if (resolvePromise) resolvePromise(false);
        setIsOpen(false);
        setOptions(null);
    };

    return (
        <AlertDialogContext.Provider value={{ showConfirmation }}>
            {children}
            {options && (
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{options.title}</AlertDialogTitle>
                            <AlertDialogDescription>{options.description}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCancel}>
                                {options.cancelLabel || "Cancel"}
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm}>
                                {options.confirmLabel || "Confirm"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AlertDialogContext.Provider>
    );
};

export const useAlertDialog = (): AlertDialogContextProps => {
    const context = useContext(AlertDialogContext);
    if (!context) {
        throw new Error("useAlertDialog must be used within a AlertDialogProvider");
    }
    return context;
};

// Example usage in a component
export const ExampleComponent = () => {
    const { showConfirmation } = useAlertDialog();

    const handleDelete = async () => {
        const confirmed = await showConfirmation({
            title: "Are you sure?",
            description: "This action cannot be undone.",
            confirmLabel: "Delete",
            cancelLabel: "Cancel",
        });

        if (confirmed) {
            console.log("User confirmed the action.");
            // Add your delete logic here
        } else {
            console.log("User cancelled the action.");
        }
    };

    return <button onClick={handleDelete}>Delete Item</button>;
};
