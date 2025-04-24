"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TeacherEntity } from "@/app/utils/entities"; // Assuming this is your entity for teacher
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
import Image from "next/image"; // For displaying the profile picture

import FormDialog from "@/app/components/FormDialog";

const statusOptions = ["Active", "Inactive"];

type ViewTeacherFormProps = {
  teacherEntity: TeacherEntity;
  closeDialog: () => void;
};

export function ViewTeacherForm({
  teacherEntity,
  closeDialog,
}: ViewTeacherFormProps) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      closeDialog();
    }
  }, [open, closeDialog]);

  const form = useForm({
    defaultValues: {
      name: teacherEntity.name,
      email: teacherEntity.email,
      subject: teacherEntity.subject ?? "",
      qualifications: teacherEntity.qualifications ?? "",
      certifications: teacherEntity.certifications ?? "",
      yearsOfExperience: teacherEntity.yearsOfExperience ?? undefined,
      contactPhone: teacherEntity.contactPhone ?? "",
      emergencyContact: teacherEntity.emergencyContact ?? "",
      address: teacherEntity.address ?? "",
      status: teacherEntity.status ?? "Active",
      salaryExpectation: teacherEntity.salaryExpectation ?? undefined,
      profilePicture: teacherEntity.profilePicture ?? "",
      references: teacherEntity.references ?? "",
      userId: teacherEntity.userId ?? "",
    },
  });

  return (
    <FormDialog
      title="View Teacher"
      description="Teacher details"
      isOpen={open}
      onOpenChange={setOpen}
    >
      <Form {...form}>
        <form className="space-y-4">
          {/* Teacher Name */}
          <FormField
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Teacher Name</FormLabel>
                <Input value={teacherEntity.name} disabled readOnly />
              </FormItem>
            )}
          />

          {/* Teacher Email */}
          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input value={teacherEntity.email} disabled readOnly />
              </FormItem>
            )}
          />

          {/* Subject */}
          <FormField
            name="subject"
            render={() => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <Input
                  value={teacherEntity.subject ?? "None"}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Qualifications */}
          <FormField
            name="qualifications"
            render={() => (
              <FormItem>
                <FormLabel>Qualifications</FormLabel>
                <Textarea
                  value={teacherEntity.qualifications ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Certifications */}
          <FormField
            name="certifications"
            render={() => (
              <FormItem>
                <FormLabel>Certifications</FormLabel>
                <Textarea
                  value={teacherEntity.certifications ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Years of Experience */}
          <FormField
            name="yearsOfExperience"
            render={() => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <Input
                  value={teacherEntity.yearsOfExperience ?? "N/A"}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Contact Phone */}
          <FormField
            name="contactPhone"
            render={() => (
              <FormItem>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                  value={teacherEntity.contactPhone ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Emergency Contact */}
          <FormField
            name="emergencyContact"
            render={() => (
              <FormItem>
                <FormLabel>Emergency Contact</FormLabel>
                <Input
                  value={teacherEntity.emergencyContact ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            name="address"
            render={() => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <Input value={teacherEntity.address ?? ""} disabled readOnly />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            name="status"
            render={() => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select value={teacherEntity.status} disabled>
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

          {/* Salary Expectation */}
          <FormField
            name="salaryExpectation"
            render={() => (
              <FormItem>
                <FormLabel>Salary Expectation</FormLabel>
                <Input
                  value={teacherEntity.salaryExpectation ?? "N/A"}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* References */}
          <FormField
            name="references"
            render={() => (
              <FormItem>
                <FormLabel>References</FormLabel>
                <Textarea
                  value={teacherEntity.references ?? ""}
                  disabled
                  readOnly
                />
              </FormItem>
            )}
          />

          {/* Profile Picture */}
          <FormField
            name="profilePicture"
            render={() => (
              <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex justify-center">
                  {teacherEntity.profilePicture ? (
                    <Image
                      src={teacherEntity.profilePicture}
                      alt="Profile Picture"
                      width={96}
                      height={96}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-white">No Picture</span>
                    </div>
                  )}
                </div>
              </FormItem>
            )}
          />

          {/* User ID */}
          <FormField
            name="userId"
            render={() => (
              <FormItem>
                <FormLabel>User ID</FormLabel>
                <Input value={teacherEntity.userId} disabled readOnly />
              </FormItem>
            )}
          />

          {/* Close Button */}
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
