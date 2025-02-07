import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ProjectItemProps } from "@/types/projects.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/projects`;

// 🔹 Получение одного клиента по ID
const fetchProjectById = async (documentId: string, token: string): Promise<ProjectItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(`${apiUrl}/${documentId}?populate=*`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
};

// 🔹 Хук `useProject` — получение одного клиента по ID
export const useProject = (documentId: string) => {
    const { token } = useAuth();
    return useQuery<ProjectItemProps, Error>({
        queryKey: ["project", documentId],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchProjectById(documentId, token);
        },
        enabled: !!token && !!documentId, // Запрос выполняется только если есть токен и ID клиента
    });
};

// 🔹 Создание нового клиента
const createProject = async ({
    projectData,
    token,
}: {
    projectData: Partial<ProjectItemProps>;
    token: string;
}): Promise<ProjectItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: projectData },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.data;
};

// 🔹 Обновление клиента
const updateProject = async ({
    documentId,
    updatedData,
    token,
}: {
    documentId: string;
    updatedData: Partial<ProjectItemProps>;
    token: string;
}): Promise<ProjectItemProps> => {
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
const deleteProject = async ({
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
export const useProjectMutations = () => {
    const { token } = useAuth();
    const queryProject = useQueryClient();

    const createProjectMutation = useMutation<ProjectItemProps, Error, Partial<ProjectItemProps>>({
        mutationFn: (projectData) => createProject({ projectData, token: token ?? "" }),
        onSuccess: (newProject) => {
            queryProject.setQueryData<ProjectItemProps[]>(["projects"], (oldProjects = []) => [...oldProjects, newProject]);
            queryProject.invalidateQueries({ queryKey: ["projects"] }); // Обновляем список клиентов
        },
    });

    const updateProjectMutation = useMutation<ProjectItemProps, Error, { documentId: string; updatedData: Partial<ProjectItemProps> }>({
        mutationFn: ({ documentId, updatedData }) => updateProject({ documentId, updatedData, token: token ?? "" }),
        onSuccess: (updatedProject) => {
            queryProject.setQueryData<ProjectItemProps>(["project", updatedProject.documentId], updatedProject);
            queryProject.invalidateQueries({ queryKey: ["projects"] }); // Обновляем список клиентов
        },
    });

    const deleteProjectMutation = useMutation<string, Error, string>({
        mutationFn: (documentId) => deleteProject({ documentId, token: token ?? "" }),
        onSuccess: (deletedDocumentId) => {
            queryProject.invalidateQueries({ queryKey: ["projects"] }); // Обновляем список клиентов
            queryProject.removeQueries({ queryKey: ["project", deletedDocumentId] }); // Удаляем кеш одного клиента
        },
    });

    return {
        createProject: createProjectMutation.mutate,
        updateProject: updateProjectMutation.mutate,
        deleteProject: deleteProjectMutation.mutate,
    };
};