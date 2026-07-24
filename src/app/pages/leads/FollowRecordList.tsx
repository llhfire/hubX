import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { FollowRecord, FollowMethod, LeadStage, IntentLevel } from './types';
import { leadStageConfig, intentLevelConfig } from './types';
import { getFollowRecordList, createFollowRecord, getLeadList } from './leads-api';
import { employees } from './mock-data';

export function FollowRecordList() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<FollowRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [filterType, setFilterType] = useState<'all' | 'today_pending' | 'today_done' | 'overdue'>('all');
  const [searchForm, setSearchForm] = useState({
    leadNo: '',
    leadName: '',
    followerId: '',
  });

  // 跟进记录弹窗
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [followForm, setFollowForm] = useState({
    leadId: '',
    method: '微信沟通' as FollowMethod,
    stage: '初步建联' as LeadStage,
    intentLevel: '意向中' as IntentLevel,
    content: '',
    duration: 1,
    nextFollowTime: '',
  });

  // 线索列表（用于下拉选择）
  const [leadOptions, setLeadOptions] = useState<{ id: string; leadNo: string; name: string }[]>([]);

  useEffect(() => {
    loadRecords();
    loadLeadOptions();
  }, [filterType]);

  const loadLeadOptions = async () => {
    const result = await getLeadList({ pageSize: 100 });
    setLeadOptions(result.list.map(l => ({ id: l.id, leadNo: l.leadNo, name: l.name })));
  };

  const loadRecords = async () => {
    setLoading(true);
    try {
      const result = await getFollowRecordList({
        leadNo: searchForm.leadNo || undefined,
        followerId: searchForm.followerId || undefined,
        filterType,
        page: currentPage,
        pageSize,
      });
      setRecords(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setTimeout(() => loadRecords(), 0);
  };

  const handleReset = () => {
    setSearchForm({ leadNo: '', leadName: '', followerId: '' });
    setFilterType('all');
    setCurrentPage(1);
    setTimeout(() => loadRecords(), 0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => loadRecords(), 0);
  };

  // 创建跟进记录
  const handleCreateFollow = async () => {
    if (!followForm.leadId) {
      toast.error('请选择线索');
      return;
    }
    if (!followForm.content) {
      toast.error('请输入跟进详情');
      return;
    }
    const lead = leadOptions.find(l => l.id === followForm.leadId);
    if (!lead) {
      toast.error('线索不存在');
      return;
    }
    try {
      await createFollowRecord({
        ...followForm,
        leadNo: lead.leadNo,
        leadName: lead.name,
        followerId: 'emp-001',
        followerName: '当前用户',
      });
      toast.success('跟进记录已添加');
      setFollowModalVisible(false);
      setFollowForm({
        leadId: '', method: '微信沟通', stage: '初步建联', intentLevel: '意向中',
        content: '', duration: 1, nextFollowTime: '',
      });
      loadRecords();
    } catch (error) {
      toast.error('创建失败');
    }
  };

  // 计算跟进剩余时间
  const getRemainingTime = (nextFollowTime?: string) => {
    if (!nextFollowTime) return { text: '-', isOverdue: false };
    const now = new Date();
    const next = new Date(nextFollowTime);
    const diff = next.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 0) {
      return { text: '已超期', isOverdue: true };
    }
    if (hours < 24) {
      return { text: `${hours}小时后`, isOverdue: false };
    }
    const days = Math.floor(hours / 24);
    return { text: `${days}天后`, isOverdue: false };
  };

  // 计算分页
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      {/* 顶部 Tab */}
      <Tabs value={filterType} onValueChange={(v) => setFilterType(v as any)}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="today_pending">今日待跟进</TabsTrigger>
          <TabsTrigger value="today_done">今日已跟进</TabsTrigger>
          <TabsTrigger value="overdue">超期未跟进</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 搜索栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Input
              className="w-[180px]"
              placeholder="线索编号"
              value={searchForm.leadNo}
              onChange={(e) => setSearchForm({ ...searchForm, leadNo: e.target.value })}
            />
            <Input
              className="w-[180px]"
              placeholder="线索名称"
              value={searchForm.leadName}
              onChange={(e) => setSearchForm({ ...searchForm, leadName: e.target.value })}
            />
            <Select
              value={searchForm.followerId}
              onValueChange={(value) => setSearchForm({ ...searchForm, followerId: value })}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="跟进人" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" />
              查询
            </Button>
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setFollowModalVisible(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新增跟进
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 列表 */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">线索编号</TableHead>
                  <TableHead className="whitespace-nowrap">线索名称</TableHead>
                  <TableHead className="whitespace-nowrap">跟进剩余时间</TableHead>
                  <TableHead className="whitespace-nowrap">下次跟进时间</TableHead>
                  <TableHead className="whitespace-nowrap">线索状态</TableHead>
                  <TableHead className="whitespace-nowrap">售前群名称</TableHead>
                  <TableHead className="whitespace-nowrap">客户称呼</TableHead>
                  <TableHead className="whitespace-nowrap">联系电话</TableHead>
                  <TableHead className="whitespace-nowrap">微信</TableHead>
                  <TableHead className="whitespace-nowrap">跟进人</TableHead>
                  <TableHead className="whitespace-nowrap">跟进方式</TableHead>
                  <TableHead className="whitespace-nowrap">跟进内容</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      加载中...
                    </TableCell>
                  </TableRow>
                ) : records.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  records.map((record) => {
                    const remaining = getRemainingTime(record.nextFollowTime);
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="whitespace-nowrap font-medium">{record.leadNo}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Button
                            variant="link"
                            className="p-0 h-auto text-blue-600"
                            onClick={() => window.location.href = `/leads/${record.leadId}`}
                          >
                            {record.leadName}
                          </Button>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className={remaining.isOverdue ? 'text-red-600 font-medium' : 'text-orange-600'}>
                            {remaining.text}
                          </span>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">{record.nextFollowTime || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline">{leadStageConfig[record.stage]?.label}</Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap max-w-[150px] truncate">{record.leadInfo?.preSaleGroupName || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{record.leadInfo?.contactName || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{record.leadInfo?.phone || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{record.leadInfo?.wechat || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{record.followerName}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-300">
                            {record.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap max-w-[200px] truncate">
                          {record.content}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">共有 {total} 条数据</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                上一页
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    className={currentPage === page ? 'bg-blue-600' : ''}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => handlePageChange(currentPage + 1)}>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 添加跟进记录弹窗 */}
      <Dialog open={followModalVisible} onOpenChange={setFollowModalVisible}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader><DialogTitle>添加跟进记录</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>选择线索 <span className="text-destructive">*</span></Label>
              <Select value={followForm.leadId} onValueChange={(v) => setFollowForm({ ...followForm, leadId: v })}>
                <SelectTrigger><SelectValue placeholder="请选择线索" /></SelectTrigger>
                <SelectContent>
                  {leadOptions.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>{lead.leadNo} - {lead.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>跟进方式 <span className="text-destructive">*</span></Label>
              <div className="flex gap-4">
                {(['电话沟通', '微信沟通', '上门拜访', '其他'] as FollowMethod[]).map((method) => (
                  <label key={method} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="method"
                      value={method}
                      checked={followForm.method === method}
                      onChange={(e) => setFollowForm({ ...followForm, method: e.target.value as FollowMethod })}
                      className="accent-blue-600"
                    />
                    {method}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>客户状态 <span className="text-destructive">*</span></Label>
              <Select value={followForm.stage} onValueChange={(v) => setFollowForm({ ...followForm, stage: v as LeadStage })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(leadStageConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>意向等级</Label>
              <div className="flex gap-4">
                {(['意向高', '意向中', '意向低', '无意向'] as IntentLevel[]).map((level) => (
                  <label key={level} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="intentLevel"
                      value={level}
                      checked={followForm.intentLevel === level}
                      onChange={(e) => setFollowForm({ ...followForm, intentLevel: e.target.value as IntentLevel })}
                      className="accent-blue-600"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>消耗时间（分钟）</Label>
                <Input
                  type="number"
                  min={0}
                  value={followForm.duration}
                  onChange={(e) => setFollowForm({ ...followForm, duration: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>下次跟进提醒</Label>
                <Input
                  type="datetime-local"
                  value={followForm.nextFollowTime}
                  onChange={(e) => setFollowForm({ ...followForm, nextFollowTime: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>跟进详情 <span className="text-destructive">*</span></Label>
              <Textarea
                rows={4}
                placeholder="请详细记录本次沟通的内容、客户反馈、关键信息等"
                value={followForm.content}
                onChange={(e) => setFollowForm({ ...followForm, content: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>附件上传</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                点击或拖拽文件到此处上传
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowModalVisible(false)}>取消</Button>
            <Button onClick={handleCreateFollow}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
