import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username can be up to 20 characters long"),

  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters long"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain letters")
    .regex(/[0-9]/, "Password must contain numbers"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be no more than 15 digits")
    .regex(/^\+?[0-9]+$/, "Phone number must be valid"),
});

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters long"),

  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Create Class Schema
export const classSchema = z.object({
  name: z
    .string()
    .min(1, "Class name is required")
    .max(50, "Class name can be up to 50 characters long"),

  teacherId: z.string().uuid().optional(), // Teacher is optional at creation, but can be assigned later

  createdAt: z.date().default(() => new Date()), // Automatically assigns current date if not provided
});

// Create Student Schema
export const studentSchema = z.object({
  name: z
    .string()
    .min(1, "Student name is required")
    .max(50, "Student name can be up to 50 characters long"),

  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters long"),

  profileImage: z.string().url("Profile image must be a valid URL").optional(), // Profile image is optional at creation

  classId: z.string().uuid("Class ID must be a valid UUID"), // Class ID must be a valid UUID

  createdAt: z.date().default(() => new Date()), // Automatically assigns current date if not provided
});

// Teacher Schema (for Create and Update)
export const teacherSchema = z.object({
  name: z
    .string()
    .min(1, "Teacher name is required")
    .max(50, "Teacher name can be up to 50 characters long"),

  email: z
    .string()
    .email("Please enter a valid email")
    .min(5, "Email must be at least 5 characters long"),

  subject: z
    .string()
    .min(1, "Subject is required")
    .max(100, "Subject can be up to 100 characters long")
    .optional(), // Subject is optional (not all teachers may have a subject)

  createdAt: z.date().optional(), // If updating, you may not want to include this field, so it's optional
});

const attendanceStatus = z.enum(["PRESENT", "ABSENT", "LATE"]);

export const attendanceSchema = z.object({
  studentId: z.string().uuid("Student ID must be a valid UUID"), // Validating studentId as a UUID

  classId: z.string().uuid("Class ID must be a valid UUID"), // Validating classId as a UUID

  date: z
    .date()
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Date must be a valid date", // Ensure the date is a valid Date object
    }),

  status: attendanceStatus, // Status must be one of the values: "PRESENT", "ABSENT", or "LATE"

  createdAt: z.date().optional(), // Optional for updating, can be set automatically when creating
});
