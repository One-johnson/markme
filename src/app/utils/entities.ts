export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE";
export type UserRole = "ADMIN" | "TEACHER" | "STUDENT" | "PARENT";

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
  // Relations (optional in API responses)
  students?: StudentEntity[];
  teachers?: TeacherEntity[];
  parents?: ParentEntity[];
}

export interface TeacherEntity extends BaseEntity {
  name: string;
  email: string;
  subject?: string | null;
  userId: string;
  user?: Pick<UserEntity, "id" | "email" | "role">;
  classes?: ClassEntity[]; // Optional relation
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
