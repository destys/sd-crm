import { useParams } from "react-router";
import { Loader2Icon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useClient } from "@/hooks/use-client";

export const ClientPage = () => {
    const { documentId } = useParams();

    //const { data, deleteProject, isLoading } = useProject(documentId);
    const { data, isLoading } = useClient(documentId || '');

    if (!data) {
        return null;
    }

    return (
        isLoading ? <Loader2Icon className="animate-spin" /> : (
            <div>
                <h1>Клиент: {data.title}</h1>

                <Tabs defaultValue="info">
                    <TabsList>
                        <TabsTrigger value="info">Информация</TabsTrigger>
                        <TabsTrigger value="projects">Проекты</TabsTrigger>
                        <TabsTrigger value="requisites">Реквизиты</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">Задачи проекта</TabsContent>
                    <TabsContent value="projects">
                        {/* <ProjectDetails data={data} /> */}
                    </TabsContent>
                    <TabsContent value="requisites">
                        {/* <ProjectFinance data={data} /> */}
                    </TabsContent>
                </Tabs>
            </div>
        )

    )
}
