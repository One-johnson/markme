// components/ui/FormDialog.tsx
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type FormDialogProps = {
  children: React.ReactNode;
  triggerLabel?: string;
  title: string;
  description?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function FormDialog({
  children,
  triggerLabel,
  title,
  description,
  isOpen,
  onOpenChange,
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button>{triggerLabel}</Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
