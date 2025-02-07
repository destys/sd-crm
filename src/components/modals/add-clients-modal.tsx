import { useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CheckIcon, ChevronsUpDownIcon, Loader2, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { useProjects } from "@/hooks/use-projects";
import { useClientMutations } from "@/hooks/use-client";
import { Textarea } from "../ui/textarea";

// Схема валидации с Zod
const formSchema = z.object({
  title: z.string(),
  email: z.string().email(),
  phone: z.string(),
  notes: z.string(),
});

export const AddClientModal = () => {
  const { createClient } = useClientMutations();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({});

  const { data: projects, isLoading: isLoadingProjects } = useProjects(1, 5000);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      notes: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('values: ', values);
    try {
      setErrorMessage(null);
      setIsLoading(true);
      createClient(values);
    } catch (error) {
      console.log("error: ", error);
      setErrorMessage("Ошибка сохранения операции");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">

          {/* Имя */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя</FormLabel>
                <FormControl>
                  <Input placeholder="Введите описание" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Введите описание" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input placeholder="Введите телефон" mask="+7 (000) 000-00-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Заметки</FormLabel>
                <FormControl>
                  <Textarea placeholder="Введите описание" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Клиент */}
          <div className="space-y-2 grid">
            <FormLabel>Выберите проект</FormLabel>
            {isLoadingProjects ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                  >
                    {value
                      ? projects?.find((project) => project.id === value)?.title
                      : "Проекты..."}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Поиск проекта..." />
                    <CommandList>
                      <CommandEmpty>Проект не найден.</CommandEmpty>
                      <CommandGroup>
                        {projects?.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.id.toString()} // ✅ Передаём id как строку
                            onSelect={() => setValue(project.id)} // ✅ Храним полное id
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === project.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {project.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Сообщение об ошибке */}
          {errorMessage && (
            <Alert variant="destructive" className="gap-4">
              <AlertCircle className="size-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Кнопка сохранения */}
          <Button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>
        </form>
      </Form>
    </div>
  );
};