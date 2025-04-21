import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { ClassEntity } from "@/app/utils/entities";
import { toast } from "sonner";

interface ClassStore {
  classes: ClassEntity[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (newClass: Omit<ClassEntity, "id">) => Promise<ClassEntity | null>;
  updateClass: (id: string, updatedData: Partial<ClassEntity>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      classes: [],
      loading: false,
      error: null,

      /** ✅ Fetch All Classes */
      fetchClasses: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get("/api/classes?action=get-all");
          set({ classes: res.data.classes, loading: false });
        } catch (error) {
          console.error(error);
          set({ error: "Failed to fetch classes", loading: false });
          toast.error("Failed to fetch classes");
        }
      },

      /** ✅ Add Class (Returns the created class) */
      addClass: async (newClass) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.post("/api/classes", {
            ...newClass,
            teacherId: newClass.teacherId || null,
          });
          const createdClass: ClassEntity = res.data.class;

          set((state) => ({
            classes: [createdClass, ...state.classes], // Append new class
            loading: false,
          }));

          toast.success("Class added successfully");
          return createdClass; // ✅ Return the created class
        } catch (error) {
          console.error(error);
          set({ error: "Failed to add class", loading: false });
          toast.error("Failed to add class");
          return null; // ✅ Return null on failure
        }
      },

      /** ✅ Update Class */
      updateClass: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.put(`/api/classes?id=${id}`, updatedData);
          set((state) => ({
            classes: state.classes.map((c) =>
              c.id === id ? res.data.class : c
            ),
            loading: false,
          }));

     
        } catch (error) {
          console.error(error);
          set({ error: "Failed to update class", loading: false });
          toast.error("Failed to update class");
        }
      },

      /** ✅ Delete Class */
      deleteClass: async (id) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`/api/classes?id=${id}`);
          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
            loading: false,
          }));

          toast.success("Class deleted successfully");
        } catch (error) {
          console.error(error);
          set({ error: "Failed to delete class", loading: false });
          toast.error("Failed to delete class");
        }
      },
    }),
    { name: "class-store" } // Key for localStorage
  )
);
