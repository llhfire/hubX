import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface AIFeatureTagProps {
  text: string;
  detail: string;
  level?: "info" | "warning" | "suggestion";
}

const levelStyles = {
  info: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  suggestion:
    "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
};

export function AIFeatureTag({
  text,
  detail,
  level = "suggestion",
}: AIFeatureTagProps) {
  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Badge
              variant="outline"
              className={`cursor-pointer gap-1 ${levelStyles[level]}`}
            >
              <Sparkles className="size-3" />
              {text}
            </Badge>
          </PopoverTrigger>
          <PopoverContent className="w-64 text-sm">
            <div className="flex items-start gap-2">
              <Sparkles className="size-4 text-violet-500 mt-0.5 shrink-0" />
              <p className="text-muted-foreground leading-relaxed">{detail}</p>
            </div>
          </PopoverContent>
        </Popover>
      </motion.div>
    </AnimatePresence>
  );
}
