"use client";

import { useEffect } from "react";
import { useClassStore } from "@/app/stores/classStore";
import FormDialog from "@/app/components/FormDialog";
import { AddClassForm } from "@/app/components/classes/AddClassForm";
import { ClassCard } from "@/app/components/classes/ClassCard";
import PageLayout from "@/app/components/PageLayout";

export default function Classes() {
  const classes = useClassStore((state) => state.classes);
  const fetchClasses = useClassStore((state) => state.fetchClasses);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <PageLayout title="Classes">
      <div className="flex justify-end mb-4">
        <FormDialog
          triggerLabel="Add Class"
          title="Create a New Class"
          description="Fill in the details to add a new class."
        >
          <AddClassForm />
        </FormDialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <ClassCard key={classItem.id} classEntity={classItem} />
          ))
        ) : (
          <p className="text-gray-500">No classes available.</p>
        )}
      </div>
    </PageLayout>
  );
}
