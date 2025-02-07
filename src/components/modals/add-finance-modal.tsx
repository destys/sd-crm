import { useState } from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, CalendarIcon, CheckIcon, ChevronsUpDownIcon, Loader2, Loader2Icon } from "lucide-react";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { paymentMethods } from "@/constants";
import { useProjects } from "@/hooks/use-projects";
import { useIncomeMutations } from "@/hooks/use-income";
import { useExpenseMutations } from "@/hooks/use-expense";

// Схема валидации с Zod
const formSchema = z.object({
  description: z.string(),
  amount: z.coerce.number(),
  date: z.date(),
  payment_method: z.enum(paymentMethods),
});

export const AddFinanceModal = () => {
  const { createIncome } = useIncomeMutations();
  const { createExpense } = useExpenseMutations();

  const [operationType, setOperationType] = useState<"incomes" | "expenses">("incomes"); // ✅ Убрали из формы
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(null); // ✅ Храним только id или null


  const { data: projects, isLoading: isLoadingProjects } = useProjects(1, 5000);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      amount: 0,
      payment_method: paymentMethods[0],
      date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setErrorMessage(null);
      setIsLoading(true);

      const selectedProject = projects?.find((project) => project.id - 1 === value);
      const requestData = {
        ...values,
        project: selectedProject ? { ...selectedProject } : null,
      };

      if (operationType === "incomes") {
        createIncome(requestData, {
          onSuccess: () => console.log("Доход успешно создан"),
          onError: (error) => setErrorMessage(error.message),
        });
      } else {
        createExpense(requestData, {
          onSuccess: () => console.log("Расход успешно создан"),
          onError: (error) => setErrorMessage(error.message),
        });
      }
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

          {/* Тип операции (не участвует в useForm) */}
          <FormItem>
            <FormLabel>Тип операции</FormLabel>
            <Select onValueChange={(value) => setOperationType(value as "incomes" | "expenses")} defaultValue={operationType}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип операции" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="incomes">Приход</SelectItem>
                <SelectItem value="expenses">Расход</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {/* Комментарий */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Input placeholder="Введите описание" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Цена */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сумма</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Введите цену"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Способ оплаты */}
          <FormField
            control={form.control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Способ оплаты</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите способ оплаты" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentMethods.map((status, index) => (
                      <SelectItem key={index} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Дата */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Дата</FormLabel>
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
                          <span>Выберите дату</span>
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
                    {value !== null
                      ? projects?.find((project) => project.id === Number(value))?.title || "Выберите проект"
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
                            value={project.id.toString()} // ✅ Приводим id к строке
                            onSelect={() => setValue(project.id)} // ✅ Сохраняем id в состояние
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