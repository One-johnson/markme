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
import { ClassEntity } from "@/app/utils/entities";
import StatusTag from "@/app/components/StatusTag";

interface ClassCardProps {
  classData: ClassEntity;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ClassCard = ({
  classData,
  onView,
  onEdit,
  onDelete,
  showActions = true,
}: ClassCardProps) => {
  const { id, name, description, teacher, students, status } = classData;

  return (
    <Card className="rounded-2xl p-4 shadow-sm bg-white border space-y-1">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">{name}</h2>
          <p className="text-sm font-bold text-red-600"> {id}</p>
        </div>
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
                  <Eye className="w-4 h-4 text-blue-800" />
                  View
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={onEdit}
                  className="text-green-800 font-semibold "
                >
                  <Pencil className="w-4 h-4 text-green-800" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-700 font-semibold"
                >
                  <Trash2 className="w-4 h-4 text-red-700" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {description && <p className="text-sm">{description}</p>}

      <div className="text-sm text-muted-foreground space-y-1">
        <p>
          <strong>Teacher:</strong> {teacher?.name || "N/A"}
        </p>
      </div>

      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-muted-foreground ">
          <strong>Students:</strong> {students?.length ?? 0}
        </p>
        <span>
          <StatusTag status={status} />
        </span>
      </div>
    </Card>
  );
};
