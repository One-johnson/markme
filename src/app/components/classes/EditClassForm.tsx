"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema } from "@/app/validations/validationSchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClassEntity } from "@/app/utils/entities";
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
import { Loader2 } from "lucide-react";
import FormDialog from "@/app/components/FormDialog";

const statusOptions = ["Active", "Inactive"];

type ClassFormValues = z.infer<typeof ClassSchema>;

type EditClassFormProps = {
  classEntity: ClassEntity;
  closeDialog: () => void;
};

export function EditClassForm({
  classEntity,
  closeDialog,
}: EditClassFormProps) {
  const { updateClass, loading, fetchClasses } = useClassStore();

  const form = useForm<ClassFormValues>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: classEntity.name,
      description: classEntity.description ?? undefined,
      teacherId: classEntity.teacherId ?? undefined,
      status: classEntity.status ?? "Active",
    },
  });

  const onSubmit = async (values: ClassFormValues) => {
    try {
      await updateClass(classEntity.id, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
      fetchClasses();
      closeDialog(); // Close the dialog after successful update
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  };

  const handleCloseDialog = () => {
    // Reset form state if needed and close the dialog
    closeDialog();
    form.reset(); // Reset form to clear previous data
  };

  return (
    <FormDialog
      title="Edit Class"
      description="Modify class details"
      isOpen={true}
      onOpenChange={(open) => {
        if (!open) handleCloseDialog(); // Close and reset the form
      }}
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
                      {/* TODO: Dynamically render teacher list here */}
                      {/* Example: 
                          teachers.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.fullName}
                            </SelectItem>
                          )) 
                      */}
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
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
