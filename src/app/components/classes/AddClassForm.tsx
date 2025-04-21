"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSchema } from "@/app/validations/validationSchema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { useClassStore } from "@/app/stores/classStore";

type FormData = z.infer<typeof ClassSchema>;

export function AddClassForm() {
  const { createClass, loading } = useClassStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: "",
      description: "",
      teacherId: null,
    },
  });

  const onSubmit = async (data: FormData) => {
    await createClass(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name" className="mb-2">
          Class Name
        </Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="mb-2">
          Description
        </Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="teacher" className="mb-2">
          Assign Teacher
        </Label>
        <Select
          onValueChange={(value) =>
            setValue("teacherId", value === "none" ? null : value)
          }
        >
          <SelectTrigger id="teacher">
            <SelectValue placeholder="Select a teacher" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No teacher assigned</SelectItem>
          </SelectContent>
        </Select>
        {errors.teacherId && (
          <p className="text-red-500 text-sm">{errors.teacherId.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Class"}
        </Button>

        <DialogClose asChild>
          <Button variant="outline" className="ml-2">
            Close
          </Button>
        </DialogClose>
      </div>
    </form>
  );
}
