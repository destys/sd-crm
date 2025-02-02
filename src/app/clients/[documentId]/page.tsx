import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useProject } from "@/hooks/use-project";
import { ProjectDetails } from "@/components/project/project-details";
import ProjectFinance from "@/components/project/project-finance";

export const ClientPage = () => {
    const { documentId } = useParams();

    //const { data, deleteProject, isLoading } = useProject(documentId);
    const { data, isLoading } = useProject(documentId || '');

    if (!data) {
        return null;
    }

    return (
        isLoading ? <Loader2Icon className="animate-spin" /> : (
            <div>
                <h1>Проект: {data.title}</h1>

                <Tabs defaultValue="details">
                    <TabsList>
                        <TabsTrigger value="tasks">Задачи</TabsTrigger>
                        <TabsTrigger value="details">Детали проекта</TabsTrigger>
                        <TabsTrigger value="finance">Финансы</TabsTrigger>
                        <TabsTrigger value="files">Файлы проекта</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tasks">Задачи проекта</TabsContent>
                    <TabsContent value="details">
                        <ProjectDetails data={data} />
                    </TabsContent>
                    <TabsContent value="finance">
                        <ProjectFinance data={data} />
                    </TabsContent>
                    <TabsContent value="files">Change your password here.</TabsContent>
                </Tabs>
            </div>
        )

    )
}
