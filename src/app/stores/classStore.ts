import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ClassEntity } from "@/app/utils/entities";
import { toast } from "sonner";

type ClassStore = {
  classes: ClassEntity[];
  loading: boolean;
  error: string | null;

  fetchClasses: (
    withStudents?: boolean,
    withTeacher?: boolean
  ) => Promise<void>;
  createClass: (
    data: Pick<ClassEntity, "name" | "description" | "teacherId">
  ) => Promise<void>;
  updateClass: (data: Partial<ClassEntity> & { id: string }) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
};

export const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      classes: [],
      loading: false,
      error: null,

      fetchClasses: async (withStudents = false, withTeacher = false) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(
            `/api/class?withStudents=${withStudents}&withTeacher=${withTeacher}`
          );
          const data: ClassEntity[] = await res.json();
          set({ classes: data });
        } catch (error) {
          console.error("Fetch classes error:", error);
          set({ error: "Failed to load classes" });
        } finally {
          set({ loading: false });
        }
      },

      createClass: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/class", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const newClass = await res.json();

          if (!res.ok)
            throw new Error(newClass.error || "Failed to create class");

          set((state) => ({ classes: [newClass, ...state.classes] }));
          toast.success("Class created");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Error creating class");
            set({ error: error.message || "Failed to create class" });
          } else {
            toast.error("An unknown error occurred");
            set({ error: "Failed to create class" });
          }
        } finally {
          set({ loading: false });
        }
      },

      updateClass: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/class", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          const updated = await res.json();

          if (!res.ok)
            throw new Error(updated.error || "Failed to update class");

          set((state) => ({
            classes: state.classes.map((c) =>
              c.id === updated.id ? updated : c
            ),
          }));
          toast.success("Class updated");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Error updating class");
            set({ error: error.message || "Failed to update class" });
          } else {
            toast.error("An unknown error occurred");
            set({ error: "Failed to update class" });
          }
        } finally {
          set({ loading: false });
        }
      },

      deleteClass: async (id) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/class", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to delete class");
          }

          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
          }));
          toast.success("Class deleted");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message || "Error deleting class");
            set({ error: error.message || "Failed to delete class" });
          } else {
            toast.error("An unknown error occurred");
            set({ error: "Failed to delete class" });
          }
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "class-storage", // localStorage key
      partialize: (state) => ({ classes: state.classes }), // only persist class list
    }
  )
);
