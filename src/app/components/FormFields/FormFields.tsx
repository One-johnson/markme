import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFormContext } from "react-hook-form";

type FormFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  type: "input" | "textarea" | "select";
  options?: string[]; // For Select field options
};

export const FormFieldComponent = ({
  name,
  label,
  placeholder,
  type,
  options,
}: FormFieldProps) => {
  const { control } = useFormContext(); // Get control from context to access form state

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "input" && (
              <Input placeholder={placeholder} {...field} />
            )}
            {type === "textarea" && (
              <Textarea placeholder={placeholder} {...field} />
            )}
            {type === "select" && (
              <Select
                value={field.value ?? "none"}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
