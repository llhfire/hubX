import { toast } from "sonner";

export function showWeWorkToast(title: string, description: string) {
  toast(`📩 ${title}`, {
    description,
    style: {
      borderLeft: "4px solid #22c55e",
    },
    position: "top-right",
    duration: 5000,
  });
}
