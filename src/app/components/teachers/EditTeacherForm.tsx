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
import Image from "next/image";
import { useState } from "react"; // Import useState for image preview handling
import { uploadProfilePicture } from "@/app/utils/supabase/uploadProfilePictures"; // Import your upload logic
import { TeacherEntity } from "@/app/utils/entities";

const statusOptions = ["Fulltime", "Parttime", "Contract"];

type TeacherFormValues = z.infer<typeof teacherSchema>;

interface EditTeacherFormProps {
  teacherId: string;
  teacherData: TeacherFormValues;
  closeDialog?: () => void;
  teacherEntity?: TeacherEntity;
}

export function EditTeacherForm({
  teacherId,
  teacherData,
}: EditTeacherFormProps) {
  const { updateTeacher, loading } = useTeacherStore();
  const [profilePic, setProfilePic] = useState<string | null>(
    teacherData.profilePicture || null
  );
  const [imageUploading, setImageUploading] = useState(false);

  const form = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      ...teacherData, // Pre-fill form with teacher data
    },
  });

  // Handle profile picture change
  const handleProfilePicChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUploading(true);
      try {
        const uploadedUrl = await uploadProfilePicture(file, teacherId); // Use the teacher's ID for file storage
        setProfilePic(uploadedUrl); // Update preview
        form.setValue("profilePicture", uploadedUrl); // Set form value for profile picture
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      } finally {
        setImageUploading(false); // Finish uploading
      }
    }
  };

  const onSubmit = async (values: TeacherFormValues) => {
    try {
      await updateTeacher(teacherId, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
      form.reset(); // Reset the form after successful submission
    } catch (error) {
      console.error("Failed to update teacher:", error);
    }
  };

  return (
    <FormDialog
      triggerLabel="Edit Teacher" // Trigger label for the button that opens the dialog
      title="Edit Teacher Details"
      description="Update the teacher's information."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4 relative">
            <FormField
              control={form.control}
              name="profilePicture"
              render={() => (
                <FormItem className="w-24 h-24">
                  <FormControl>
                    {profilePic ? (
                      <Image
                        src={profilePic}
                        alt="Profile Picture"
                        className="w-full h-full rounded-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-white">Upload</span>
                      </div>
                    )}
                    {/* File Input for uploading the profile picture */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePicChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {imageUploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Loader2 className="text-white animate-spin h-6 w-6" />
                      </div>
                    )}
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Teacher Name */}
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

          {/* Teacher Email */}
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

          {/* Subject */}
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
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Qualifications */}
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

          {/* Years of Experience */}
          <FormField
            control={form.control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Years of Experience"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Phone */}
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Phone Number"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Emergency Contact */}
          <FormField
            control={form.control}
            name="emergencyContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Emergency Contact"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
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

          {/* Salary Expectation */}
          <FormField
            control={form.control}
            name="salaryExpectation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary Expectation</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Salary Expectation"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* References */}
          <FormField
            control={form.control}
            name="references"
            render={({ field }) => (
              <FormItem>
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

          <div className="flex justify-center gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Updating..." : "Update Teacher"}
            </Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
