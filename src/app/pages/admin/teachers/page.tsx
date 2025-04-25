"use client";

import { useEffect, useState } from "react";
import { useTeacherStore } from "@/app/stores/teacherStore";

import { AddTeacherForm } from "@/app/components/teachers/AddTeacherForm";
import { TeacherCard } from "@/app/components/teachers/teacherCard";
import { ViewTeacherForm } from "@/app/components/teachers/ViewTeacherForm";
import { EditTeacherForm } from "@/app/components/teachers/EditTeacherForm";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";
import PageLayout from "@/app/components/PageLayout";
import { TeacherEntity } from "@/app/utils/entities";

export default function Teachers() {
  const teachers = useTeacherStore((state) => state.teachers);
  const fetchTeachers = useTeacherStore((state) => state.fetchTeachers);
  const deleteTeacher = useTeacherStore((state) => state.deleteTeacher);

  const [selectedTeacher, setSelectedTeacher] = useState<TeacherEntity | null>(
    null
  );
  const [dialogType, setDialogType] = useState<
    "view" | "edit" | "delete" | "none"
  >("none");

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleView = (teacher: TeacherEntity) => {
    setSelectedTeacher(null);
    setTimeout(() => {
      setSelectedTeacher(teacher);
      setDialogType("view");
    }, 0);
  };

  const handleEdit = (teacher: TeacherEntity) => {
    setSelectedTeacher(null);
    setTimeout(() => {
      setSelectedTeacher(teacher);
      setDialogType("edit");
    }, 0);
  };

  const handleDelete = (teacher: TeacherEntity) => {
    setSelectedTeacher(null);
    setTimeout(() => {
      setSelectedTeacher(teacher);
      setDialogType("delete");
    }, 0);
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-semibold">Teachers</h1>
        <AddTeacherForm />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacherData={teacher}
              onView={() => handleView(teacher)}
              onEdit={() => handleEdit(teacher)}
              onDelete={() => handleDelete(teacher)}
            />
          ))
        ) : (
          <p className="text-gray-500">No teachers available.</p>
        )}
      </div>

      {dialogType === "view" && selectedTeacher && (
        <ViewTeacherForm
          key={selectedTeacher.id}
          teacherEntity={selectedTeacher}
          closeDialog={() => setDialogType("none")}
        />
      )}

      {dialogType === "edit" && selectedTeacher && (
        <EditTeacherForm
          key={selectedTeacher.id}
          teacherId={selectedTeacher.id}
          teacherData={{
            ...selectedTeacher,
            profilePicture: selectedTeacher.profilePicture || "",
          }}
          closeDialog={() => setDialogType("none")}
        />
      )}

      {dialogType === "delete" && selectedTeacher && (
        <ConfirmDeleteDialog
          entityName="teacher"
          onConfirm={() => {
            deleteTeacher(selectedTeacher.id);
            setDialogType("none");
            setSelectedTeacher(null);
          }}
          onCancel={() => {
            setDialogType("none");
            setSelectedTeacher(null);
          }}
        />
      )}
    </PageLayout>
  );
}
