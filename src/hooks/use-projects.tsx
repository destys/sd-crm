import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { ProjectItemProps } from "@/types/projects.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/projects`;

// Запросы к API с пагинацией
const fetchProjects = async ({ token, page = 1, pageSize = 10 }: { token: string; page?: number; pageSize?: number }): Promise<{ data: ProjectItemProps[]; total: number; }> => {
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

const createProject = async ({
    project,
    token,
}: {
    project: ProjectItemProps;
    token: string;
}): Promise<ProjectItemProps> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.post(
        apiUrl,
        { data: project },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

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
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data.data;
};

const deleteProject = async ({
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

// Хук `useProjects` с пагинацией
export const useProjects = (page: number, pageSize: number) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const projectsQuery = useQuery<{ data: ProjectItemProps[]; total: number }, Error>({
        queryKey: ["projects", page, pageSize],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchProjects({ token, page, pageSize });
        },
        enabled: !!token, // Выполняем запрос только если есть токен
    });

    const createProjectMutation = useMutation<ProjectItemProps, Error, ProjectItemProps>({
        mutationFn: (project: ProjectItemProps) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return createProject({ project, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", page, pageSize] });
        },
    });

    const updateProjectMutation = useMutation<ProjectItemProps, Error, { documentId: string; updatedData: Partial<ProjectItemProps> }>({
        mutationFn: ({ documentId, updatedData }: { documentId: string; updatedData: Partial<ProjectItemProps> }) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return updateProject({ documentId, updatedData, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", page, pageSize] });
        },
    });

    const deleteProjectMutation = useMutation<string, Error, string>({
        mutationFn: (documentId: string) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return deleteProject({ documentId, token });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects", page, pageSize] });
        },
    });

    return {
        data: projectsQuery.data?.data,
        total: projectsQuery.data?.total,
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        fetchProjects: projectsQuery.refetch,
        createProject: createProjectMutation.mutate,
        updateProject: updateProjectMutation.mutate,
        deleteProject: deleteProjectMutation.mutate,
    };
};