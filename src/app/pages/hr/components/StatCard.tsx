import { Card, CardContent } from "@/app/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color?: string;
}

function parseChange(change: string) {
  const isUp = change.startsWith("+") || change.startsWith("↑");
  const isDown = change.startsWith("-") || change.startsWith("↓");
  const normalized = change.replace(/^[+\-↑↓]/, "").trim();
  return { isUp, isDown, normalized };
}

export function StatCard({ title, value, change, icon, color = "bg-blue-100 text-blue-600" }: StatCardProps) {
  const [bgColor, textColor] = color.split(" ");

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={`rounded-lg p-2 ${bgColor}`}>
            <div className={`[&>svg]:size-5 ${textColor}`}>{icon}</div>
          </div>
        </div>
        {change && (() => {
          const { isUp, isDown, normalized } = parseChange(change);
          return (
            <div className="mt-3 flex items-center gap-1 text-xs">
              {isUp && <TrendingUp className="size-3 text-green-600" />}
              {isDown && <TrendingDown className="size-3 text-red-600" />}
              <span
                className={
                  isUp
                    ? "text-green-600 font-medium"
                    : isDown
                      ? "text-red-600 font-medium"
                      : "text-muted-foreground"
                }
              >
                {change}
              </span>
              <span className="text-muted-foreground ml-1">较上月</span>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
