"use client";

import { useState, useEffect } from "react";
import { useClassStore } from "@/app/stores/classStore";

import { AddClassForm } from "@/app/components/classes/AddClassForm";
import { ClassCard } from "@/app/components/classes/ClassCard";
import { EditClassForm } from "@/app/components/classes/EditClassForm";
import { ViewClassForm } from "@/app/components/classes/ViewClassForm";
import PageLayout from "@/app/components/PageLayout";
import { ClassEntity } from "@/app/utils/entities";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";

export default function Classes() {
  const classes = useClassStore((state) => state.classes);
  const fetchClasses = useClassStore((state) => state.fetchClasses);
  const deleteClass = useClassStore((state) => state.deleteClass);

  const [selectedClass, setSelectedClass] = useState<ClassEntity | null>(null);
  const [dialogType, setDialogType] = useState<
    "view" | "edit" | "delete" | "none"
  >();

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleView = (classEntity: ClassEntity) => {
    setSelectedClass(null); // Clear first
    setTimeout(() => {
      setSelectedClass(classEntity);
      setDialogType("view");
    }, 0);
  };

  const handleEdit = (classEntity: ClassEntity) => {
    setSelectedClass(null);
    setTimeout(() => {
      setSelectedClass(classEntity);
      setDialogType("edit");
    }, 0);
  };

  const handleDelete = (classEntity: ClassEntity) => {
    setSelectedClass(null);
    setTimeout(() => {
      setSelectedClass(classEntity);
      setDialogType("delete");
    }, 0);
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">Classes</h1>

        <AddClassForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              onView={() => handleView(classItem)}
              onEdit={() => handleEdit(classItem)}
              onDelete={() => handleDelete(classItem)}
            />
          ))
        ) : (
          <p className="text-gray-500">No classes available.</p>
        )}
      </div>

      {dialogType === "view" && selectedClass && (
        <ViewClassForm
          key={selectedClass.id}
          classEntity={selectedClass}
          closeDialog={() => setDialogType("none")}
        />
      )}

      {dialogType === "edit" && selectedClass && (
        <EditClassForm
          key={selectedClass.id}
          classEntity={selectedClass}
          closeDialog={() => setDialogType("none")}
        />
      )}
      {dialogType === "delete" && selectedClass && (
        <ConfirmDeleteDialog
          entityName="class"
          onConfirm={() => {
            deleteClass(selectedClass.id);
            setDialogType("none");
            setSelectedClass(null);
          }}
          onCancel={() => {
            setDialogType("none");
            setSelectedClass(null);
          }}
        />
      )}
    </PageLayout>
  );
}
