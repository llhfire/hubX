import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Search, Plus } from 'lucide-react';

export function PaymentInvoiceList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 模拟数据
  const mockData = [
    {
      id: '1',
      recordNo: 'PI20260425001',
      contractNo: 'CT20260320001',
      leadName: '阿里巴巴-企业管理系统',
      customerEntity: '阿里巴巴（中国）有限公司',
      ourEntity: '北京科技有限公司',
      totalAmount: 500000,
      receivedAmount: 200000,
      receivedRate: 40,
      invoicedAmount: 150000,
      invoicedRate: 30,
      type: '回款',
      status: '部分收款',
      latestDate: '2026-04-20',
      payments: [
        { period: 1, planDate: '2026-04-01', amount: 200000, actualDate: '2026-04-05', status: '已收款' },
        { period: 2, planDate: '2026-05-01', amount: 150000, actualDate: null, status: '未收款' },
        { period: 3, planDate: '2026-06-01', amount: 150000, actualDate: null, status: '未收款' },
      ],
      invoices: [
        { invoiceNo: 'INV20260410001', amount: 150000, invoiceDate: '2026-04-10', type: '增值税专用发票' },
      ],
    },
    {
      id: '2',
      recordNo: 'PI20260424001',
      contractNo: 'CT20260315001',
      leadName: '腾讯-云服务平台',
      customerEntity: '腾讯科技（深圳）有限公司',
      ourEntity: '北京科技有限公司',
      totalAmount: 800000,
      receivedAmount: 800000,
      receivedRate: 100,
      invoicedAmount: 800000,
      invoicedRate: 100,
      type: '发票',
      status: '已完成',
      latestDate: '2026-04-24',
      payments: [
        { period: 1, planDate: '2026-03-20', amount: 400000, actualDate: '2026-03-22', status: '已收款' },
        { period: 2, planDate: '2026-04-20', amount: 400000, actualDate: '2026-04-18', status: '已收款' },
      ],
      invoices: [
        { invoiceNo: 'INV20260325001', amount: 400000, invoiceDate: '2026-03-25', type: '增值税专用发票' },
        { invoiceNo: 'INV20260424001', amount: 400000, invoiceDate: '2026-04-24', type: '增值税专用发票' },
      ],
    },
  ];

  const handleSearch = () => {
    console.log('搜索条件：', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      keyword: '',
      type: '',
      status: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; text: string }> = {
      '部分收款': { variant: 'secondary', text: '部分收款' },
      '已完成': { variant: 'default', text: '已完成' },
      '逾期': { variant: 'destructive', text: '逾期' },
    };
    const config = statusMap[status] || { variant: 'outline' as const, text: status };
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              className="w-[200px]"
              placeholder="搜索编号/线索名称"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.type}
              onValueChange={(value) => setSearchForm({ ...searchForm, type: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="回款">回款</SelectItem>
                <SelectItem value="发票">发票</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="部分收款">部分收款</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="逾期">逾期</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.startDate}
              onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
            />
            <Input
              type="date"
              className="w-[140px]"
              value={searchForm.endDate}
              onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>回款与发票列表</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增记录
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">记录编号</TableHead>
                  <TableHead className="whitespace-nowrap">合同编号</TableHead>
                  <TableHead className="whitespace-nowrap">线索名称</TableHead>
                  <TableHead className="whitespace-nowrap">客户主体</TableHead>
                  <TableHead className="whitespace-nowrap">对接主体</TableHead>
                  <TableHead className="whitespace-nowrap">合同总额</TableHead>
                  <TableHead className="whitespace-nowrap">已收金额</TableHead>
                  <TableHead className="whitespace-nowrap">回款进度</TableHead>
                  <TableHead className="whitespace-nowrap">已开票金额</TableHead>
                  <TableHead className="whitespace-nowrap">开票进度</TableHead>
                  <TableHead className="whitespace-nowrap">状态</TableHead>
                  <TableHead className="whitespace-nowrap">最新日期</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="whitespace-nowrap">{record.recordNo}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.contractNo}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.leadName}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.customerEntity}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.ourEntity}</TableCell>
                    <TableCell className="whitespace-nowrap">{'¥'}{record.totalAmount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap">{'¥'}{record.receivedAmount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${record.receivedRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{record.receivedRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{'¥'}{record.invoicedAmount.toLocaleString()}</TableCell>
                    <TableCell className="whitespace-nowrap min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${record.invoicedRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{record.invoicedRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="whitespace-nowrap">{record.latestDate}</TableCell>
                    <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                      <Button variant="link" size="sm" onClick={() => handleViewDetail(record)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end mt-4 text-sm text-muted-foreground">
            共 {mockData.length} 条记录
          </div>
        </CardContent>
      </Card>

      {/* 详情弹窗 */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-[1000px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>回款与发票详情</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">记录编号</span>
                  <div className="font-medium">{selectedRecord.recordNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">合同编号</span>
                  <div className="font-medium">{selectedRecord.contractNo}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">线索名称</span>
                  <div className="font-medium">{selectedRecord.leadName}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">客户主体</span>
                  <div className="font-medium">{selectedRecord.customerEntity}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">对接主体</span>
                  <div className="font-medium">{selectedRecord.ourEntity}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">合同总额</span>
                  <div className="font-medium">{'¥'}{selectedRecord.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">已收金额</span>
                  <div className="font-medium">{'¥'}{selectedRecord.receivedAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">回款进度</span>
                  <div className="font-medium">{selectedRecord.receivedRate}%</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">已开票金额</span>
                  <div className="font-medium">{'¥'}{selectedRecord.invoicedAmount.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">开票进度</span>
                  <div className="font-medium">{selectedRecord.invoicedRate}%</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">状态</span>
                  <div>{getStatusBadge(selectedRecord.status)}</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-3">回款记录</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">期数</TableHead>
                      <TableHead className="whitespace-nowrap">计划日期</TableHead>
                      <TableHead className="whitespace-nowrap text-right">金额</TableHead>
                      <TableHead className="whitespace-nowrap">实际日期</TableHead>
                      <TableHead className="whitespace-nowrap">状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecord.payments.map((payment: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{payment.period}</TableCell>
                        <TableCell className="whitespace-nowrap">{payment.planDate}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{'¥'}{payment.amount.toLocaleString()}</TableCell>
                        <TableCell className="whitespace-nowrap">{payment.actualDate || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant={payment.status === '已收款' ? 'default' : 'secondary'}>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div>
                <div className="font-semibold mb-3">发票记录</div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">发票号</TableHead>
                      <TableHead className="whitespace-nowrap text-right">金额</TableHead>
                      <TableHead className="whitespace-nowrap">开票日期</TableHead>
                      <TableHead className="whitespace-nowrap">发票类型</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedRecord.invoices.map((invoice: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="whitespace-nowrap">{invoice.invoiceNo}</TableCell>
                        <TableCell className="whitespace-nowrap text-right">{'¥'}{invoice.amount.toLocaleString()}</TableCell>
                        <TableCell className="whitespace-nowrap">{invoice.invoiceDate}</TableCell>
                        <TableCell className="whitespace-nowrap">{invoice.type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
