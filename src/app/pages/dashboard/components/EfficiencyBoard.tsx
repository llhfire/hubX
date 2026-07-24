import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { efficiencyMetrics, efficiencySuggestion } from '../efficiency.mock';

const brandColors = {
  blue: 'hsl(221, 83%, 53%)',
  green: 'hsl(142, 76%, 36%)',
  amber: 'hsl(30, 90%, 44%)',
  red: 'hsl(0, 78%, 50%)',
};

/**
 * 效率健康度看板（区块 ④）。
 *
 * 4 个诊断指标：平均跟进间隔 / 平均阶段推进周期 / 平均成单周期 / 整体流失率。
 * 底部智能建议 = 单段静态字符串 + TODO 规则引擎（详见 plan §2 区块 ④）。
 */
export function EfficiencyBoard() {
  return (
    <Card className="h-full flex-1 w-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">效率健康度</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* 4 个指标卡 */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {efficiencyMetrics.map((metric, i) => {
            const dotColors = [brandColors.blue, brandColors.green, brandColors.amber, brandColors.red];
            return (
              <div
                key={metric.key}
                className="bg-muted/50 rounded-lg p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: dotColors[i % dotColors.length] }}
                  />
                  <span className="text-xs text-muted-foreground">{metric.label}</span>
                </div>
                <div className="text-[22px] font-bold text-foreground leading-tight">
                  {metric.value}
                </div>
                {metric.delta ? (
                  <div className="text-[11px] text-red-500 mt-1">
                    {metric.delta} 环比
                  </div>
                ) : (
                  <div className="text-[11px] text-muted-foreground mt-1">
                    — 基准期
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 智能建议 */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600">
              💡 系统智能建议
            </span>
            {/* TODO：未来接入规则引擎根据漏斗数据动态生成建议 */}
          </div>
          <p className="text-xs text-foreground m-0 leading-relaxed">
            {efficiencySuggestion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
