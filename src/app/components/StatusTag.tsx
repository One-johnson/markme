import { StatusType } from "@/app/utils/entities";

interface StatusTagProps {
  status: StatusType;
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  let bgColor: string, textColor: string, border: string;

  switch (status) {
    case "Fresher":
      bgColor = "bg-red-700";
      textColor = "text-white";
      border = "border-red-400";
      break;
    case "Continuing":
      bgColor = "bg-orange-700";
      textColor = "text-white";
      border = "border-orange-400";
      break;
    case "Graduated":
      bgColor = "bg-amber-700";
      textColor = "text-white";
      border = "border-amber-400";
      break;
    case "Fulltime":
      bgColor = "bg-blue-800";
      textColor = "text-white";
      border = "border-blue-400";
      break;
    case "Parttime":
      bgColor = "bg-pink-600";
      textColor = "text-white";
      border = "border-pink-400";
      break;
    case "Contract":
      bgColor = "bg-fuchsia-700";
      textColor = "text-white";
      border = "border-fuchsia-400";
      break;
    case "Upcoming":
      bgColor = "bg-violet-700";
      textColor = "text-white";
      border = "border-violet-400";
      break;
    case "Cancelled":
      bgColor = "bg-red-700";
      textColor = "text-white";
      border = "border-red-400";
      break;
    case "Postponed":
      bgColor = "bg-indigo-800";
      textColor = "text-white";
      border = "border-indigo-400";
      break;
    case "Active":
      bgColor = "bg-green-800";
      textColor = "text-white";
      border = "border-green-200";
      break;
    case "Inactive":
      bgColor = "bg-red-700";
      textColor = "text-white";
      border = "border-red-400";
      break;
    case "Withdrawn":
      bgColor = "bg-gray-900";
      textColor = "text-white";
      border = "border-gray-400";
      break;
    default:
      bgColor = "bg-gray-200";
      textColor = "text-gray-500";
      border = "border-gray-600";
  }

  return (
    <span
      className={`${bgColor} ${textColor} ${border} font-normal px-4 rounded-md inline-block text-sm border`}
    >
      {status}
    </span>
  );
};

export default StatusTag;
