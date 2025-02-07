import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ClientItemProps } from "@/types/clients.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/clients`;

// Запросы к API с пагинацией
const fetchClients = async ({ token, page = 1, pageSize = 10 }: { token: string; page?: number; pageSize?: number }): Promise<{ data: ClientItemProps[]; total: number; }> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return {
        data: response.data.data,
        total: response.data.meta.pagination.total,
    };
};

const createClient = async ({
    client,
    token,
}: {
    client: ClientItemProps;
    token: string;
}): Promise<ClientItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: client },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

const updateClient = async ({
    documentId,
    updatedData,
    token,
}: {
    documentId: string;
    updatedData: Partial<ClientItemProps>;
    token: string;
}): Promise<ClientItemProps> => {
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

const deleteClient = async ({
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

// Хук `useClients` с пагинацией
export const useClients = (page: number, pageSize: number) => {
    const { token } = useAuth();
    const queryClient = useQueryClient(); 

    const clientsQuery = useQuery<{ data: ClientItemProps[]; total: number }, Error>({
        queryKey: ["clients", page, pageSize],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchClients({ token, page, pageSize });
        },
        enabled: !!token, // Выполняем запрос только если есть токен
    });

    const createClientMutation = useMutation<ClientItemProps, Error, ClientItemProps>({
        mutationFn: (client: ClientItemProps) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return createClient({ client, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", page, pageSize] });
        },
    });

    const updateClientMutation = useMutation<ClientItemProps, Error, { documentId: string; updatedData: Partial<ClientItemProps> }>({
        mutationFn: ({ documentId, updatedData }: { documentId: string; updatedData: Partial<ClientItemProps> }) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return updateClient({ documentId, updatedData, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", page, pageSize] });
        },
    });

    const deleteClientMutation = useMutation<string, Error, string>({
        mutationFn: (documentId: string) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return deleteClient({ documentId, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients", page, pageSize] });
        },
    });

    return {
        data: clientsQuery.data?.data,
        total: clientsQuery.data?.total,
        isLoading: clientsQuery.isLoading,
        isError: clientsQuery.isError,
        error: clientsQuery.error,
        fetchClients: clientsQuery.refetch,
        createClient: createClientMutation.mutate,
        updateClient: updateClientMutation.mutate,
        deleteClient: deleteClientMutation.mutate,
    };
};
