import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@/context/auth-context";
import { Project } from "@/types/projects.types";
import { API_URL } from "@/constants";

const apiUrl = `${API_URL}/api/projects`;

// Запросы к API
const fetchProjects = async (token: string): Promise<Project[]> => {
    if (!token) throw new Error("Authentication token is missing");
    const response = await axios.get(apiUrl, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.data;
};

const createProject = async ({
    project,
    token,
}: {
    project: Project;
    token: string;
}): Promise<Project> => {
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
    updatedData: Partial<Project>;
    token: string;
}): Promise<Project> => {
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

// Хук `useProjects`
export const useProjects = () => {
    const { token } = useAuth();
    const queryClient = useQueryClient();

    const projectsQuery = useQuery<Project[], Error>({
        queryKey: ["projects"],
        queryFn: () => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return fetchProjects(token);
        },
        enabled: !!token, // Выполняем запрос только если есть токен
    });

    const createProjectMutation = useMutation<Project, Error, Project>({
        mutationFn: (project: Project) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return createProject({ project, token });
        },
        onSuccess: (newProject) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldProjects) => {
                return oldProjects ? [...oldProjects, newProject] : [newProject];
            });
        },
    });

    const updateProjectMutation = useMutation<Project, Error, { documentId: string; updatedData: Partial<Project> }>({
        mutationFn: ({ documentId, updatedData }: { documentId: string; updatedData: Partial<Project> }) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return updateProject({ documentId, updatedData, token });
        },
        onSuccess: (updatedProject) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldProjects) => {
                return oldProjects
                    ? oldProjects.map((project) =>
                        project.documentId === updatedProject.documentId ? updatedProject : project
                    )
                    : [];
            });
        },
    });

    const deleteProjectMutation = useMutation<string, Error, string>({
        mutationFn: (documentId: string) => {
            if (!token) return Promise.reject(new Error("Authentication token is missing"));
            return deleteProject({ documentId, token });
        },
        onSuccess: (deletedDocumentId) => {
            queryClient.setQueryData<Project[]>(["projects"], (oldProjects) => {
                return oldProjects ? oldProjects.filter((project) => project.documentId !== deletedDocumentId) : [];
            });
        },
    });

    return {
        data: projectsQuery.data,
        isLoading: projectsQuery.isLoading,
        isError: projectsQuery.isError,
        error: projectsQuery.error,
        fetchProjects: projectsQuery.refetch,
        createProject: createProjectMutation.mutate,
        updateProject: updateProjectMutation.mutate,
        deleteProject: deleteProjectMutation.mutate,
    };
};
