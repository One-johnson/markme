import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteDialogProps {
  entityName: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmDeleteDialog = ({
  entityName,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) => {
  return (
    <AlertDialog open onOpenChange={(open) => !open && onCancel?.()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete {entityName}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-500 font-semibold">
            This action cannot be undone. Please confirm your decision carefully
            as this action will permanently delete and remove the class data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
