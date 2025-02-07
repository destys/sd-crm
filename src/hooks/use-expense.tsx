import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ExpenseItemProps } from "@/types/expenses.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/expenses`;

// 🔹 Получение одного дохода по ID
const fetchExpenseById = async (documentId: string, token: string): Promise<ExpenseItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}/${documentId}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// 🔹 Создание нового дохода
const createExpense = async ({
    expense,
    token,
}: {
    expense: Partial<ExpenseItemProps>;
    token: string;
}): Promise<ExpenseItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: expense },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Хук `useExpense` — получение одного дохода по ID
export const useExpense = (documentId: string) => {
    const { token } = useAuth();
    return useQuery<ExpenseItemProps, Error>({
        queryKey: ["expense", documentId],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchExpenseById(documentId, token);
        },
        enabled: !!token && !!documentId, // Запрос выполняется только если есть токен и ID дохода
    });
};

// 🔹 Обновление одного дохода
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
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Удаление одного дохода
const deleteExpense = async ({
    documentId,
    token,
}: {
    documentId: string;
    token: string;
}): Promise<string> => {
    if (!token) throw new Error("Authentication token is missing");
    await axios.delete(`${apiUrl}/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return documentId;
};

// 🔹 Хук для создания, обновления и удаления одного дохода
export const useExpenseMutations = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const createExpenseMutation = useMutation<ExpenseItemProps, Error, Partial<ExpenseItemProps>>({
        mutationFn: (expense) => createExpense({ expense, token: token ?? "" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Обновляем список доходов
        },
    });

    const updateExpenseMutation = useMutation<ExpenseItemProps, Error, { documentId: string; updatedData: Partial<ExpenseItemProps> }>({
        mutationFn: ({ documentId, updatedData }) => updateExpense({ documentId, updatedData, token: token ?? "" }),
        onSuccess: (updatedExpense) => {
            queryClient.setQueryData<ExpenseItemProps>(["expense", updatedExpense.documentId], updatedExpense);
            queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Обновляем список доходов
        },
    });

    const deleteExpenseMutation = useMutation<string, Error, string>({
        mutationFn: (documentId) => deleteExpense({ documentId, token: token ?? "" }),
        onSuccess: (deletedDocumentId) => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] }); // Обновляем список доходов
            queryClient.removeQueries({ queryKey: ["expense", deletedDocumentId] }); // Удаляем кеш одного дохода
        },
    });

    return {
        createExpense: createExpenseMutation.mutate,
        updateExpense: updateExpenseMutation.mutate,
        deleteExpense: deleteExpenseMutation.mutate,
    };
};
