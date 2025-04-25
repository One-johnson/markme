export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";
export const statusOptions = [
  "Fresher",
  "Continuing",
  "Graduated",
  "Fulltime",
  "Parttime",
  "Contract",
  "Upcoming",
  "Cancelled",
  "Postponed",
  "Active",
  "Inactive",
  "Withdrawn",
] as const;

export type StatusType = (typeof statusOptions)[number];

export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface UserEntity extends BaseEntity {
  email: string;
  username: string;
  phone: string;
  role: UserRole;
  supabaseUserId: string;

  students?: StudentEntity[];
  teachers?: TeacherEntity[];
  parents?: ParentEntity[];
}

export interface TeacherEntity extends BaseEntity {
  name: string;
  email: string;
  subject?: string | null;
  qualifications?: string | null;
  certifications?: string | null;
  yearsOfExperience?: string | null;
  contactPhone: string;
  emergencyContact?: string | null;
  address?: string | null;
  salaryExpectation?: string | null;
  profilePicture?: string | null;
  references?: string | null;
  status: StatusType; //
  user?: Pick<UserEntity, "id" | "email" | "role">; //
  classes?: ClassEntity[];
  students?: StudentEntity[];
}

export interface StudentEntity extends BaseEntity {
  name: string;
  email: string;
  profileImage?: string | null;
  classId: string;
  parentId: string;
  userId: string;
  supabaseUserId: string;
  // Relations (optional in API responses)
  class?: ClassEntity;
  parent?: ParentEntity;
  user?: Pick<UserEntity, "id" | "email" | "role">;
  attendances?: AttendanceEntity[];
}

export interface ClassEntity extends BaseEntity {
  name: string;
  description?: string | null;
  teacherId?: string | null;
  teacher?: TeacherEntity | null;
  students?: StudentEntity[];
  attendances?: AttendanceEntity[];
  status: StatusType;
}

export interface ParentEntity extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  userId: string;
  user?: Pick<UserEntity, "id" | "email" | "role">;
  students?: StudentEntity[];
}

export interface AttendanceEntity extends BaseEntity {
  studentId: string;
  classId: string;
  date: Date | string;
  status: AttendanceStatus;
  // Relations (optional in API responses)
  student?: Pick<StudentEntity, "id" | "name" | "email">;
  class?: Pick<ClassEntity, "id" | "name">;
}
