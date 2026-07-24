import { useState, useMemo } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Progress } from '../../components/ui/progress';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Cloud,
  Globe,
  Lock,
  Smartphone,
  FileText,
  Copyright,
  Lightbulb,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Grid3X3,
} from 'lucide-react';

// ---------- 类型 ----------

type AssetType = 'server' | 'domain' | 'ssl' | 'device' | 'license' | 'software-copyright' | 'patent';
type AssetStatus = 'active' | 'expiring' | 'expired' | 'transferred' | 'returned';

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  vendor: string;
  purchaseDate: string;
  expiryDate: string;
  cost: number;
  status: AssetStatus;
  assignee?: string;
  department?: string;
  serialNumber?: string;
  notes?: string;
}

interface InventoryRecord {
  id: string;
  date: string;
  operator: string;
  totalAssets: number;
  checkedAssets: number;
  anomalies: number;
  notes: string;
}

// ---------- 工具 ----------

const ASSET_TYPE_LABELS: Record<AssetType, { label: string; icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  server:              { label: '服务器',       icon: <Cloud className="size-3.5" />,       variant: 'default' },
  domain:              { label: '域名',         icon: <Globe className="size-3.5" />,       variant: 'secondary' },
  ssl:                 { label: 'SSL 证书',     icon: <Lock className="size-3.5" />,        variant: 'outline' },
  device:              { label: '设备',         icon: <Smartphone className="size-3.5" />,  variant: 'secondary' },
  license:             { label: '软件许可证',    icon: <FileText className="size-3.5" />,    variant: 'outline' },
  'software-copyright': { label: '软件著作权',   icon: <Copyright className="size-3.5" />,   variant: 'outline' },
  patent:              { label: '专利',         icon: <Lightbulb className="size-3.5" />,   variant: 'secondary' },
};

const STATUS_LABELS: Record<AssetStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  active:      { label: '正常使用', variant: 'default' },
  expiring:    { label: '即将到期', variant: 'secondary' },
  expired:     { label: '已到期',   variant: 'destructive' },
  transferred: { label: '已转让',   variant: 'outline' },
  returned:    { label: '已归还',   variant: 'default' },
};

function getDaysUntil(dateStr: string): number {
  return Math.ceil((new Date(dateStr).getTime() - new Date('2026-07-02').getTime()) / (1000 * 60 * 60 * 24));
}

function calcStatus(expiryDate: string, currentStatus?: AssetStatus): AssetStatus {
  if (currentStatus === 'transferred' || currentStatus === 'returned') return currentStatus;
  const days = getDaysUntil(expiryDate);
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring';
  return 'active';
}

// ---------- 模拟数据 ----------

const mockAssets: Asset[] = [
  { id: 'ast-1', name: '阿里云 ECS-生产服务器', type: 'server',   vendor: '阿里云',   purchaseDate: '2025-01-15', expiryDate: '2027-01-15', cost: 48000, status: 'active',     serialNumber: 'ECS-2025-001', notes: '主生产环境' },
  { id: 'ast-2', name: '公司官网域名 hubx.cn', type: 'domain',   vendor: '万网',     purchaseDate: '2024-08-01', expiryDate: '2026-08-01', cost: 500,   status: 'expiring',   assignee: '张三', department: '技术部' },
  { id: 'ast-3', name: '通配符SSL证书 *.hubx.cn', type: 'ssl',   vendor: 'DigiCert', purchaseDate: '2025-06-01', expiryDate: '2026-06-01', cost: 3200,  status: 'expired',    notes: '需要续签' },
  { id: 'ast-4', name: 'MacBook Pro M3 16寸', type: 'device',   vendor: 'Apple',    purchaseDate: '2025-09-01', expiryDate: '2028-09-01', cost: 18999, status: 'active',     assignee: '李四', department: '技术部', serialNumber: 'MBP-2025-012' },
  { id: 'ast-5', name: 'Figma 团队版许可证',     type: 'license', vendor: 'Figma',    purchaseDate: '2026-01-01', expiryDate: '2027-01-01', cost: 12000, status: 'active',     assignee: '陈明', department: '技术部' },
  { id: 'ast-6', name: '阿里云 OSS 存储',        type: 'server',   vendor: '阿里云',   purchaseDate: '2025-03-01', expiryDate: '2026-09-15', cost: 12000, status: 'expiring',   notes: '对象存储服务' },
  { id: 'ast-7', name: 'iPhone 16 Pro',         type: 'device',   vendor: 'Apple',    purchaseDate: '2026-03-01', expiryDate: '2029-03-01', cost: 8999,  status: 'active',     assignee: '王五', department: '销售部', serialNumber: 'IP16-003' },
  { id: 'ast-8', name: 'JetBrains 全家桶',      type: 'license', vendor: 'JetBrains', purchaseDate: '2026-02-01', expiryDate: '2027-02-01', cost: 6800,  status: 'active',     assignee: '技术部', department: '技术部' },
  { id: 'ast-9', name: '测试服务器-华为云',       type: 'server',   vendor: '华为云',   purchaseDate: '2025-06-01', expiryDate: '2026-07-20', cost: 24000, status: 'expiring',   notes: '测试环境' },
  { id: 'ast-10', name: '域名 hubx.com',        type: 'domain',  vendor: 'GoDaddy',  purchaseDate: '2024-05-01', expiryDate: '2026-07-15', cost: 800,   status: 'expiring',   assignee: '张三', department: '技术部' },
  { id: 'ast-11', name: 'Dell 显示器 27寸',      type: 'device',  vendor: 'Dell',     purchaseDate: '2024-11-01', expiryDate: '2027-11-01', cost: 3500,  status: 'active',     assignee: '赵六', department: '产品部', serialNumber: 'DELL-MON-005' },
  { id: 'ast-12', name: 'Microsoft 365 商业版', type: 'license', vendor: 'Microsoft', purchaseDate: '2026-04-01', expiryDate: '2027-04-01', cost: 15000, status: 'active',     assignee: '全公司', department: '行政部' },
  { id: 'ast-13', name: 'HubX CRM 系统软件 V1.0', type: 'software-copyright', vendor: '自研', purchaseDate: '2025-08-15', expiryDate: '2075-08-15', cost: 0, status: 'active', serialNumber: '软著登字第2025SR001234号', notes: '公司核心产品软著，永久有效' },
  { id: 'ast-14', name: '智能投放优化算法', type: 'patent', vendor: '自研', purchaseDate: '2025-11-20', expiryDate: '2045-11-20', cost: 25000, status: 'active', serialNumber: 'ZL202510000000.X', notes: '发明专利：基于AI的广告投放优化方法' },
  { id: 'ast-15', name: 'HubX 数据分析平台 V2.0', type: 'software-copyright', vendor: '自研', purchaseDate: '2026-02-01', expiryDate: '2076-02-01', cost: 0, status: 'active', serialNumber: '软著登字第2026SR005678号' },
  { id: 'ast-16', name: '一种分布式任务调度系统', type: 'patent', vendor: '自研', purchaseDate: '2026-04-10', expiryDate: '2046-04-10', cost: 30000, status: 'active', serialNumber: 'ZL202610000000.X', notes: '发明专利，已受理' },
];

const mockInventoryRecords: InventoryRecord[] = [
  { id: 'inv-1', date: '2026-06-15', operator: '张三', totalAssets: 12, checkedAssets: 12, anomalies: 0, notes: '季度盘点，全部正常' },
  { id: 'inv-2', date: '2026-03-15', operator: '李四', totalAssets: 11, checkedAssets: 10, anomalies: 1, notes: '一台显示器无法开机，已报修' },
  { id: 'inv-3', date: '2025-12-15', operator: '张三', totalAssets: 10, checkedAssets: 10, anomalies: 0, notes: '年度盘点' },
];

// ---------- 主组件 ----------

export function AssetManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [filterType, setFilterType] = useState<AssetType | ''>('');
  const [filterStatus, setFilterStatus] = useState<AssetStatus | ''>('');

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    type: 'server' as AssetType,
    vendor: '',
    cost: '',
    purchaseDate: '2026-07-02',
    expiryDate: '',
    assignee: '',
    department: '',
    serialNumber: '',
    notes: '',
  });

  // 计算状态
  const assetsWithStatus = useMemo(() => {
    return assets.map(a => ({ ...a, status: calcStatus(a.expiryDate, a.status) }));
  }, [assets]);

  const summary = useMemo(() => {
    const total = assetsWithStatus.length;
    const expiring = assetsWithStatus.filter(a => a.status === 'expiring').length;
    const expired = assetsWithStatus.filter(a => a.status === 'expired').length;
    const totalValue = assetsWithStatus.reduce((s, a) => s + a.cost, 0);
    return { total, expiring, expired, active: total - expiring - expired, totalValue };
  }, [assetsWithStatus]);

  const filteredAssets = useMemo(() => {
    return assetsWithStatus.filter(a => {
      if (filterType && a.type !== filterType) return false;
      if (filterStatus && a.status !== filterStatus) return false;
      return true;
    });
  }, [assetsWithStatus, filterType, filterStatus]);

  // 按类型分组
  const assetsByType = useMemo(() => {
    const groups: Record<AssetType, Asset[]> = { server: [], domain: [], ssl: [], device: [], license: [], 'software-copyright': [], patent: [] };
    assetsWithStatus.forEach(a => groups[a.type].push(a));
    return groups;
  }, [assetsWithStatus]);

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'server',
      vendor: '',
      cost: '',
      purchaseDate: '2026-07-02',
      expiryDate: '',
      assignee: '',
      department: '',
      serialNumber: '',
      notes: '',
    });
  };

  const handleAdd = () => {
    setEditingAsset(null);
    resetForm();
    setFormData(prev => ({ ...prev, type: 'server', purchaseDate: '2026-07-02' }));
    setModalVisible(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      name: asset.name,
      type: asset.type,
      vendor: asset.vendor,
      cost: String(asset.cost),
      purchaseDate: asset.purchaseDate,
      expiryDate: asset.expiryDate,
      assignee: asset.assignee || '',
      department: asset.department || '',
      serialNumber: asset.serialNumber || '',
      notes: asset.notes || '',
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除该资产?')) {
      setAssets(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.vendor || !formData.cost || !formData.purchaseDate || !formData.expiryDate) {
      return;
    }
    const values = {
      name: formData.name,
      type: formData.type,
      vendor: formData.vendor,
      cost: Number(formData.cost),
      purchaseDate: formData.purchaseDate,
      expiryDate: formData.expiryDate,
      assignee: formData.assignee || undefined,
      department: formData.department || undefined,
      serialNumber: formData.serialNumber || undefined,
      notes: formData.notes || undefined,
    };
    if (editingAsset) {
      setAssets(prev => prev.map(a => a.id === editingAsset.id ? { ...a, ...values } : a));
    } else {
      const newAsset: Asset = { id: `ast-${Date.now()}`, ...values, status: 'active' };
      setAssets(prev => [...prev, newAsset]);
    }
    setModalVisible(false);
  };

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const currentData = activeTab === 'all' ? filteredAssets : assetsByType[activeTab as AssetType] || [];
  const totalPages = Math.ceil(currentData.length / pageSize);
  const paginatedData = currentData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Grid3X3 className="size-4 text-primary" />
              资产总数
            </div>
            <div className="text-2xl font-bold mt-1">{summary.total} <span className="text-sm font-normal text-muted-foreground">件</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <CheckCircle2 className="size-4 text-green-600" />
              正常使用
            </div>
            <div className="text-2xl font-bold mt-1">{summary.active} <span className="text-sm font-normal text-muted-foreground">件</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-yellow-500" />
              即将到期
            </div>
            <div className="text-2xl font-bold mt-1 text-yellow-600">{summary.expiring} <span className="text-sm font-normal text-muted-foreground">件</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-destructive" />
              已到期
            </div>
            <div className="text-2xl font-bold mt-1 text-destructive">{summary.expired} <span className="text-sm font-normal text-muted-foreground">件</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm">资产总值</div>
            <div className="text-2xl font-bold mt-1">&yen;{summary.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-muted-foreground text-sm flex items-center gap-2">
              <Calendar className="size-4 text-blue-500" />
              盘点次数
            </div>
            <div className="text-2xl font-bold mt-1">{mockInventoryRecords.length} <span className="text-sm font-normal text-muted-foreground">次</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 到期预警 */}
      {(summary.expiring > 0 || summary.expired > 0) && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            有 <strong className="text-destructive">{summary.expired} 件</strong> 资产已到期，
            <strong className="text-yellow-600">{summary.expiring} 件</strong> 即将在 30 天内到期，请及时处理续费或回收。
          </AlertDescription>
        </Alert>
      )}

      {/* 主体 Tab */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all"><Grid3X3 className="size-4" /> 全部资产</TabsTrigger>
              {Object.entries(ASSET_TYPE_LABELS).map(([key, meta]) => (
                <TabsTrigger key={key} value={key}>{meta.icon} {meta.label} ({assetsByType[key as AssetType].length})</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="pt-4">
              {/* 筛选 + 操作 */}
              <div className="flex flex-wrap gap-3 mb-4 items-center">
                <Select value={filterType || '__all__'} onValueChange={(v) => setFilterType(v === '__all__' ? '' : v as AssetType)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="全部类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全部类型</SelectItem>
                    {Object.entries(ASSET_TYPE_LABELS).map(([k, m]) => (
                      <SelectItem key={k} value={k}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus || '__all__'} onValueChange={(v) => setFilterStatus(v === '__all__' ? '' : v as AssetStatus)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">全部状态</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([k, m]) => (
                      <SelectItem key={k} value={k}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="ml-auto">
                  <Button onClick={handleAdd}>
                    <Plus className="size-4" /> 新增资产
                  </Button>
                </div>
              </div>

              {/* 资产表格 */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">名称</TableHead>
                    <TableHead className="w-[90px]">类型</TableHead>
                    <TableHead className="w-[100px]">供应商</TableHead>
                    <TableHead className="w-[110px]">到期日</TableHead>
                    <TableHead className="w-[90px]">状态</TableHead>
                    <TableHead className="w-[80px]">使用人</TableHead>
                    <TableHead className="w-[80px]">部门</TableHead>
                    <TableHead className="w-[90px]">成本</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map(row => (
                    <TableRow key={row.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-base">{ASSET_TYPE_LABELS[row.type].icon}</span>
                          <span className="font-semibold">{row.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={ASSET_TYPE_LABELS[row.type].variant}>{ASSET_TYPE_LABELS[row.type].label}</Badge>
                      </TableCell>
                      <TableCell>{row.vendor}</TableCell>
                      <TableCell>
                        {(() => {
                          const days = getDaysUntil(row.expiryDate);
                          if (days < 0) return <span className="text-destructive">{row.expiryDate} (已到期)</span>;
                          if (days <= 30) return <span className="text-yellow-600">{row.expiryDate} ({days}天)</span>;
                          return row.expiryDate;
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_LABELS[row.status].variant}>{STATUS_LABELS[row.status].label}</Badge>
                      </TableCell>
                      <TableCell>{row.assignee || '—'}</TableCell>
                      <TableCell>{row.department || '—'}</TableCell>
                      <TableCell>&yen;{row.cost.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                            <Pencil className="size-3.5" /> 编辑
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(row.id)}>
                            <Trash2 className="size-3.5" /> 删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* 分页 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-muted-foreground">
                    共 {currentData.length} 条记录，第 {currentPage}/{totalPages} 页
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                    >
                      上一页
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 盘点记录 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" /> 盘点记录
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">盘点日期</TableHead>
                <TableHead className="w-[80px]">操作人</TableHead>
                <TableHead className="w-[90px]">资产总数</TableHead>
                <TableHead className="w-[90px]">已盘点</TableHead>
                <TableHead className="w-[120px]">完成率</TableHead>
                <TableHead className="w-[70px]">异常</TableHead>
                <TableHead>备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventoryRecords.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.operator}</TableCell>
                  <TableCell>{row.totalAssets}件</TableCell>
                  <TableCell>{row.checkedAssets}件</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={Math.round((row.checkedAssets / Math.max(row.totalAssets, 1)) * 100)} className="w-16" />
                      <span className="text-xs text-muted-foreground">{Math.round((row.checkedAssets / Math.max(row.totalAssets, 1)) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.anomalies > 0 ? <Badge variant="destructive">{row.anomalies}项</Badge> : <Badge variant="default">无</Badge>}
                  </TableCell>
                  <TableCell>{row.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 新增/编辑弹窗 */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingAsset ? '编辑资产' : '新增资产'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">资产名称 <span className="text-destructive">*</span></Label>
                  <Input id="name" placeholder="如：阿里云ECS服务器" value={formData.name} onChange={e => updateForm('name', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">资产类型 <span className="text-destructive">*</span></Label>
                  <Select value={formData.type} onValueChange={v => updateForm('type', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ASSET_TYPE_LABELS).map(([k, m]) => (
                        <SelectItem key={k} value={k}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vendor">供应商 <span className="text-destructive">*</span></Label>
                  <Input id="vendor" placeholder="如：阿里云" value={formData.vendor} onChange={e => updateForm('vendor', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cost">成本（元） <span className="text-destructive">*</span></Label>
                  <Input id="cost" type="number" placeholder="0" value={formData.cost} onChange={e => updateForm('cost', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="purchaseDate">购买日期 <span className="text-destructive">*</span></Label>
                  <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={e => updateForm('purchaseDate', e.target.value)} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">到期日期 <span className="text-destructive">*</span></Label>
                  <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={e => updateForm('expiryDate', e.target.value)} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignee">使用人</Label>
                  <Input id="assignee" placeholder="如：张三" value={formData.assignee} onChange={e => updateForm('assignee', e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">所属部门</Label>
                  <Input id="department" placeholder="如：技术部" value={formData.department} onChange={e => updateForm('department', e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="serialNumber">序列号</Label>
                <Input id="serialNumber" placeholder="设备序列号（可选）" value={formData.serialNumber} onChange={e => updateForm('serialNumber', e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea id="notes" placeholder="备注信息" rows={3} value={formData.notes} onChange={e => updateForm('notes', e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalVisible(false)}>取消</Button>
              <Button type="submit">确定</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
