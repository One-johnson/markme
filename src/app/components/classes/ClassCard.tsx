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

type ClassCardProps = {
  classEntity: ClassEntity; // Pass the whole class entity
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
  const { name, description, teacher, students } = classEntity;

  return (
    <Card className="p-4 rounded-2xl shadow-sm border space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">{name}</h2>
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

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          <strong>Teacher:</strong> {teacher?.name ?? "N/A"}{" "}
          {/* Teacher name */}
        </span>
        <span>
          <strong>Students:</strong> {students?.length ?? 0}{" "}
          {/* Number of students */}
        </span>
      </div>
    </Card>
  );
};
