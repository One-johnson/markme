"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema } from "@/app/validations/validationSchema";
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
import { useTeacherStore } from "@/app/stores/teacherStore";
import { DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react"; // Spinner icon
import FormDialog from "@/app/components/FormDialog";
import ProfileImageUploader from "@/app/utils/profileImageUploader";

const statusOptions = ["Fulltime", "Parttime", "Contract"];

type TeacherFormValues = z.input<typeof teacherSchema>;

export function AddTeacherForm() {
  const { addTeacher, loading, fetchTeachers } = useTeacherStore();

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      qualifications: "",
      certifications: "",
      yearsOfExperience: undefined,
      contactPhone: "",
      emergencyContact: "",
      address: "",
      status: "Fulltime",
      salaryExpectation: undefined,
      profilePicture: "",
      references: "",
    },
  });

  const onSubmit = async (values: TeacherFormValues) => {
    console.log("Submitting values", values);
    try {
      await addTeacher({ ...values, createdAt: new Date().toISOString() }); // Create teacher
      form.reset(); // Reset form after success
      fetchTeachers(); // Re-fetch the list of teachers

      const modalElement = document.getElementById("modal");
      const statusField = modalElement?.querySelector("input, select");
      if (statusField)
        (statusField as HTMLInputElement | HTMLSelectElement).focus();
    } catch (error) {
      console.error("Failed to add teacher:", error);
    }
  };

  // Handle image upload and update form state with the URL
  const handleImageUpload = (url: string) => {
    form.setValue("profilePicture", url);
  };

  return (
    <FormDialog
      triggerLabel="Add Teacher" // Trigger label for the button that opens the dialog
      title="Create a New Teacher"
      description="Fill in the details to add a new teacher."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture */}
          <FormField
            control={form.control}
            name="profilePicture"
            render={({ field }) => (
              <FormItem className="flex justify-center mb-4 relative">
                <FormLabel className="sr-only">Profile Picture</FormLabel>
                <FormControl>
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <ProfileImageUploader
                      onUpload={(url) => {
                        field.onChange(url); // updates form state
                        handleImageUpload(url); // optional if needed elsewhere
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Put all the following fields inside this grid container */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Teacher's Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Teacher's Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Subject"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Qualifications"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Years of Experience</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Years of Experience"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Emergency Contact"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
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
            <FormField
              control={form.control}
              name="salaryExpectation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary Expectation</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Salary Expectation"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="references"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>References</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="References"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit + Reset + Cancel buttons */}
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
              disabled={loading}
            >
              Reset
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={loading}
              onClick={() => console.log("Submit button clicked")}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Teacher"}
            </Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
