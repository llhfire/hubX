// 满意度信号展示组件
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Smile, Meh, Frown, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Signal {
  type: 'positive' | 'neutral' | 'negative';
  text: string;
}

interface SatisfactionSignalProps {
  signals: Signal[];
  summary?: string;
}

const signalConfig = {
  positive: { icon: Smile, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  neutral: { icon: Meh, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  negative: { icon: Frown, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
};

export function SatisfactionSignal({ signals, summary }: SatisfactionSignalProps) {
  const positiveCount = signals.filter(s => s.type === 'positive').length;
  const negativeCount = signals.filter(s => s.type === 'negative').length;

  let overallTrend: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount + 1) overallTrend = 'positive';
  if (negativeCount > positiveCount + 1) overallTrend = 'negative';

  const TrendIcon = overallTrend === 'positive' ? TrendingUp : overallTrend === 'negative' ? TrendingDown : Minus;
  const trendColor = overallTrend === 'positive' ? 'text-green-600' : overallTrend === 'negative' ? 'text-red-600' : 'text-gray-600';

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">客户满意度信号</CardTitle>
          <div className="flex items-center gap-1">
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            <span className={`text-xs font-medium ${trendColor}`}>
              {overallTrend === 'positive' ? '积极' : overallTrend === 'negative' ? '需关注' : '平稳'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {signals.map((signal, i) => {
            const config = signalConfig[signal.type];
            const Icon = config.icon;
            return (
              <Badge key={i} variant="outline" className={`${config.bg} ${config.border} ${config.color} text-xs py-0.5`}>
                <Icon className="h-3 w-3 mr-1" />
                {signal.text}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
