import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { FileText, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import {
  buildChannelSummaries,
  calculateActualCost,
  calculateCompositeScore,
  calculateNominalCost,
  calculateValidRate,
  formatCurrency,
  initialDailyCostRecords,
} from './mockData';

export function LeadCostDashboard() {
  const summaries = buildChannelSummaries(initialDailyCostRecords);
  const totalSpend = initialDailyCostRecords.reduce((sum, item) => sum + item.spend, 0);
  const totalRefund = initialDailyCostRecords.reduce((sum, item) => sum + item.refund, 0);
  const totalValidLeads = initialDailyCostRecords.reduce((sum, item) => sum + item.validLeads, 0);
  const totalInvalidLeads = initialDailyCostRecords.reduce((sum, item) => sum + item.invalidLeads, 0);
  const averageNominalCost = totalValidLeads ? totalSpend / totalValidLeads : 0;
  const averageActualCost = totalValidLeads ? (totalSpend - totalRefund) / totalValidLeads : 0;
  const rankedSummaries = summaries
    .map((summary) => ({
      ...summary,
      score: calculateCompositeScore(summary, summaries),
    }))
    .sort((a, b) => b.score - a.score);
  const bestChannel = rankedSummaries[0];

  return (
    <div>
      <h4 className="text-lg font-semibold mb-6">线索成本看板</h4>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">今日总消耗</div>
            <div className="text-2xl font-bold">¥{formatCurrency(totalSpend)}</div>
            <div className="mt-2 text-sm text-muted-foreground">退款 {formatCurrency(totalRefund)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">有效线索总数</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5" />
              {totalValidLeads}条
            </div>
            <div className="mt-2 text-sm text-muted-foreground">无效线索 {totalInvalidLeads} 条</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">平均线索成本</div>
            <div className="text-2xl font-bold">¥{formatCurrency(averageActualCost)}</div>
            <div className="mt-2 text-sm text-muted-foreground">名义 {formatCurrency(averageNominalCost)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground">最佳渠道</div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {bestChannel?.score ?? 0}分
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{bestChannel?.channel ?? '暂无渠道'}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>渠道综合排名</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">排名</TableHead>
                  <TableHead className="w-24">平台</TableHead>
                  <TableHead className="w-48">渠道</TableHead>
                  <TableHead className="w-28">消耗</TableHead>
                  <TableHead className="w-28">退款</TableHead>
                  <TableHead className="w-24">有效线索</TableHead>
                  <TableHead className="w-24">无效线索</TableHead>
                  <TableHead className="w-32">有效率</TableHead>
                  <TableHead className="w-28">名义成本</TableHead>
                  <TableHead className="w-28">实际成本</TableHead>
                  <TableHead className="w-40">综合评分</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedSummaries.map((record, index) => (
                  <TableRow key={record.key}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell><Badge variant="default">{record.platform}</Badge></TableCell>
                    <TableCell>{record.channel}</TableCell>
                    <TableCell>{formatCurrency(record.spend)}</TableCell>
                    <TableCell>{formatCurrency(record.refund)}</TableCell>
                    <TableCell>{record.validLeads}</TableCell>
                    <TableCell>{record.invalidLeads}</TableCell>
                    <TableCell>{calculateValidRate(record).toFixed(1)}%</TableCell>
                    <TableCell>{formatCurrency(calculateNominalCost(record))}</TableCell>
                    <TableCell>{formatCurrency(calculateActualCost(record))}</TableCell>
                    <TableCell><Progress value={record.score} className="h-2" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <div className="font-semibold">成本口径说明</div>
              <div className="text-sm text-muted-foreground mt-1">
                名义成本 = 消耗金额 ÷ 有效线索数；实际成本 =（消耗金额 - 退款金额）÷ 有效线索数。
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
