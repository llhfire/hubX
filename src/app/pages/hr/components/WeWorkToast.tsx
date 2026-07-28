import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

export function showWeWorkToast(title: string, description: string) {
  toast(`📩 ${title}`, {
    description,
    style: {
      borderLeft: "4px solid #22c55e",
      cursor: "pointer",
    },
    position: "top-right",
    duration: 5000,
    action: {
      label: (
        <span className="flex items-center gap-1">
          <ExternalLink className="size-3" />
          查看
        </span>
      ),
      onClick: () => {
        window.open("https://work.weixin.qq.com", "_blank");
      },
    },
  });
}
