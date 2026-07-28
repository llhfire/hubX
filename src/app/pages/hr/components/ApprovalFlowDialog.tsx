import {
  Check,
  Circle,
  User,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { cn } from "@/app/components/ui/utils";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
  assignee: string;
}

interface ApprovalFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  steps: Step[];
  onApprove?: () => void;
  onReject?: () => void;
}

const statusConfig = {
  completed: {
    dot: "bg-green-500 border-green-500",
    line: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
    icon: <Check className="size-3.5 text-white" />,
    badge: "default" as const,
    badgeLabel: "已完成",
  },
  current: {
    dot: "bg-blue-500 border-blue-500 ring-4 ring-blue-500/20",
    line: "bg-gray-200 dark:bg-gray-700",
    text: "text-blue-600 dark:text-blue-400 font-semibold",
    icon: <Circle className="size-2.5 fill-current text-white" />,
    badge: "default" as const,
    badgeLabel: "进行中",
  },
  pending: {
    dot: "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600",
    line: "bg-gray-200 dark:bg-gray-700",
    text: "text-gray-400 dark:text-gray-500",
    icon: null,
    badge: "secondary" as const,
    badgeLabel: "待处理",
  },
};

export function ApprovalFlowDialog({
  open,
  onOpenChange,
  title,
  steps,
  onApprove,
  onReject,
}: ApprovalFlowDialogProps) {
  const hasCurrentStep = steps.some((s) => s.status === "current");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            审批流程共 {steps.length} 个步骤
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-0 py-2">
          {steps.map((step, index) => {
            const config = statusConfig[step.status];
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex items-center justify-center size-8 rounded-full border-2 shrink-0",
                      config.dot
                    )}
                  >
                    {config.icon ?? (
                      <span className="text-xs text-gray-400">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={cn(
                        "w-0.5 flex-1 min-h-8 my-1",
                        step.status === "completed"
                          ? config.line
                          : statusConfig.pending.line
                      )}
                    />
                  )}
                </div>

                <div
                  className={cn(
                    "flex-1 pb-6",
                    isLast && "pb-0"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", config.text)}>
                      {step.label}
                    </span>
                    <Badge variant={config.badge} className="text-[10px] px-1.5 py-0">
                      {config.badgeLabel}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <User className="size-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {step.assignee}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={onReject}
            disabled={!hasCurrentStep}
          >
            <X className="size-4" />
            驳回
          </Button>
          <Button
            onClick={onApprove}
            disabled={!hasCurrentStep}
          >
            <Check className="size-4" />
            通过
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
