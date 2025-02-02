import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { ProjectItemProps } from "@/types/projects.types";
import { projectStatuses } from "@/constants";
import { Textarea } from "../ui/textarea";
import { useProjectMutations } from "@/hooks/use-project";

// Схема валидации с Zod
const formSchema = z.object({
    title: z.string().min(3, { message: "Название проекта должно содержать минимум 3 символа." }),
    budget: z.number(),
    client: z.object({
        id: z.number(),
        documentId: z.string(),
        title: z.string(),
    }).nullable(),
    description: z.string(),
    project_status: z.any(),
    start_date: z.date(),
    end_date: z.date(),
});

export const ProjectDetails = ({ data }: { data: ProjectItemProps }) => {
    console.log('data: ', data);
    const { updateProject } = useProjectMutations();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: data.title || "",
            budget: data.budget || 0,
            client: data.client || null,
            description: data.description || "",
            project_status: data.project_status,
            start_date: data.start_date,
            end_date: data.end_date,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setErrorMessage(null);
            setIsLoading(true);

            updateProject(
                { documentId: data.documentId, updatedData: values },
                {
                    onSuccess: () => console.log("Проект успешно обновлен"),
                    onError: (error) => setErrorMessage(error.message),
                }
            );
        } catch (error) {
            console.log('error: ', error);
            setErrorMessage("Ошибка сохранения проекта");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 p-6 bg-white shadow-md rounded-lg">

                {/* Название проекта */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название проекта</FormLabel>
                            <FormControl>
                                <Input placeholder="Введите название проекта" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                {/* Статус проекта */}
                <FormField
                    control={form.control}
                    name="project_status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Статус проекта</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {projectStatuses.map((status, index) => (
                                        <SelectItem key={index} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Даты начала и конца проекта*/}
                <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Дата начала проекта</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Дата окончания проекта</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>


                {/* Бюджет */}
                <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Бюджет</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Введите бюджет"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Описание проекта */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание проекта</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Введите описание проекта" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Клиент */}
                <FormField
                    control={form.control}
                    name="client"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Клиент</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Введите клиента"
                                    value={field.value?.title || ""}
                                    onChange={(e) =>
                                        field.onChange({ ...field.value, title: e.target.value })
                                    }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Сообщение об ошибке */}
                {errorMessage && (
                    <Alert variant="destructive" className="gap-4">
                        <AlertCircle className="size-4" />
                        <AlertTitle>Ошибка</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                {/* Кнопка сохранения */}
                <Button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2 col-span-2">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isLoading ? "Сохранение..." : "Сохранить"}
                </Button>
            </form>
        </Form>
    );
};