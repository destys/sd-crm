import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { IncomeItemProps } from "@/types/incomes.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/incomes`;

// 🔹 Получение одного дохода по ID
const fetchIncomeById = async (documentId: string, token: string): Promise<IncomeItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}/${documentId}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// 🔹 Создание нового дохода
const createIncome = async ({
    income,
    token,
}: {
    income: Partial<IncomeItemProps>;
    token: string;
}): Promise<IncomeItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: income },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Хук `useIncome` — получение одного дохода по ID
export const useIncome = (documentId: string) => {
    const { token } = useAuth();
    return useQuery<IncomeItemProps, Error>({
        queryKey: ["income", documentId],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchIncomeById(documentId, token);
        },
        enabled: !!token && !!documentId, // Запрос выполняется только если есть токен и ID дохода
    });
};

// 🔹 Обновление одного дохода
const updateIncome = async ({
    documentId,
    updatedData,
    token,
}: {
    documentId: string;
    updatedData: Partial<IncomeItemProps>;
    token: string;
}): Promise<IncomeItemProps> => {
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
const deleteIncome = async ({
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
export const useIncomeMutations = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const createIncomeMutation = useMutation<IncomeItemProps, Error, Partial<IncomeItemProps>>({
        mutationFn: (income) => createIncome({ income, token: token ?? "" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["incomes"] }); // Обновляем список доходов
        },
    });

    const updateIncomeMutation = useMutation<IncomeItemProps, Error, { documentId: string; updatedData: Partial<IncomeItemProps> }>({
        mutationFn: ({ documentId, updatedData }) => updateIncome({ documentId, updatedData, token: token ?? "" }),
        onSuccess: (updatedIncome) => {
            queryClient.setQueryData<IncomeItemProps>(["income", updatedIncome.documentId], updatedIncome);
            queryClient.invalidateQueries({ queryKey: ["incomes"] }); // Обновляем список доходов
        },
    });

    const deleteIncomeMutation = useMutation<string, Error, string>({
        mutationFn: (documentId) => deleteIncome({ documentId, token: token ?? "" }),
        onSuccess: (deletedDocumentId) => {
            queryClient.invalidateQueries({ queryKey: ["incomes"] }); // Обновляем список доходов
            queryClient.removeQueries({ queryKey: ["income", deletedDocumentId] }); // Удаляем кеш одного дохода
        },
    });

    return {
        createIncome: createIncomeMutation.mutate,
        updateIncome: updateIncomeMutation.mutate,
        deleteIncome: deleteIncomeMutation.mutate,
    };
};
