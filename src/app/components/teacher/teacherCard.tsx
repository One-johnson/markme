"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2, Eye, Pencil } from "lucide-react";
import { TeacherEntity } from "@/app/utils/entities";
import StatusTag from "@/app/components/StatusTag";
import Image from "next/image";

interface TeacherCardProps {
  teacherData: TeacherEntity;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TeacherCard = ({
  teacherData,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: TeacherCardProps) => {
  const { id, name, classes, profilePicture, status } = teacherData;

  return (
    <Card className="rounded-2xl p-4 shadow-sm bg-white border">
      <div className="flex items-start justify-between">
        {/* Profile Picture and Basic Info */}
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden border">
            {profilePicture ? (
              <Image
                src={profilePicture}
                alt={name}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm">
                N/A
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold">{name}</h2>
            <p className="text-xs text-red-600 font-semibold">{id}</p>
          </div>
        </div>

        {/* Action Dropdown */}
        {showActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Actions">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem
                  onClick={onView}
                  className="text-blue-800 font-semibold"
                >
                  <Eye className="w-4 h-4 mr-2 text-blue-800" />
                  View
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={onEdit}
                  className="text-green-800 font-semibold"
                >
                  <Pencil className="w-4 h-4 mr-2 text-green-800" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4 mr-2 text-red-700" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Class and Status */}
      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
        <p>
          <strong>Class:</strong>{" "}
          {Array.isArray(classes)
            ? classes.map((classItem) => classItem?.name).join(", ")
            : classes || "N/A"}
        </p>

        <StatusTag status={status} />
      </div>
    </Card>
  );
};
