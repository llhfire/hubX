import { Check, X } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "pending" | "rejected";
}

interface ApprovalFlowProps {
  steps: Step[];
}

const statusConfig = {
  completed: {
    dot: "bg-green-500 border-green-500",
    line: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
    icon: <Check className="size-3 text-white" />,
  },
  current: {
    dot: "bg-blue-500 border-blue-500 ring-4 ring-blue-500/20",
    line: "bg-gray-200 dark:bg-gray-700",
    text: "text-blue-600 dark:text-blue-400 font-semibold",
    icon: null,
  },
  pending: {
    dot: "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600",
    line: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-400 dark:text-gray-500",
    icon: null,
  },
  rejected: {
    dot: "bg-red-500 border-red-500",
    line: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    icon: <X className="size-3 text-white" />,
  },
};

export function ApprovalFlow({ steps }: ApprovalFlowProps) {
  return (
    <div className="flex items-start w-full">
      {steps.map((step, index) => {
        const config = statusConfig[step.status];
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center relative",
              !isLast && "flex-1"
            )}
          >
            <div className="flex items-center w-full">
              <div
                className={cn(
                  "flex items-center justify-center size-7 rounded-full border-2 shrink-0",
                  config.dot
                )}
              >
                {config.icon}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-1",
                    step.status === "completed" ? config.line : statusConfig.pending.line
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 text-center whitespace-nowrap",
                config.text
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
