import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { AdDeliveryRow, AdDeliveryReportContent } from './types';
import { getAdDeliveryMockData } from './templateConfig';

interface Props {
  content: AdDeliveryReportContent;
  onChange: (content: AdDeliveryReportContent) => void;
}

export function AdDeliveryDailyTemplate({ content, onChange }: Props) {
  const [rows, setRows] = useState<AdDeliveryRow[]>(content['ad-delivery-data']?.length ? content['ad-delivery-data'] : getAdDeliveryMockData());

  const updateRows = (newRows: AdDeliveryRow[]) => {
    setRows(newRows);
    onChange({ ...content, 'ad-delivery-data': newRows });
  };

  const updateCell = (id: string, field: keyof AdDeliveryRow, value: any) => {
    const newRows = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    updateRows(newRows);
  };

  const addRow = () => {
    const newRow: AdDeliveryRow = { id: `ad-${Date.now()}`, platform: '', account: '', spend: 0, impression: 0, click: 0, leads: 0 };
    updateRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    updateRows(rows.filter(r => r.id !== id));
  };

  const handleFieldChange = (field: keyof AdDeliveryReportContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  // 汇总
  const totalSpend = rows.reduce((s, r) => s + (r.spend || 0), 0);
  const totalImpression = rows.reduce((s, r) => s + (r.impression || 0), 0);
  const totalClick = rows.reduce((s, r) => s + (r.click || 0), 0);
  const totalLeads = rows.reduce((s, r) => s + (r.leads || 0), 0);
  const avgCTR = totalImpression > 0 ? ((totalClick / totalImpression) * 100).toFixed(2) : '0';
  const avgCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(1) : '0';

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">投放数据</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">平台</TableHead>
                <TableHead className="w-[120px]">账户</TableHead>
                <TableHead className="w-[100px]">消耗(元)</TableHead>
                <TableHead className="w-[90px]">展示</TableHead>
                <TableHead className="w-[80px]">点击</TableHead>
                <TableHead className="w-[70px]">线索</TableHead>
                <TableHead className="w-[70px]">CTR</TableHead>
                <TableHead className="w-[70px]">CPL</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      placeholder="如：百度"
                      value={row.platform}
                      onChange={(e) => updateCell(row.id, 'platform', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="账户名"
                      value={row.account}
                      onChange={(e) => updateCell(row.id, 'account', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={row.spend}
                      onChange={(e) => updateCell(row.id, 'spend', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={row.impression}
                      onChange={(e) => updateCell(row.id, 'impression', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={row.click}
                      onChange={(e) => updateCell(row.id, 'click', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      value={row.leads}
                      onChange={(e) => updateCell(row.id, 'leads', parseFloat(e.target.value) || 0)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {row.impression > 0 ? ((row.click / row.impression) * 100).toFixed(2) : '0.00'}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {row.leads > 0 ? `¥${(row.spend / row.leads).toFixed(1)}` : '—'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => removeRow(row.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-3 flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="h-4 w-4 mr-1" />
              添加平台
            </Button>
            <div className="flex gap-2">
              <Badge variant="secondary">总消耗 ¥{totalSpend.toLocaleString()}</Badge>
              <Badge variant="outline">展示 {totalImpression.toLocaleString()}</Badge>
              <Badge variant="outline">点击 {totalClick.toLocaleString()}</Badge>
              <Badge variant="secondary" className="bg-green-500 text-white">线索 {totalLeads}</Badge>
              <Badge variant="secondary" className="bg-orange-500 text-white">CTR {avgCTR}%</Badge>
              <Badge variant="secondary" className="bg-purple-500 text-white">CPL ¥{avgCPL}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">优化动作</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="今日做了哪些优化操作？（如：调整出价、更换素材、新增关键词等）"
            value={content['optimization-actions'] || ''}
            onChange={(e) => handleFieldChange('optimization-actions', e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">明日工作计划</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Textarea
            placeholder="请输入明日工作计划（必填）"
            value={content['tomorrow-plan'] || ''}
            onChange={(e) => handleFieldChange('tomorrow-plan', e.target.value)}
            rows={2}
          />
        </CardContent>
      </Card>
    </div>
  );
}
