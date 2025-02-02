import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Функция форматирования цены
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const calculateTotal = (invoices: any[]): number => {
  return invoices.reduce((total, invoice) => {
      return invoice.type === 'income' ? total + invoice.amount : total - invoice.amount;
  }, 0);
};
