import { FC } from "react";
import { ClassEntity } from "@/app/utils/entities"; // Import ClassEntity
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import StatusTag from "@/app/components/StatusTag";

type ClassCardProps = {
  classEntity: ClassEntity;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export const ClassCard: FC<ClassCardProps> = ({
  classEntity,
  onView,
  onEdit,
  onDelete,
}) => {
  const { name, description, teacher, students, status } = classEntity;

  return (
    <Card className="p-4 rounded-2xl shadow-sm border space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {classEntity.id}
          </p>{" "}
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
            )}
            {onEdit && (
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="text-sm text-muted-foreground">
        <span>
          <strong>Teacher:</strong> {teacher?.name ?? "N/A"}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          <strong>Students:</strong> {students?.length ?? 0}
        </span>
        <span>
          <strong>Status:</strong> <StatusTag status={status} />
        </span>
      </div>
    </Card>
  );
};
