import MenuBar from "@/app/components/MenuBar";
import FormDialog from "@/app/components/FormDialog";
import { AddClassForm } from "@/app/components/classes/AddClassForm";

export default function Classes() {
  return (
    <div>
      <MenuBar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Classes</h1>

          <FormDialog
            triggerLabel="Add Class"
            title="Create a New Class"
            description="Fill in the details to add a new class."
          >
            <AddClassForm />
          </FormDialog>
        </div>

        <p className="text-gray-500 mb-4">List of classes will be displayed here.</p>
        {/* Class list goes here */}
      </div>
    </div>
  );
}
