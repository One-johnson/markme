"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ClassEntity } from "@/app/utils/entities";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import FormDialog from "@/app/components/FormDialog";

const statusOptions = ["Active", "Inactive"];

type ViewClassFormProps = {
  classEntity: ClassEntity;
  closeDialog: () => void;
};

export function ViewClassForm({
  classEntity,
  closeDialog,
}: ViewClassFormProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      closeDialog();
    }
  }, [open, closeDialog]);

  const form = useForm({
    defaultValues: {
      name: classEntity.name,
      description: classEntity.description ?? "",
      teacherId: classEntity.teacherId ?? "None",
      status: classEntity.status ?? "Active",
    },
  });

  return (
    <FormDialog
      title="View Class"
      description="Class details"
      isOpen={open}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <Input value={classEntity.name} disabled readOnly />
              </FormItem>
            )}
          />

          <FormField
            name="description"
            render={() => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={classEntity.description ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="teacherId"
              render={() => (
                <FormItem>
                  <FormLabel>Assigned Teacher</FormLabel>
                  <Input
                    value={classEntity.teacherId ?? "None"}
                    disabled
                    readOnly
                  />
                </FormItem>
              )}
            />

            <FormField
              name="status"
              render={() => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select value={classEntity.status} disabled>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
