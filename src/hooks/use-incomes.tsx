import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { IncomeItemProps } from "@/types/incomes.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/incomes`;

// Запросы к API
const fetchIncomes = async (token: string): Promise<IncomeItemProps[]> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}?populate=*`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

const createIncome = async ({
    income,
    token,
}: {
    income: IncomeItemProps;
    token: string;
}): Promise<IncomeItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: income },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

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
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

const deleteIncome = async ({
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

// Хук `useIncomes`
export const useIncomes = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const incomesQuery = useQuery<IncomeItemProps[], Error>({
        queryKey: ["incomes"],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchIncomes(token);
        },
        enabled: !!token, // Выполняем запрос только если есть токен
    });

    const createIncomeMutation = useMutation<IncomeItemProps, Error, IncomeItemProps>({
        mutationFn: (income: IncomeItemProps) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return createIncome({ income, token });
        },
        onSuccess: (newIncome) => {
            queryClient.setQueryData<IncomeItemProps[]>(["incomes"], (oldIncomes) => {
                return oldIncomes ? [...oldIncomes, newIncome] : [newIncome];
            });
        },
    });

    const updateIncomeMutation = useMutation<IncomeItemProps, Error, { documentId: string; updatedData: Partial<IncomeItemProps> }>({
        mutationFn: ({ documentId, updatedData }: { documentId: string; updatedData: Partial<IncomeItemProps> }) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return updateIncome({ documentId, updatedData, token });
        },
        onSuccess: (updatedIncome) => {
            queryClient.setQueryData<IncomeItemProps[]>(["incomes"], (oldIncomes) => {
                return oldIncomes
                    ? oldIncomes.map((income) =>
                        income.documentId === updatedIncome.documentId ? updatedIncome : income
                    )
                    : [];
            });
        },
    });

    const deleteIncomeMutation = useMutation<string, Error, string>({
        mutationFn: (documentId: string) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return deleteIncome({ documentId, token });
        },
        onSuccess: (deletedDocumentId) => {
            queryClient.setQueryData<IncomeItemProps[]>(["incomes"], (oldIncomes) => {
                return oldIncomes ? oldIncomes.filter((income) => income.documentId !== deletedDocumentId) : [];
            });
        },
    });

    return {
        data: incomesQuery.data,
        isLoading: incomesQuery.isLoading,
        isError: incomesQuery.isError,
        error: incomesQuery.error,
        fetchIncomes: incomesQuery.refetch,
        createIncome: createIncomeMutation.mutate,
        updateIncome: updateIncomeMutation.mutate,
        deleteIncome: deleteIncomeMutation.mutate,
    };
};
