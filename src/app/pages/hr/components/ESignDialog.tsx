import { useState } from "react";
import { CheckCircle, Pen } from "lucide-react";
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

interface ESignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: "试岗协议" | "劳动合同" | "离职证明";
  employeeName: string;
  onSigned?: (signId: string) => void;
}

const typeBadgeVariant: Record<string, "default" | "secondary" | "destructive"> = {
  "试岗协议": "secondary",
  "劳动合同": "default",
  "离职证明": "destructive",
};

export function ESignDialog({
  open,
  onOpenChange,
  documentType,
  employeeName,
  onSigned,
}: ESignDialogProps) {
  const [phase, setPhase] = useState<"preview" | "signing" | "done">("preview");
  const [signId, setSignId] = useState("");

  function handleSign() {
    setPhase("signing");
    setTimeout(() => {
      const id = `ES${Date.now().toString(36).toUpperCase()}`;
      setSignId(id);
      setPhase("done");
      onSigned?.(id);
    }, 800);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setPhase("preview");
      setSignId("");
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            电子签章
            <Badge variant={typeBadgeVariant[documentType]}>
              {documentType}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            签署人：{employeeName}
          </DialogDescription>
        </DialogHeader>

        {phase === "done" ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle className="size-16 text-green-500" />
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              签署成功
            </p>
            <div className="text-sm text-muted-foreground space-y-1 text-center">
              <p>文档类型：{documentType}</p>
              <p>
                签章编号：
                <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
                  {signId}
                </code>
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
              <p className="text-sm font-medium">
                {employeeName} - {documentType}
              </p>
              <div className="h-24 border border-dashed rounded-md flex items-center justify-center bg-background">
                <span className="text-xs text-muted-foreground">
                  [ 文档预览区域 ]
                </span>
              </div>
            </div>

            <div
              onClick={phase === "signing" ? undefined : handleSign}
              className="border-2 border-dashed rounded-lg h-28 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {phase === "signing" ? (
                <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Pen className="size-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    点击此处签署
                  </span>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                取消
              </Button>
              <Button
                onClick={handleSign}
                disabled={phase === "signing"}
              >
                {phase === "signing" ? "签署中..." : "确认签署"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
