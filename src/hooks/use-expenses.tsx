import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ExpenseItemProps } from "@/types/expenses.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/expenses`;

// Запросы к API
const fetchExpenses = async (token: string): Promise<ExpenseItemProps[]> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}?populate=*`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

const createExpense = async ({
    expense,
    token,
}: {
    expense: ExpenseItemProps;
    token: string;
}): Promise<ExpenseItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: expense },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

const updateExpense = async ({
    documentId,
    updatedData,
    token,
}: {
    documentId: string;
    updatedData: Partial<ExpenseItemProps>;
    token: string;
}): Promise<ExpenseItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.put(
        `${apiUrl}/${documentId}`,
        { data: updatedData },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

const deleteExpense = async ({
    documentId,
    token,
}: {
    documentId: string;
    token: string;
}): Promise<string> => {
    if (!token) throw new Error("Authentication token is missing");
    await axios.delete(`${apiUrl}/${documentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return documentId;
};

// Хук `useExpenses`
export const useExpenses = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const expensesQuery = useQuery<ExpenseItemProps[], Error>({
        queryKey: ["expenses"],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchExpenses(token);
        },
        enabled: !!token, // Выполняем запрос только если есть токен
    });

    const createExpenseMutation = useMutation<ExpenseItemProps, Error, ExpenseItemProps>({
        mutationFn: (expense: ExpenseItemProps) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return createExpense({ expense, token });
        },
        onSuccess: (newExpense) => {
            queryClient.setQueryData<ExpenseItemProps[]>(["expenses"], (oldExpenses) => {
                return oldExpenses ? [...oldExpenses, newExpense] : [newExpense];
            });
        },
    });

    const updateExpenseMutation = useMutation<ExpenseItemProps, Error, { documentId: string; updatedData: Partial<ExpenseItemProps> }>({
        mutationFn: ({ documentId, updatedData }: { documentId: string; updatedData: Partial<ExpenseItemProps> }) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return updateExpense({ documentId, updatedData, token });
        },
        onSuccess: (updatedExpense) => {
            queryClient.setQueryData<ExpenseItemProps[]>(["expenses"], (oldExpenses) => {
                return oldExpenses
                    ? oldExpenses.map((expense) =>
                        expense.documentId === updatedExpense.documentId ? updatedExpense : expense
                    )
                    : [];
            });
        },
    });

    const deleteExpenseMutation = useMutation<string, Error, string>({
        mutationFn: (documentId: string) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return deleteExpense({ documentId, token });
        },
        onSuccess: (deletedDocumentId) => {
            queryClient.setQueryData<ExpenseItemProps[]>(["expenses"], (oldExpenses) => {
                return oldExpenses ? oldExpenses.filter((expense) => expense.documentId !== deletedDocumentId) : [];
            });
        },
    });

    return {
        data: expensesQuery.data,
        isLoading: expensesQuery.isLoading,
        isError: expensesQuery.isError,
        error: expensesQuery.error,
        fetchExpenses: expensesQuery.refetch,
        createExpense: createExpenseMutation.mutate,
        updateExpense: updateExpenseMutation.mutate,
        deleteExpense: deleteExpenseMutation.mutate,
    };
};