import { z } from "zod";
import { statusOptions } from "@/app/utils/entities";

const nameValidation = (fieldName: string) =>
  z
    .string()
    .min(1, `${fieldName} is required`)
    .max(50, `${fieldName} must be 50 characters or less`);

const emailValidation = z
  .string()
  .email("Please enter a valid email")
  .min(5, "Email must be at least 5 characters")
  .max(100, "Email must be 100 characters or less");

const uuidValidation = (fieldName: string) =>
  z.string().uuid(`${fieldName} must be a valid UUID`);

const phoneValidation = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, "Enter a valid 10-15 digit phone number");

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be 3-20 characters")
    .max(20, "Username must be 3-20 characters"),

  email: emailValidation,

  password: z
    .string()
    .min(8, "Password must be 8+ characters")
    .regex(/[a-z]/, "Password needs a lowercase letter")
    .regex(/[A-Z]/, "Password needs an uppercase letter")
    .regex(/[0-9]/, "Password needs a number")
    .regex(/[^a-zA-Z0-9]/, "Password needs a special character"),

  phone: phoneValidation,
});

export const loginSchema = z.object({
  email: emailValidation,
  password: z.string().min(1, "Password is required"),
});

// Class Schema
export const ClassSchema = z.object({
  name: nameValidation("Class name"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  teacherId: z.string().nullable().optional(),
  status: z.enum(statusOptions),
});

// Student Schema
export const studentSchema = z.object({
  name: nameValidation("Student name"),
  email: emailValidation,
  profileImage: z.string().url("Enter a valid URL").optional(),
  classId: uuidValidation("Class ID"),
  parentId: uuidValidation("Parent ID"),
  userId: uuidValidation("User ID"),
});

// Teacher Schema
export const teacherSchema = z.object({
  name: nameValidation("Teacher name"),
  email: emailValidation,
  subject: z.string().nullable().optional(),

  qualifications: z
    .string()
    .max(255, "Qualifications must be 255 characters or less")
    .optional()
    .nullable(),

  certifications: z
    .string()
    .max(255, "Certifications must be 255 characters or less")
    .optional()
    .nullable(),

  yearsOfExperience: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
      { message: "Years of experience must be a number between 0 and 100" }
    ),

  contactPhone: phoneValidation,

  emergencyContact: z
    .string()
    .max(200, "Emergency contact must be 200 characters or less")
    .optional()
    .nullable(),

  address: z
    .string()
    .max(255, "Address must be 255 characters or less")
    .optional()
    .nullable(),

  status: z.enum(statusOptions),

  salaryExpectation: z
    .string()
    .optional()
    .nullable()
    .refine((val) => val === null || val === undefined || !isNaN(Number(val)), {
      message: "Salary expectation must be a number",
    }),

  profilePicture: z.string().min(1, "Profile picture is required"),

  references: z
    .string()
    .max(500, "References must be 500 characters or less")
    .optional()
    .nullable(),
});

// Parent Schema
export const ParentSchema = z.object({
  name: nameValidation("Parent name"),
  email: emailValidation,
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Enter a valid 10-15 digit phone number"),
  userId: uuidValidation("User ID"),
});

// Attendance Schema
export const attendanceSchema = z.object({
  studentId: uuidValidation("Student ID"),
  classId: uuidValidation("Class ID"),
  date: z.coerce
    .date()
    .max(new Date(), "Date cannot be in the future")
    .refine((date) => date <= new Date(), {
      message: "Attendance date cannot be in the future",
    }),
  status: z.enum(["PRESENT", "ABSENT", "LATE"]),
});

// Type Exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ClassInput = z.infer<typeof ClassSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type ParentInput = z.infer<typeof ParentSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
