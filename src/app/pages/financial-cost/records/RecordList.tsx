import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog';
import { Plus, Search, Download, Trash2, Pencil, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { initialExpenseRecords, sourceTypeMap, defaultCategories, getSubCategories, type ExpenseRecord, type OwnerType } from '../mockData';

const PAGE_SIZE = 10;

export default function RecordList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ExpenseRecord[]>(initialExpenseRecords);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 筛选状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('all');
  const [filterSubCategoryId, setFilterSubCategoryId] = useState<string>('all');
  const [filterSourceType, setFilterSourceType] = useState<string>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filterSubCategories = useMemo(() => {
    if (filterCategoryId === 'all') return [];
    return getSubCategories(filterCategoryId);
  }, [filterCategoryId]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        if (
          !record.expenseNo.toLowerCase().includes(keyword) &&
          !record.description.toLowerCase().includes(keyword) &&
          !record.categoryName.toLowerCase().includes(keyword)
        ) return false;
      }
      if (filterCategoryId !== 'all' && record.categoryId !== filterCategoryId) return false;
      if (filterSubCategoryId !== 'all' && record.subCategoryId !== filterSubCategoryId) return false;
      if (filterSourceType !== 'all' && record.sourceType !== filterSourceType) return false;
      if (filterStartDate && record.expenseDate < filterStartDate) return false;
      if (filterEndDate && record.expenseDate > filterEndDate) return false;
      return true;
    });
  }, [records, searchKeyword, filterCategoryId, filterSubCategoryId, filterSourceType, filterStartDate, filterEndDate]);

  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE);
  const pagedRecords = filteredRecords.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totalAmount = useMemo(() => filteredRecords.reduce((sum, r) => sum + r.amount, 0), [filteredRecords]);

  const handleReset = () => {
    setSearchKeyword('');
    setFilterCategoryId('all');
    setFilterSubCategoryId('all');
    setFilterSourceType('all');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setRecords(prev => prev.filter(r => r.id !== deleteId));
    setDeleteId(null);
    toast.success('费用记录已删除');
  };

  const handleExport = () => {
    toast.success('导出功能开发中');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">费用记录</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" />
            导出
          </Button>
          <Button size="sm" onClick={() => navigate('/financial-cost/records/create')}>
            <Plus className="h-4 w-4 mr-1" />
            新增记录
          </Button>
        </div>
      </div>

      {/* 筛选条件 */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="col-span-2">
              <Label className="text-xs text-muted-foreground">关键词搜索</Label>
              <div className="relative mt-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="搜索编号、描述、分类..."
                  value={searchKeyword}
                  onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">一级分类</Label>
              <Select value={filterCategoryId} onValueChange={(v) => { setFilterCategoryId(v); setFilterSubCategoryId('all'); setCurrentPage(1); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {defaultCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">二级分类</Label>
              <Select value={filterSubCategoryId} onValueChange={(v) => { setFilterSubCategoryId(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {filterSubCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">数据来源</Label>
              <Select value={filterSourceType} onValueChange={(v) => { setFilterSourceType(v); setCurrentPage(1); }}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  {Object.entries(sourceTypeMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">开始日期</Label>
              <Input type="date" className="mt-1" value={filterStartDate} onChange={(e) => { setFilterStartDate(e.target.value); setCurrentPage(1); }} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">结束日期</Label>
              <Input type="date" className="mt-1" value={filterEndDate} onChange={(e) => { setFilterEndDate(e.target.value); setCurrentPage(1); }} />
            </div>
          </div>
          <div className="flex justify-end mt-3">
            <Button variant="ghost" size="sm" onClick={handleReset}>重置筛选</Button>
          </div>
        </CardContent>
      </Card>

      {/* 汇总信息 */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">共 <span className="font-medium text-foreground">{filteredRecords.length}</span> 条记录</span>
        <span className="text-muted-foreground">合计金额：<span className="font-medium text-foreground">¥{totalAmount.toLocaleString()}</span></span>
      </div>

      {/* 费用记录表格 */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">费用编号</TableHead>
                  <TableHead className="w-[110px]">日期</TableHead>
                  <TableHead className="w-[100px]">一级分类</TableHead>
                  <TableHead className="w-[100px]">二级分类</TableHead>
                  <TableHead className="w-[120px] text-right">金额</TableHead>
                  <TableHead className="w-[140px]">归属</TableHead>
                  <TableHead className="w-[100px]">数据来源</TableHead>
                  <TableHead className="w-[180px]">描述</TableHead>
                  <TableHead className="w-[100px]">操作人</TableHead>
                  <TableHead className="w-[100px] sticky right-0 bg-card">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  pagedRecords.map((record) => {
                    const sourceInfo = sourceTypeMap[record.sourceType];
                    const owner = record.projectName
                      ? `项目: ${record.projectName}`
                      : record.departmentName
                        ? `部门: ${record.departmentName}`
                        : '公司整体';
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium text-xs">{record.expenseNo}</TableCell>
                        <TableCell className="text-sm">{record.expenseDate}</TableCell>
                        <TableCell className="text-sm">{record.categoryName}</TableCell>
                        <TableCell className="text-sm">{record.subCategoryName}</TableCell>
                        <TableCell className="text-sm text-right font-medium">¥{record.amount.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{owner}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{sourceInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[180px] truncate">{record.description}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{record.createdBy}</TableCell>
                        <TableCell className="sticky right-0 bg-card">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/financial-cost/records/${record.id}`)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteId(record.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <span className="text-sm text-muted-foreground">
                第 {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filteredRecords.length)} 条，共 {filteredRecords.length} 条
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">{currentPage} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认 */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除该费用记录吗？</AlertDialogTitle>
            <AlertDialogDescription>删除后不可恢复。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
