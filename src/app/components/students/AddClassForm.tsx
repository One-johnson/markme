"use client";

import { FC, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClassSchema } from "@/app/validations/validationSchema";
import { useClassStore } from "@/app/stores/classStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormLabel,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Import FormItem and FormMessage
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"; // Ensure this import is correct
import { toast } from "sonner"; // Import toast from sonner

type AddClassFormProps = Record<string, never>;

const AddClassForm: FC<AddClassFormProps> = () => {
  const { createClass } = useClassStore();
  const [loading, setLoading] = useState(false); // State for loading
  const methods = useForm({
    resolver: zodResolver(ClassSchema),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: z.infer<typeof ClassSchema>) => {
    setLoading(true); // Set loading to true on submit

    try {
      await createClass({
        name: data.name,
        description: data.description,
        teacherId: data.teacherId,
      });
      toast.success("Class added successfully!"); // Show success toast

      reset(); // Reset the form on successful submission
    } catch (error) {
      console.error("Error adding class:", error);
      toast.error("Failed to add class. Please try again."); // Show error toast
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <FormProvider {...methods}>
      {" "}
      {/* Wrap the form with FormProvider */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto"
      >
        {/* Class Name */}
        <FormControl>
          <FormItem>
            <FormLabel>Class Name</FormLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter class name" />
              )}
            />
            <FormMessage>{errors.name?.message}</FormMessage>
          </FormItem>
        </FormControl>

        {/* Description */}
        <FormControl>
          <FormItem>
            <FormLabel>Description (Optional)</FormLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Enter class description" />
              )}
            />
            <FormMessage>{errors.description?.message}</FormMessage>
          </FormItem>
        </FormControl>

        {/* Teacher Selection */}
        <FormControl>
          <FormItem>
            <FormLabel>Teacher</FormLabel>
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher-id-1">Teacher 1</SelectItem>
                    <SelectItem value="teacher-id-2">Teacher 2</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FormMessage>{errors.teacherId?.message}</FormMessage>
          </FormItem>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" disabled={loading}>
          {loading ? "Adding Class..." : "Add Class"}
        </Button>

        {/* Reset Button */}
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()} // Reset form when clicked
        >
          Reset
        </Button>
      </form>
    </FormProvider>
  );
};

export default AddClassForm;
