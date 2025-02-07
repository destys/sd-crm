import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ClientItemProps } from "@/types/clients.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/clients`;

// 🔹 Получение одного клиента по ID
const fetchClientById = async (documentId: string, token: string): Promise<ClientItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}/${documentId}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// 🔹 Хук `useClient` — получение одного клиента по ID
export const useClient = (documentId: string) => {
    const { token } = useAuth();
    return useQuery<ClientItemProps, Error>({
        queryKey: ["client", documentId],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchClientById(documentId, token);
        },
        enabled: !!token && !!documentId, // Запрос выполняется только если есть токен и ID клиента
    });
};

// 🔹 Создание нового клиента
const createClient = async ({
    clientData,
    token,
}: {
    clientData: Partial<ClientItemProps>;
    token: string;
}): Promise<ClientItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: clientData },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Обновление клиента
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
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Удаление клиента
const deleteClient = async ({
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

// 🔹 Хук для создания, обновления и удаления клиента
export const useClientMutations = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const createClientMutation = useMutation<ClientItemProps, Error, Partial<ClientItemProps>>({
        mutationFn: (clientData) => createClient({ clientData, token: token ?? "" }),
        onSuccess: (newClient) => {
            queryClient.setQueryData<ClientItemProps[]>(["clients"], (oldClients = []) => [...oldClients, newClient]);
            queryClient.invalidateQueries({ queryKey: ["clients"] }); // Обновляем список клиентов
        },
    });

    const updateClientMutation = useMutation<ClientItemProps, Error, { documentId: string; updatedData: Partial<ClientItemProps> }>({
        mutationFn: ({ documentId, updatedData }) => updateClient({ documentId, updatedData, token: token ?? "" }),
        onSuccess: (updatedClient) => {
            queryClient.setQueryData<ClientItemProps>(["client", updatedClient.documentId], updatedClient);
            queryClient.invalidateQueries({ queryKey: ["clients"] }); // Обновляем список клиентов
        },
    });

    const deleteClientMutation = useMutation<string, Error, string>({
        mutationFn: (documentId) => deleteClient({ documentId, token: token ?? "" }),
        onSuccess: (deletedDocumentId) => {
            queryClient.invalidateQueries({ queryKey: ["clients"] }); // Обновляем список клиентов
            queryClient.removeQueries({ queryKey: ["client", deletedDocumentId] }); // Удаляем кеш одного клиента
        },
    });

    return {
        createClient: createClientMutation.mutate,
        updateClient: updateClientMutation.mutate,
        deleteClient: deleteClientMutation.mutate,
    };
};