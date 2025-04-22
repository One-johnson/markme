"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema } from "@/app/validations/validationSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassStore } from "@/app/stores/classStore";
import { DialogClose } from "@/components/ui/dialog";

import { Loader2 } from "lucide-react"; // Spinner icon
import FormDialog from "@/app/components/FormDialog"; // Import FormDialog component

const statusOptions = ["Active", "Inactive"];

type ClassFormValues = z.infer<typeof ClassSchema>;

export function AddClassForm() {
  const { addClass, loading, fetchClasses } = useClassStore();

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: "",
      description: "",
      teacherId: undefined,
      status: "Active",
    },
  });

  const onSubmit = async (values: ClassFormValues) => {
    try {
      await addClass({ ...values, createdAt: new Date().toISOString() }); // Create the class
      form.reset(); // ✅ Reset after success

      fetchClasses(); // Re-fetch the classes after adding
    } catch {
      // Handle error
    }
  };

  return (
    <FormDialog
      triggerLabel="Add Class" // Trigger label for the button that opens the dialog
      title="Create a New Class"
      description="Fill in the details to add a new class."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="Class name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Optional description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="teacherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign Teacher</FormLabel>
                  <Select
                    value={field.value ?? "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? undefined : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">No teacher assigned</SelectItem>
                      {/* Dynamically render teacher items here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
