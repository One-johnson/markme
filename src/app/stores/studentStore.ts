import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
import { StudentEntity } from "@/app/utils/entities";
import { supabase } from "@/app/lib/supabaseClient";

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  return defaultMessage;
};

interface StudentStore {
  students: StudentEntity[];
  student: StudentEntity | null;
  loading: boolean;
  error: string | null;
  fetchStudents: () => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  addStudent: (newStudent: Omit<StudentEntity, "id">) => Promise<void>;
  updateStudent: (
    id: string,
    updatedData: Partial<StudentEntity>
  ) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      students: [],
      student: null,
      loading: false,
      error: null,

      // Fetch all students
      fetchStudents: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get("/api/students");
          set({ students: res.data, loading: false });
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to fetch students"),
            loading: false,
          });
        }
      },

      // Fetch a single student by ID
      fetchStudentById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.get(`/api/students?id=${id}`);
          set({ student: res.data, loading: false });
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to fetch student"),
            loading: false,
          });
        }
      },

      // Add a new student with optimistic update
      addStudent: async (newStudent) => {
        set({ loading: true, error: null });

        // Optimistic update: Add the new student immediately to the state
        set((state) => ({
          students: [{ ...newStudent, id: "temp-id" }, ...state.students],
          loading: false,
        }));

        try {
          const res = await axios.post("/api/students", newStudent);

          // Update the state with the actual data from the server after successful creation
          set((state) => ({
            students: state.students.map((s) =>
              s.id === res.data.id ? res.data : s
            ),
            loading: false,
          }));
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to add student"),
            loading: false,
          });
        }
      },

      // Update a student's data
      updateStudent: async (id, updatedData) => {
        set({ loading: true, error: null });
        try {
          const res = await axios.put(`/api/students?id=${id}`, updatedData);
          set((state) => ({
            students: state.students.map((s) => (s.id === id ? res.data : s)),
            loading: false,
          }));
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to update student"),
            loading: false,
          });
        }
      },

      // Delete a student
      deleteStudent: async (id) => {
        set({ loading: true, error: null });
        try {
          await axios.delete(`/api/students?id=${id}`);
          set((state) => ({
            students: state.students.filter((student) => student.id !== id),
            loading: false,
          }));
        } catch (error: unknown) {
          set({
            error: getErrorMessage(error, "Failed to delete student"),
            loading: false,
          });
        }
      },

      // Logout
      logout: async () => {
        await supabase.auth.signOut();
        set({ student: null });
      },
    }),
    {
      name: "student-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
