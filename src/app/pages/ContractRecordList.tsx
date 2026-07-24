import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../components/ui/select';
import { Search, Plus } from 'lucide-react';

const statusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case '已完成':
      return 'default';
    case '执行中':
      return 'secondary';
    case '已终止':
      return 'destructive';
    default:
      return 'outline';
  }
};

export function ContractRecordList() {
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  // 模拟数据
  const mockData = [
    {
      id: '1',
      contractNo: 'CT20260320001',
      contractName: '企业管理系统开发合同',
      leadName: '阿里巴巴-企业管理系统',
      customerEntity: '阿里巴巴（中国）有限公司',
      ourEntity: '北京科技有限公司',
      amount: 500000,
      signDate: '2026-03-20',
      startDate: '2026-04-01',
      endDate: '2026-09-30',
      status: '执行中',
      paymentTerms: '分3期付款',
      owner: '张三',
      department: '销售部',
      scope: '包括系统需求分析、设计开发、测试部署、培训及1年维护服务。',
    },
    {
      id: '2',
      contractNo: 'CT20260315001',
      contractName: '云服务平台建设合同',
      leadName: '腾讯-云服务平台',
      customerEntity: '腾讯科技（深圳）有限公司',
      ourEntity: '北京科技有限公司',
      amount: 800000,
      signDate: '2026-03-15',
      startDate: '2026-03-20',
      endDate: '2026-08-20',
      status: '已完成',
      paymentTerms: '分2期付款',
      owner: '李四',
      department: '销售部',
      scope: '云平台架构设计、开发部署、系统集成及技术支持服务。',
    },
    {
      id: '3',
      contractNo: 'CT20260310001',
      contractName: '协作工具定制开发合同',
      leadName: '字节跳动-协作工具',
      customerEntity: '北京字节跳动科技有限公司',
      ourEntity: '上海分公司',
      amount: 350000,
      signDate: '2026-03-10',
      startDate: '2026-03-15',
      endDate: '2026-07-15',
      status: '已终止',
      paymentTerms: '签约付30%，交付付70%',
      owner: '王五',
      department: '销售部',
      scope: '协作系统功能定制、界面设计、开发测试及上线部署。',
    },
  ];

  const handleSearch = () => {
    console.log('搜索条件：', searchForm);
  };

  const handleReset = () => {
    setSearchForm({
      keyword: '',
      status: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleViewDetail = (record: any) => {
    setSelectedContract(record);
    setDetailVisible(true);
  };

  return (
    <div>
      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              className="w-[200px]"
              placeholder="搜索合同编号/名称"
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
            />
            <Select
              value={searchForm.status}
              onValueChange={(value) => setSearchForm({ ...searchForm, status: value === '__all__' ? '' : value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">全部</SelectItem>
                <SelectItem value="执行中">执行中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
                <SelectItem value="已终止">已终止</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                className="w-[150px]"
                value={searchForm.startDate}
                onChange={(e) => setSearchForm({ ...searchForm, startDate: e.target.value })}
              />
              <span className="text-muted-foreground text-sm">至</span>
              <Input
                type="date"
                className="w-[150px]"
                value={searchForm.endDate}
                onChange={(e) => setSearchForm({ ...searchForm, endDate: e.target.value })}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="size-4" />
              搜索
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>合同记录列表</CardTitle>
          <CardAction>
            <Button>
              <Plus className="size-4" />
              新增合同
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px]">合同编号</TableHead>
                  <TableHead className="min-w-[200px]">合同名称</TableHead>
                  <TableHead className="min-w-[200px]">线索名称</TableHead>
                  <TableHead className="min-w-[200px]">客户主体</TableHead>
                  <TableHead className="min-w-[150px]">对接主体</TableHead>
                  <TableHead className="min-w-[120px]">合同金额</TableHead>
                  <TableHead className="min-w-[120px]">签订日期</TableHead>
                  <TableHead className="min-w-[120px]">开始日期</TableHead>
                  <TableHead className="min-w-[120px]">结束日期</TableHead>
                  <TableHead className="min-w-[100px]">负责人</TableHead>
                  <TableHead className="min-w-[120px]">部门</TableHead>
                  <TableHead className="min-w-[100px]">状态</TableHead>
                  <TableHead className="min-w-[100px] sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.contractNo}</TableCell>
                    <TableCell>{record.contractName}</TableCell>
                    <TableCell>{record.leadName}</TableCell>
                    <TableCell>{record.customerEntity}</TableCell>
                    <TableCell>{record.ourEntity}</TableCell>
                    <TableCell>{`¥${record.amount.toLocaleString()}`}</TableCell>
                    <TableCell>{record.signDate}</TableCell>
                    <TableCell>{record.startDate}</TableCell>
                    <TableCell>{record.endDate}</TableCell>
                    <TableCell>{record.owner}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeVariant(record.status)}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="sticky right-0 bg-background">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetail(record)}>
                        查看详情
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* 分页 */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-muted-foreground text-sm">
              共 {mockData.length} 条
            </span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>
                上一页
              </Button>
              <Button variant="default" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 详情 Dialog */}
      <Dialog open={detailVisible} onOpenChange={setDetailVisible}>
        <DialogContent className="max-w-[900px]">
          <DialogHeader>
            <DialogTitle>合同详情</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">合同编号：</span>
                  <span className="text-sm font-medium">{selectedContract.contractNo}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">合同名称：</span>
                  <span className="text-sm font-medium">{selectedContract.contractName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">线索名称：</span>
                  <span className="text-sm font-medium">{selectedContract.leadName}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">客户主体：</span>
                  <span className="text-sm font-medium">{selectedContract.customerEntity}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">对接主体：</span>
                  <span className="text-sm font-medium">{selectedContract.ourEntity}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">合同金额：</span>
                  <span className="text-sm font-medium">{`¥${selectedContract.amount.toLocaleString()}`}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">签订日期：</span>
                  <span className="text-sm font-medium">{selectedContract.signDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">开始日期：</span>
                  <span className="text-sm font-medium">{selectedContract.startDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">结束日期：</span>
                  <span className="text-sm font-medium">{selectedContract.endDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">负责人：</span>
                  <span className="text-sm font-medium">{selectedContract.owner}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">部门：</span>
                  <span className="text-sm font-medium">{selectedContract.department}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">付款条款：</span>
                  <span className="text-sm font-medium">{selectedContract.paymentTerms}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-sm shrink-0">状态：</span>
                  <Badge variant={statusBadgeVariant(selectedContract.status)}>
                    {selectedContract.status}
                  </Badge>
                </div>
              </div>

              {/* 合同范围 */}
              <div>
                <span className="font-semibold text-sm">合同范围</span>
                <div className="mt-2 p-3 rounded-md border bg-muted/30 text-sm">
                  {selectedContract.scope}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
