import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '../../components/ui/alert-dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Search, Plus, Eye, Pencil, Trash2, UserPlus, UserMinus, Download, RotateCcw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { toast } from 'sonner';
import type { Lead, LeadType, LeadStage, CustomerType, IntentLevel, LeadSource } from './types';
import { leadStageConfig, intentLevelConfig, customerTypeConfig, leadTypeConfig } from './types';
import { getLeadList, createLead, updateLead, claimLead, transferLead, releaseToPublic, markAsTrash } from './leads-api';
import { employees, entities } from './mock-data';

interface LeadListProps {
  leadType?: LeadType;
  showEntity?: boolean;
  title?: string;
}

export function LeadList({ leadType, showEntity = false, title = '全部线索' }: LeadListProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [searchForm, setSearchForm] = useState({
    keyword: '',
    ownerId: '',
    leadType: leadType || '' as LeadType | '',
  });

  // 弹窗状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // 确认弹窗状态
  const [confirmAction, setConfirmAction] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // 表单状态
  const [createForm, setCreateForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    wechat: '',
    source: '小红书' as LeadSource,
    customerType: '' as CustomerType | '',
    intentLevel: '' as IntentLevel | '',
    budget: '',
    entity: '中科软通',
    preSaleGroupName: '',
    remark: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    contactName: '',
    phone: '',
    wechat: '',
    source: '小红书' as LeadSource,
    customerType: '' as CustomerType | '',
    intentLevel: '' as IntentLevel | '',
    budget: '',
    entity: '中科软通',
    preSaleGroupName: '',
    remark: '',
  });

  const [transferForm, setTransferForm] = useState({
    newOwnerId: '',
    newOwnerName: '',
    reason: '',
  });

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const result = await getLeadList({
        keyword: searchForm.keyword || undefined,
        ownerId: searchForm.ownerId || undefined,
        leadType: (searchForm.leadType as LeadType) || leadType || undefined,
        page: currentPage,
        pageSize,
      });
      setLeads(result.list);
      setTotal(result.total);
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 计算分页
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 使用 setTimeout 确保 state 更新后再加载
    setTimeout(() => loadLeads(), 0);
  };

  const handleSearch = () => {
    loadLeads();
  };

  const handleReset = () => {
    setSearchForm({ keyword: '', ownerId: '', leadType: leadType || '' });
    setCurrentPage(1);
    setTimeout(() => loadLeads(), 0);
  };

  // 导出功能
  const handleExport = () => {
    const headers = ['编号', '录入时间', '线索类型', '归属人', '线索名称', '售前群名称', '客户类型', '线索来源', '线索状态', '意向等级', '预算金额'];
    const escapeCsvField = (value: string) => {
      const str = String(value ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };
    const csvContent = [
      headers.map(escapeCsvField).join(','),
      ...leads.map(lead => [
        lead.leadNo,
        lead.createTime,
        lead.leadType,
        lead.ownerName,
        lead.name,
        lead.preSaleGroupName || '',
        lead.customerType || '',
        lead.source,
        lead.stage,
        lead.intentLevel || '',
        lead.budget || '',
      ].map(escapeCsvField).join(','))
    ].join('\n');

    const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `线索列表_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    toast.success('导出成功');
  };

  // 批量操作
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(leads.map(l => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) {
      toast.error('请先选择线索');
      return;
    }
    setConfirmAction({
      title: '批量删除',
      description: `确定要删除选中的 ${selectedIds.length} 条线索吗？`,
      onConfirm: () => {
        toast.success(`已删除 ${selectedIds.length} 条线索`);
        setSelectedIds([]);
        loadLeads();
      },
    });
  };

  // 新建线索
  const handleCreate = async () => {
    if (!createForm.name) {
      toast.error('请输入线索名称');
      return;
    }
    try {
      await createLead({
        ...createForm,
        leadType: '公海',
        stage: '待分配',
      });
      toast.success('线索创建成功');
      setCreateModalVisible(false);
      setCreateForm({
        name: '', contactName: '', phone: '', wechat: '', source: '小红书',
        customerType: '', intentLevel: '', budget: '', entity: '中科软通',
        preSaleGroupName: '', remark: '',
      });
      loadLeads();
    } catch (error) {
      toast.error('创建失败');
    }
  };

  // 编辑线索
  const handleEdit = async () => {
    if (!selectedLead) return;
    if (!editForm.name) {
      toast.error('请输入线索名称');
      return;
    }
    try {
      await updateLead(selectedLead.id, editForm);
      toast.success('线索更新成功');
      setEditModalVisible(false);
      loadLeads();
    } catch (error) {
      toast.error('更新失败');
    }
  };

  // 认领线索
  const handleClaim = async (lead: Lead) => {
    try {
      await claimLead(lead.id, 'emp-001', '当前用户');
      toast.success('认领成功');
      loadLeads();
    } catch (error) {
      toast.error('认领失败');
    }
  };

  // 转给他人
  const handleTransfer = async () => {
    if (!selectedLead) return;
    if (!transferForm.newOwnerId) {
      toast.error('请选择新归属人');
      return;
    }
    try {
      await transferLead(selectedLead.id, transferForm.newOwnerId, transferForm.newOwnerName, transferForm.reason);
      toast.success('转移成功');
      setTransferModalVisible(false);
      loadLeads();
    } catch (error) {
      toast.error('转移失败');
    }
  };

  // 扔回公海
  const handleRelease = (lead: Lead) => {
    setConfirmAction({
      title: '扔回公海',
      description: '确定要将此线索扔回公海吗？',
      onConfirm: async () => {
        try {
          await releaseToPublic(lead.id);
          toast.success('已扔回公海');
          loadLeads();
        } catch (error) {
          toast.error('操作失败');
        }
      },
    });
  };

  // 标记为垃圾
  const handleMarkTrash = (lead: Lead) => {
    setConfirmAction({
      title: '标记为垃圾',
      description: '确定要将此线索标记为垃圾吗？',
      onConfirm: async () => {
        try {
          await markAsTrash(lead.id);
          toast.success('已标记为垃圾');
          loadLeads();
        } catch (error) {
          toast.error('操作失败');
        }
      },
    });
  };

  // 打开编辑弹窗
  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setEditForm({
      name: lead.name,
      contactName: lead.contactName,
      phone: lead.phone,
      wechat: lead.wechat,
      source: lead.source,
      customerType: lead.customerType || '',
      intentLevel: lead.intentLevel || '',
      budget: lead.budget || '',
      entity: lead.entity,
      preSaleGroupName: lead.preSaleGroupName || '',
      remark: lead.remark || '',
    });
    setEditModalVisible(true);
  };

  // 打开转移弹窗
  const openTransferModal = (lead: Lead) => {
    setSelectedLead(lead);
    setTransferForm({ newOwnerId: '', newOwnerName: '', reason: '' });
    setTransferModalVisible(true);
  };

  // 颜色映射（Tailwind 需要完整类名）
  const colorClassMap: Record<string, string> = {
    gray: 'border-gray-400 text-gray-600',
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    red: 'border-red-500 text-red-600',
    orange: 'border-orange-500 text-orange-600',
    purple: 'border-purple-500 text-purple-600',
    cyan: 'border-cyan-500 text-cyan-600',
    lime: 'border-lime-500 text-lime-600',
    yellow: 'border-yellow-500 text-yellow-600',
    success: 'border-green-500 text-green-600',
    default: 'border-gray-400 text-gray-600',
  };

  // 渲染状态标签
  const renderStageBadge = (stage: LeadStage) => {
    const config = leadStageConfig[stage];
    return <Badge variant="outline" className={colorClassMap[config.color] || colorClassMap.gray}>{config.label}</Badge>;
  };

  // 渲染意向等级标签
  const renderIntentBadge = (level?: IntentLevel) => {
    if (!level) return '-';
    const config = intentLevelConfig[level];
    return <Badge variant="outline" className={colorClassMap[config.color] || colorClassMap.gray}>{config.label}</Badge>;
  };

  // 渲染客户类型标签
  const renderCustomerTypeBadge = (type?: CustomerType) => {
    if (!type) return '-';
    const config = customerTypeConfig[type];
    return <Badge variant="outline" className={colorClassMap[config.color] || colorClassMap.gray}>{config.label}</Badge>;
  };

  // 渲染线索类型标签
  const renderLeadTypeBadge = (type: LeadType) => {
    const config = leadTypeConfig[type];
    return <Badge variant="outline" className={colorClassMap[config.color] || colorClassMap.gray}>{config.label}</Badge>;
  };

  // 渲染来源标签
  const renderSourceBadge = (source: string) => {
    const colorMap: Record<string, string> = {
      '百度': 'blue', '小红书': 'red', '抖音': 'purple',
      '威客': 'green', '高企名单': 'orange', '其他': 'gray',
    };
    const color = colorMap[source] || 'gray';
    return <Badge variant="outline" className={colorClassMap[color]}>{source}</Badge>;
  };

  // 新建线索表单
  const renderCreateForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>线索名称 <span className="text-destructive">*</span></Label>
          <Input placeholder="请输入线索名称" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>客户称呼</Label>
          <Input placeholder="请输入客户称呼" value={createForm.contactName} onChange={(e) => setCreateForm({ ...createForm, contactName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>联系电话</Label>
          <Input placeholder="请输入联系电话" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>微信</Label>
          <Input placeholder="请输入微信号" value={createForm.wechat} onChange={(e) => setCreateForm({ ...createForm, wechat: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>线索来源</Label>
          <Select value={createForm.source} onValueChange={(v) => setCreateForm({ ...createForm, source: v as LeadSource })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="百度">百度</SelectItem>
              <SelectItem value="小红书">小红书</SelectItem>
              <SelectItem value="抖音">抖音</SelectItem>
              <SelectItem value="威客">威客</SelectItem>
              <SelectItem value="高企名单">高企名单</SelectItem>
              <SelectItem value="其他">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>客户类型</Label>
          <Select value={createForm.customerType} onValueChange={(v) => setCreateForm({ ...createForm, customerType: v as CustomerType })}>
            <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="A类">A类</SelectItem>
              <SelectItem value="B类">B类</SelectItem>
              <SelectItem value="C类">C类</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>意向等级</Label>
          <Select value={createForm.intentLevel} onValueChange={(v) => setCreateForm({ ...createForm, intentLevel: v as IntentLevel })}>
            <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="意向高">意向高</SelectItem>
              <SelectItem value="意向中">意向中</SelectItem>
              <SelectItem value="意向低">意向低</SelectItem>
              <SelectItem value="无意向">无意向</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>客户预算</Label>
          <Input placeholder="如：30万以内" value={createForm.budget} onChange={(e) => setCreateForm({ ...createForm, budget: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>对接主体</Label>
          <Select value={createForm.entity} onValueChange={(v) => setCreateForm({ ...createForm, entity: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {entities.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>售前群名称</Label>
          <Input placeholder="请输入售前群名称" value={createForm.preSaleGroupName} onChange={(e) => setCreateForm({ ...createForm, preSaleGroupName: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>客户信息备注</Label>
        <Textarea rows={3} placeholder="请输入备注" value={createForm.remark} onChange={(e) => setCreateForm({ ...createForm, remark: e.target.value })} />
      </div>
    </div>
  );

  // 编辑线索表单
  const renderEditForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>线索名称 <span className="text-destructive">*</span></Label>
          <Input placeholder="请输入线索名称" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>客户称呼</Label>
          <Input placeholder="请输入客户称呼" value={editForm.contactName} onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>联系电话</Label>
          <Input placeholder="请输入联系电话" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>微信</Label>
          <Input placeholder="请输入微信号" value={editForm.wechat} onChange={(e) => setEditForm({ ...editForm, wechat: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>线索来源</Label>
          <Select value={editForm.source} onValueChange={(v) => setEditForm({ ...editForm, source: v as LeadSource })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="百度">百度</SelectItem>
              <SelectItem value="小红书">小红书</SelectItem>
              <SelectItem value="抖音">抖音</SelectItem>
              <SelectItem value="威客">威客</SelectItem>
              <SelectItem value="高企名单">高企名单</SelectItem>
              <SelectItem value="其他">其他</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>客户类型</Label>
          <Select value={editForm.customerType} onValueChange={(v) => setEditForm({ ...editForm, customerType: v as CustomerType })}>
            <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="A类">A类</SelectItem>
              <SelectItem value="B类">B类</SelectItem>
              <SelectItem value="C类">C类</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>意向等级</Label>
          <Select value={editForm.intentLevel} onValueChange={(v) => setEditForm({ ...editForm, intentLevel: v as IntentLevel })}>
            <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="意向高">意向高</SelectItem>
              <SelectItem value="意向中">意向中</SelectItem>
              <SelectItem value="意向低">意向低</SelectItem>
              <SelectItem value="无意向">无意向</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>客户预算</Label>
          <Input placeholder="如：30万以内" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>对接主体</Label>
          <Select value={editForm.entity} onValueChange={(v) => setEditForm({ ...editForm, entity: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {entities.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>售前群名称</Label>
          <Input placeholder="请输入售前群名称" value={editForm.preSaleGroupName} onChange={(e) => setEditForm({ ...editForm, preSaleGroupName: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>客户信息备注</Label>
        <Textarea rows={3} placeholder="请输入备注" value={editForm.remark} onChange={(e) => setEditForm({ ...editForm, remark: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {!leadType && (
              <Select value={searchForm.ownerId} onValueChange={(v) => setSearchForm({ ...searchForm, ownerId: v })}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="归属人" /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <Input className="w-[250px]" placeholder="请输入 线索名称/联系方式/微信" value={searchForm.keyword} onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })} />
            {!leadType && (
              <Select value={searchForm.leadType} onValueChange={(v) => setSearchForm({ ...searchForm, leadType: v as LeadType | '' })}>
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="线索类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="已认领">已认领</SelectItem>
                  <SelectItem value="公海">公海</SelectItem>
                  <SelectItem value="高企名单">高企名单</SelectItem>
                </SelectContent>
              </Select>
            )}
            <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700"><Search className="mr-2 h-4 w-4" />查询</Button>
            <Button variant="outline" onClick={handleReset}>重置</Button>
          </div>
        </CardContent>
      </Card>

      {/* 操作栏 */}
      <div className="flex items-center gap-2">
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setCreateModalVisible(true)}>
          <Plus className="mr-2 h-4 w-4" />新建线索
        </Button>
        <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" />导出</Button>
        {selectedIds.length > 0 && (
          <Button variant="destructive" onClick={handleBatchDelete}>
            <Trash2 className="mr-2 h-4 w-4" />删除选中 ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* 列表 */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap w-[60px]">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={selectedIds.length === leads.length && leads.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableHead>
                  <TableHead className="whitespace-nowrap">编号</TableHead>
                  <TableHead className="whitespace-nowrap">录入时间</TableHead>
                  <TableHead className="whitespace-nowrap">线索类型</TableHead>
                  <TableHead className="whitespace-nowrap">归属人</TableHead>
                  <TableHead className="whitespace-nowrap">历史归属人</TableHead>
                  <TableHead className="whitespace-nowrap">线索名称</TableHead>
                  <TableHead className="whitespace-nowrap">售前群名称</TableHead>
                  <TableHead className="whitespace-nowrap">客户类型</TableHead>
                  <TableHead className="whitespace-nowrap">线索来源</TableHead>
                  {showEntity && <TableHead className="whitespace-nowrap">对接主体</TableHead>}
                  <TableHead className="whitespace-nowrap">线索状态</TableHead>
                  <TableHead className="whitespace-nowrap">意向等级</TableHead>
                  <TableHead className="whitespace-nowrap">预算金额</TableHead>
                  <TableHead className="whitespace-nowrap sticky right-0 bg-background">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={showEntity ? 15 : 14} className="text-center py-8 text-muted-foreground">加载中...</TableCell>
                  </TableRow>
                ) : leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={showEntity ? 15 : 14} className="text-center py-8 text-muted-foreground">暂无数据</TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={selectedIds.includes(lead.id)}
                          onChange={(e) => handleSelectOne(lead.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-medium">{lead.leadNo}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.createTime}</TableCell>
                      <TableCell className="whitespace-nowrap">{renderLeadTypeBadge(lead.leadType)}</TableCell>
                      <TableCell className="whitespace-nowrap text-blue-600">{lead.ownerName}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {lead.historyOwners && lead.historyOwners.length > 0
                          ? `${lead.historyOwners[0].ownerName}/${lead.historyOwners.length}`
                          : '-/0'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Button variant="link" className="p-0 h-auto text-blue-600" onClick={() => navigate(`/leads/${lead.id}`)}>
                          {lead.name}
                        </Button>
                      </TableCell>
                      <TableCell className="whitespace-nowrap max-w-[150px] truncate">{lead.preSaleGroupName || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap">{renderCustomerTypeBadge(lead.customerType)}</TableCell>
                      <TableCell className="whitespace-nowrap">{renderSourceBadge(lead.source)}</TableCell>
                      {showEntity && <TableCell className="whitespace-nowrap">{lead.entity}</TableCell>}
                      <TableCell className="whitespace-nowrap">{renderStageBadge(lead.stage)}</TableCell>
                      <TableCell className="whitespace-nowrap">{renderIntentBadge(lead.intentLevel)}</TableCell>
                      <TableCell className="whitespace-nowrap">{lead.budget || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap sticky right-0 bg-background">
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/leads/${lead.id}`)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(lead)}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => openTransferModal(lead)}><UserMinus className="h-4 w-4" /></Button>
                          {lead.leadType === '公海' && (
                            <Button variant="ghost" size="sm" onClick={() => handleClaim(lead)}><UserPlus className="h-4 w-4" /></Button>
                          )}
                          {lead.leadType !== '公海' && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleRelease(lead)}><RotateCcw className="h-4 w-4" /></Button>
                                </TooltipTrigger>
                                <TooltipContent>扔回公海</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleMarkTrash(lead)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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
              {(() => {
                const pages: (number | 'ellipsis')[] = [];
                const windowSize = 2;
                const start = Math.max(2, currentPage - windowSize);
                const end = Math.min(totalPages - 1, currentPage + windowSize);

                pages.push(1);
                if (start > 2) pages.push('ellipsis');
                for (let i = start; i <= end; i++) pages.push(i);
                if (end < totalPages - 1) pages.push('ellipsis');
                if (totalPages > 1) pages.push(totalPages);

                return pages.map((page, idx) =>
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="text-muted-foreground px-1">...</span>
                  ) : (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      className={currentPage === page ? 'bg-blue-600' : ''}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                );
              })()}
              <Button variant="outline" size="sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => handlePageChange(currentPage + 1)}>
                下一页
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 新建线索弹窗 */}
      <Dialog open={createModalVisible} onOpenChange={setCreateModalVisible}>
        <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>新建线索</DialogTitle></DialogHeader>
          {renderCreateForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalVisible(false)}>取消</Button>
            <Button onClick={handleCreate}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑线索弹窗 */}
      <Dialog open={editModalVisible} onOpenChange={setEditModalVisible}>
        <DialogContent className="max-w-[700px] max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>编辑线索</DialogTitle></DialogHeader>
          {renderEditForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalVisible(false)}>取消</Button>
            <Button onClick={handleEdit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 转给他人弹窗 */}
      <Dialog open={transferModalVisible} onOpenChange={setTransferModalVisible}>
        <DialogContent>
          <DialogHeader><DialogTitle>转给他人</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>新归属人 <span className="text-destructive">*</span></Label>
              <Select value={transferForm.newOwnerId} onValueChange={(v) => {
                const emp = employees.find(e => e.id === v);
                setTransferForm({ ...transferForm, newOwnerId: v, newOwnerName: emp?.name || '' });
              }}>
                <SelectTrigger><SelectValue placeholder="请选择" /></SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>转移原因</Label>
              <Textarea rows={3} placeholder="请输入转移原因" value={transferForm.reason} onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferModalVisible(false)}>取消</Button>
            <Button onClick={handleTransfer}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 确认操作弹窗 */}
      <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={() => { confirmAction?.onConfirm(); setConfirmAction(null); }}>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
