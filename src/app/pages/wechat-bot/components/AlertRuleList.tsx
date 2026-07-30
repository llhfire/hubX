// 预警规则列表组件
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Clock, AlertTriangle, TrendingDown, Info, RefreshCw, Zap, Brain, User } from 'lucide-react';
import { AlertRule, AlertRuleType, AlertRuleSource, alertRuleTypeConfig, alertLevelConfig } from '../types';

interface AlertRuleListProps {
  rules: AlertRule[];
  onToggleRule: (id: string) => void;
}

const typeIcons: Record<AlertRuleType, typeof Clock> = {
  '客户沉默': Clock,
  '负面情绪': AlertTriangle,
  '活跃度下降': TrendingDown,
  '关键信息缺失': Info,
  '变更未确认': RefreshCw,
};

const sourceIcons: Record<AlertRuleSource, typeof Zap> = {
  '预置': Zap,
  'AI学习': Brain,
  '人工': User,
};

export function AlertRuleList({ rules, onToggleRule }: AlertRuleListProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">预警规则</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rules.map(rule => {
          const TypeIcon = typeIcons[rule.ruleType];
          const SourceIcon = sourceIcons[rule.source];
          const typeConfig = alertRuleTypeConfig[rule.ruleType];
          const levelConfig = alertLevelConfig[rule.alertLevel];

          return (
            <div
              key={rule.id}
              className={`flex items-center justify-between p-2 rounded-md border ${
                rule.isEnabled ? 'bg-white' : 'bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <TypeIcon className="h-4 w-4 shrink-0" style={{ color: `var(--${typeConfig.color}-500)` }} />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium truncate">{rule.name}</span>
                    <Badge variant="outline" className={`text-[10px] py-0 h-4 ${levelConfig.color === 'red' ? 'bg-red-50 border-red-200 text-red-700' : levelConfig.color === 'orange' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                      {levelConfig.label}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] py-0 h-4">
                      <SourceIcon className="h-2.5 w-2.5 mr-0.5" />
                      {rule.source}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">{rule.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-muted-foreground">
                  触发 {rule.triggerCount} 次
                </span>
                <Switch
                  checked={rule.isEnabled}
                  onCheckedChange={() => onToggleRule(rule.id)}
                  className="h-4 w-7"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
