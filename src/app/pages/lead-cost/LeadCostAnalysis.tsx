import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Download } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  buildChannelSummaries,
  calculateActualCost,
  calculateCompositeScore,
  calculateNominalCost,
  calculateValidRate,
  formatCurrency,
  initialDailyCostRecords,
  platforms,
  safeDivide,
} from './mockData';

export function LeadCostAnalysis() {
  const summaries = buildChannelSummaries(initialDailyCostRecords);
  const rankedSummaries = summaries
    .map((summary) => ({
      ...summary,
      actualCost: calculateActualCost(summary),
      nominalCost: calculateNominalCost(summary),
      validRate: calculateValidRate(summary),
      qualityRate: safeDivide(summary.highQualityLeads, summary.validLeads) * 100,
      score: calculateCompositeScore(summary, summaries),
    }))
    .sort((a, b) => b.score - a.score);

  const barData = rankedSummaries.map((item) => ({
    channel: item.platform,
    消耗金额: item.spend,
    有效线索: item.validLeads,
  }));

  const radarData = [
    { subject: '成本优势', ...Object.fromEntries(rankedSummaries.map((item) => [item.platform, Math.max(0, 100 - item.actualCost / 5)])) },
    { subject: '有效率', ...Object.fromEntries(rankedSummaries.map((item) => [item.platform, item.validRate])) },
    { subject: '线索量', ...Object.fromEntries(rankedSummaries.map((item) => [item.platform, item.validLeads * 5])) },
    { subject: '客资质量', ...Object.fromEntries(rankedSummaries.map((item) => [item.platform, item.qualityRate])) },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">渠道分析</h4>
        <Button variant="outline" onClick={() => toast('第一版仅展示导出按钮，暂不实现真实导出')}>
          <Download className="mr-2 h-4 w-4" />
          导出 Excel
        </Button>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Input type="date" className="w-[130px]" />
            <Input type="date" className="w-[130px]" />
            <Select>
              <SelectTrigger className="w-[260px]">
                <SelectValue placeholder="平台" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>分析</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>消耗金额与有效线索数对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="消耗金额" fill="#165dff" />
                  <Bar dataKey="有效线索" fill="#00b42a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>渠道四维能力雷达图</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 320 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  {rankedSummaries.slice(0, 4).map((item, index) => (
                    <Radar
                      key={item.platform}
                      name={item.platform}
                      dataKey={item.platform}
                      stroke={['#165dff', '#00b42a', '#ff7d00', '#f53f3f'][index]}
                      fill={['#165dff', '#00b42a', '#ff7d00', '#f53f3f'][index]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>渠道综合明细</CardTitle>
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
                  <TableHead className="w-28">退款影响</TableHead>
                  <TableHead className="w-24">有效线索</TableHead>
                  <TableHead className="w-28">名义成本</TableHead>
                  <TableHead className="w-28">实际成本</TableHead>
                  <TableHead className="w-28">有效率</TableHead>
                  <TableHead className="w-28">客资质量</TableHead>
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
                    <TableCell>{formatCurrency(record.nominalCost)}</TableCell>
                    <TableCell>{formatCurrency(record.actualCost)}</TableCell>
                    <TableCell>{record.validRate.toFixed(1)}%</TableCell>
                    <TableCell>{record.qualityRate.toFixed(1)}%</TableCell>
                    <TableCell><Progress value={record.score} className="h-2" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
