export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

export interface TeacherEntity {
  id: string;
  name: string;
  email: string;
  subject?: string;
  createdAt: string;
}

export interface StudentEntity {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  classId: string;
  createdAt: string;
}

export interface ClassEntity {
  id: string;
  name: string;
  teacherId: string | null;
  createdAt: string;
}

export interface AttendanceEntity {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: AttendanceStatus;
  createdAt: string;
}

export interface UserEntity {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  supabaseUserId: string;
  phone?: string;
  createdAt: string;
}
