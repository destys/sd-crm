/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { IMaskInput, IMaskInputProps } from "react-imask";

import { cn } from "@/lib/utils";

// Обновленный интерфейс для поддержки IMaskInput
interface InputProps extends Omit<React.ComponentProps<"input">, "mask"> {
  mask?: IMaskInputProps<HTMLInputElement>["mask"];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, mask, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };

    // ✅ Если передана маска, используем `IMaskInput`
    if (mask) {
      return (
        <div className="relative">
          <IMaskInput
            mask={mask}
            unmask={true}
            {...(props as any)} // ✅ Приводим props к типу IMaskInputProps
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            placeholder={props.placeholder}
            inputRef={(el) => {
              if (typeof ref === "function") ref(el);
              else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
          />
        </div>
      );
    }

    // ✅ Если это пароль, добавляем кнопку показа/скрытия
    if (type === "password") {
      return (
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
            ref={ref}
            {...props}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff size={18} aria-label="Hide password" />
            ) : (
              <Eye size={18} aria-label="Show password" />
            )}
          </button>
        </div>
      );
    }

    // ✅ Обычный input без маски и пароля
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };