import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { TeacherEntity } from "@/app/utils/entities";
import { supabaseBrowser } from "@/app/utils/supabase/client";
import { toast } from "sonner";

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

interface TeacherStore {
  teachers: TeacherEntity[];
  teacher: TeacherEntity | null;
  loading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  fetchTeacherById: (id: string) => Promise<void>;
  addTeacher: (newTeacher: Omit<TeacherEntity, "id">) => Promise<void>;
  updateTeacher: (
    id: string,
    updatedData: Partial<TeacherEntity>
  ) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  syncSession: () => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>()(
  persist(
    (set) => ({
      teachers: [],
      teacher: null,
      loading: false,
      error: null,

      fetchTeachers: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get("/api/teachers");
          set({ teachers: res.data, loading: false });
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to fetch teachers"),
            loading: false,
          });
          toast.error("Failed to fetch teachers");
        }
      },

      fetchTeacherById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`/api/teachers?id=${id}`);
          set({ teacher: res.data, loading: false });
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to fetch teacher"),
            loading: false,
          });
        }
      },

      addTeacher: async (newTeacher) => {
        set({ loading: true, error: null });
        set((state) => ({
          teachers: [{ ...newTeacher, id: "temp-id" }, ...state.teachers],
          loading: false,
        }));

        try {
          const res = await axios.post("/api/teachers", newTeacher);
          set((state) => ({
            teachers: state.teachers.map((t) =>
              t.id === "temp-id" ? res.data : t
            ),
            loading: false,
          }));
          toast.success("Teacher created successfully 🎉");
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to add teacher"),
            loading: false,
          });
        }
      },

      updateTeacher: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.put(`/api/teachers?id=${id}`, updatedData);
          set((state) => ({
            teachers: state.teachers.map((t) => (t.id === id ? res.data : t)),
            loading: false,
          }));
          toast.success("Teacher updated successfully 🎉");
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to update teacher"),
            loading: false,
          });
          toast.error("Failed to update Teacher");
        }
      },

      deleteTeacher: async (id) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`/api/teachers?id=${id}`);
          set((state) => ({
            teachers: state.teachers.filter((t) => t.id !== id),
            loading: false,
          }));
          toast.success("Teacher deleted successfully");
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to delete teacher"),
            loading: false,
          });
          toast.error("Failed to delete Teacher");
        }
      },

      logout: async () => {
        await supabaseBrowser.auth.signOut();
        set({ teacher: null, teachers: [], error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      syncSession: async () => {
        const { data } = await supabaseBrowser.auth.getSession();
        if (data.session?.user?.email) {
          try {
            const res = await axios.get(
              `/api/teachers?email=${data.session.user.email}`
            );
            set({ teacher: res.data });
          } catch {
            set({ error: "Failed to sync teacher session" });
          }
        }
      },
    }),
    {
      name: "teacher-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
