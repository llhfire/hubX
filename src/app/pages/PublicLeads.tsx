import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import {
  Search,
  Plus,
  Eye,
  UserPlus,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Textarea } from '../components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CompanyEntityInfoModal } from './company-entity/CompanyEntityInfoModal';
import {
  companyEntityPermissions,
  findCompanyEntityByName,
  type CompanyEntityRecord,
} from './company-entity/companyEntityData';

// Custom wrapper for ReactQuill
function RichTextEditor({ value = '', onChange, ...props }: any) {
  const quillRef = useRef<ReactQuill>(null);

  return (
    <div style={{ marginBottom: 42 }}>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}

function StatusTag({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    '未联系': 'gray',
    '未接通': 'orangered',
    '初步沟通': 'blue',
    '需求调研': 'cyan',
    '方案报价': 'purple',
    '合同洽谈': 'orange',
    '已签单': 'green',
    '已终止': 'red',
  };
  const color = colorMap[status] || 'default';

  if (color === 'gray') {
    return <Badge variant="secondary">{status}</Badge>;
  }
  if (color === 'red') {
    return <Badge variant="destructive">{status}</Badge>;
  }

  const classNameMap: Record<string, string> = {
    orangered: 'bg-orange-500 hover:bg-orange-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    cyan: 'bg-cyan-500 hover:bg-cyan-600',
    purple: 'bg-purple-500 hover:bg-purple-600',
    orange: 'bg-orange-500 hover:bg-orange-600',
    green: 'bg-green-500 hover:bg-green-600',
  };

  return <Badge className={classNameMap[color] || ''}>{status}</Badge>;
}

export function PublicLeads() {
  const navigate = useNavigate();

  // Dialog visibility
  const [visible, setVisible] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [customTagVisible, setCustomTagVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompanyEntity, setSelectedCompanyEntity] = useState<CompanyEntityRecord | null>(null);

  // Tags
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState(['APP', '小程序', '管理系统', '官网', '电商系统', 'CMS', 'OA系统']);

  // Form data
  const [createData, setCreateData] = useState({
    name: '',
    contact: '',
    phone: '',
    wechat: '',
    source: '',
    keyword: '',
    customerId: '',
    level: '',
    entity: '',
    status: '',
    requirement: '',
  });
  const [trashData, setTrashData] = useState({ reason: '' });
  const [customTagData, setCustomTagData] = useState({ tagName: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const totalRecords = 50;
  const pageSize = 10;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const customerList = [
    { id: '1', name: '北京科技有限公司', contact: '张经理', phone: '13800138000' },
    { id: '2', name: '上海商贸公司', contact: '李总', phone: '13900139000' },
    { id: '3', name: '深圳电商公司', contact: '王总', phone: '13600136000' },
    { id: '4', name: '广州金融公司', contact: '赵经理', phone: '13700137000' },
  ];

  const publicLeads = [
    {
      key: '1',
      id: 'LS001',
      name: '某餐饮连锁小程序开发',
      source: '百度推广',
      keyword: '小程序开发',
      contact: '陈经理',
      phone: '138****8888',
      level: '高',
      tags: ['小程序', '餐饮'],
      entity: '中科软艺',
      status: '需求调研',
      createTime: '2026-04-08 10:30',
    },
    {
      key: '2',
      id: 'LS002',
      name: '物流管理系统定制',
      source: '抖音',
      keyword: '物流系统',
      contact: '刘总',
      phone: '139****9999',
      level: '中',
      tags: ['管理系统', '物流'],
      entity: '软艺信息',
      status: '初步沟通',
      createTime: '2026-04-08 14:20',
    },
    {
      key: '3',
      id: 'LS003',
      name: '教育APP开发需求',
      source: '小红书',
      keyword: '教育APP',
      contact: '王老师',
      phone: '136****6666',
      level: '高',
      tags: ['APP', '教育'],
      entity: '中科集团',
      status: '方案报价',
      createTime: '2026-04-07 16:45',
    },
    {
      key: '4',
      id: 'LS004',
      name: '企业官网建设',
      source: '微信推广',
      keyword: '官网建设',
      contact: '李主管',
      phone: '137****7777',
      level: '低',
      tags: ['官网', '企业'],
      entity: '中科软艺',
      status: '未联系',
      createTime: '2026-04-07 09:15',
    },
    {
      key: '5',
      id: 'LS005',
      name: '电商平台开发',
      source: '百度推广',
      keyword: '电商系统',
      contact: '张总',
      phone: '135****5555',
      level: '高',
      tags: ['电商', '平台'],
      entity: '软艺信息',
      status: '合同洽谈',
      createTime: '2026-04-06 11:30',
    },
  ];

  const handleOpenCompanyEntity = (entityName: string) => {
    if (!companyEntityPermissions.view) {
      toast.warning('暂无权限查看公司主体详情');
      return;
    }

    const companyEntity = findCompanyEntityByName(entityName);
    if (!companyEntity) {
      toast.warning('未找到公司主体信息');
      return;
    }

    setSelectedCompanyEntity(companyEntity);
    setCompanyModalVisible(true);
  };

  const handleCreateLead = () => {
    const newErrors: Record<string, string> = {};
    if (!createData.name) newErrors.name = '请输入线索名称';
    if (!createData.contact) newErrors.contact = '请输入联系人';
    if (!createData.phone) newErrors.phone = '请输入联系电话';
    if (!createData.source) newErrors.source = '请选择线索来源';
    if (!createData.level) newErrors.level = '请选择意向等级';
    if (!createData.entity) newErrors.entity = '请选择对接主体';
    if (!createData.status) newErrors.status = '请选择客户状态';

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    console.log({ ...createData, tags: selectedTags });
    toast.success('线索创建成功');
    setVisible(false);
    setCreateData({
      name: '',
      contact: '',
      phone: '',
      wechat: '',
      source: '',
      keyword: '',
      customerId: '',
      level: '',
      entity: '',
      status: '',
      requirement: '',
    });
    setSelectedTags([]);
    setFormErrors({});
  };

  const handleTrashLead = () => {
    const newErrors: Record<string, string> = {};
    if (!trashData.reason) newErrors.reason = '请填写丢弃原因';

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    console.log(trashData);
    toast.success('垃圾线索已丢弃');
    setTrashVisible(false);
    setTrashData({ reason: '' });
    setFormErrors({});
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    const newErrors: Record<string, string> = {};
    if (!customTagData.tagName.trim()) newErrors.tagName = '请输入标签名称';

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const newTag = customTagData.tagName.trim();
    if (!availableTags.includes(newTag)) {
      setAvailableTags([...availableTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
      toast.success('标签添加成功');
    } else {
      toast.warning('标签已存在');
    }
    setCustomTagVisible(false);
    setCustomTagData({ tagName: '' });
    setFormErrors({});
  };

  const updateCreateData = (field: string, value: string) => {
    setCreateData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <TooltipProvider>
      <div>
        {/* Page label */}
        <div className="flex items-center justify-between mb-5">
          <div
            className="text-xs font-medium tracking-widest uppercase"
            style={{ color: 'hsl(220 8% 55%)' }}
          >
            公海线索池
          </div>
          <Button onClick={() => setVisible(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新建线索
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Search & Filter Bar */}
            <div className="flex gap-3 mb-4">
              <div className="relative w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="搜索线索名称、联系人" />
              </div>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="线索来源" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baidu">百度推广</SelectItem>
                  <SelectItem value="douyin">抖音</SelectItem>
                  <SelectItem value="xiaohongshu">小红书</SelectItem>
                  <SelectItem value="wechat">微信推广</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="意向等级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
              <Button>搜索</Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table style={{ minWidth: 1400 }}>
                <TableHeader>
                  <TableRow>
                    <TableHead style={{ width: 100 }}>线索ID</TableHead>
                    <TableHead style={{ width: 120 }}>对接主体</TableHead>
                    <TableHead style={{ width: 200 }}>线索名称</TableHead>
                    <TableHead style={{ width: 120 }}>来源</TableHead>
                    <TableHead style={{ width: 120 }}>推广关键词</TableHead>
                    <TableHead style={{ width: 100 }}>联系人</TableHead>
                    <TableHead style={{ width: 120 }}>手机号</TableHead>
                    <TableHead style={{ width: 100 }}>意向等级</TableHead>
                    <TableHead style={{ width: 150 }}>意向标签</TableHead>
                    <TableHead style={{ width: 120 }}>客户状态</TableHead>
                    <TableHead style={{ width: 160 }}>创建时间</TableHead>
                    <TableHead style={{ width: 180 }} className="sticky right-0 bg-background">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publicLeads.map((record) => (
                    <TableRow key={record.key}>
                      <TableCell>
                        <span
                          className="text-xs font-mono"
                          style={{ color: 'hsl(220 8% 55%)' }}
                        >
                          {record.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleOpenCompanyEntity(record.entity)}
                        >
                          {record.entity}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium" style={{ color: 'hsl(220 20% 10%)' }}>
                          {record.name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-gray-400" />
                          <span>{record.source}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: 'hsl(220 10% 45%)' }}>{record.keyword}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: 'hsl(220 10% 35%)' }}>{record.contact}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-[13px]" style={{ color: 'hsl(220 8% 55%)' }}>
                          {record.phone}
                        </span>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const levelStatusMap: Record<string, string> = {
                            '高': 'error',
                            '中': 'warning',
                            '低': 'default',
                          };
                          return (
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  levelStatusMap[record.level] === 'error'
                                    ? 'bg-red-500'
                                    : levelStatusMap[record.level] === 'warning'
                                    ? 'bg-orange-500'
                                    : 'bg-gray-400'
                                }`}
                              />
                              <span>{record.level}</span>
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {record.tags.map((tag, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusTag status={record.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-[13px]" style={{ color: 'hsl(220 8% 55%)' }}>
                          {record.createTime}
                        </span>
                      </TableCell>
                      <TableCell className="sticky right-0 bg-background">
                        <div className="flex items-center gap-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigate(`/leads/${record.key}`, {
                                    state: { from: 'public' },
                                  })
                                }
                              >
                                <Eye className="mr-1 h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>查看详情</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  toast.success('线索认领成功');
                                }}
                              >
                                <UserPlus className="mr-1 h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>认领线索</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setTrashVisible(true)}
                              >
                                <Trash2 className="mr-1 h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>丢弃垃圾线索</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-muted-foreground">
                共 {totalRecords} 条记录，第 {currentPage}/{totalPages} 页
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Lead Dialog */}
        <Dialog
          open={visible}
          onOpenChange={(open) => {
            if (!open) {
              setVisible(false);
              setCreateData({
                name: '',
                contact: '',
                phone: '',
                wechat: '',
                source: '',
                keyword: '',
                customerId: '',
                level: '',
                entity: '',
                status: '',
                requirement: '',
              });
              setSelectedTags([]);
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>新建线索</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* Row 1: Name (full width) */}
              <div className="space-y-2">
                <Label>
                  线索名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="请输入线索名称"
                  value={createData.name}
                  onChange={(e) => updateCreateData('name', e.target.value)}
                />
                {formErrors.name && (
                  <p className="text-sm text-destructive">{formErrors.name}</p>
                )}
              </div>

              {/* Row 2: Contact, Phone, WeChat */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    联系人 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="请输入联系人姓名"
                    value={createData.contact}
                    onChange={(e) => updateCreateData('contact', e.target.value)}
                  />
                  {formErrors.contact && (
                    <p className="text-sm text-destructive">{formErrors.contact}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    联系电话 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    placeholder="请输入手机号"
                    value={createData.phone}
                    onChange={(e) => updateCreateData('phone', e.target.value)}
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-destructive">{formErrors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>联系人微信</Label>
                  <Input
                    placeholder="请输入微信号"
                    value={createData.wechat}
                    onChange={(e) => updateCreateData('wechat', e.target.value)}
                  />
                </div>
              </div>

              {/* Row 3: Source, Keyword, Customer */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    线索来源 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createData.source}
                    onValueChange={(value) => updateCreateData('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baidu">百度推广</SelectItem>
                      <SelectItem value="douyin">抖音</SelectItem>
                      <SelectItem value="xiaohongshu">小红书</SelectItem>
                      <SelectItem value="wechat">微信推广</SelectItem>
                      <SelectItem value="other">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.source && (
                    <p className="text-sm text-destructive">{formErrors.source}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>推广关键词</Label>
                  <Input
                    placeholder="请输入推广关键词"
                    value={createData.keyword}
                    onChange={(e) => updateCreateData('keyword', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>客户主体</Label>
                  <Select
                    value={createData.customerId}
                    onValueChange={(value) => updateCreateData('customerId', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请输入客户名称搜索" />
                    </SelectTrigger>
                    <SelectContent>
                      {customerList.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} - {customer.contact} - {customer.phone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4: Level, Entity, Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>
                    意向等级 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createData.level}
                    onValueChange={(value) => updateCreateData('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">高</SelectItem>
                      <SelectItem value="medium">中</SelectItem>
                      <SelectItem value="low">低</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.level && (
                    <p className="text-sm text-destructive">{formErrors.level}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    对接主体 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createData.entity}
                    onValueChange={(value) => updateCreateData('entity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="中科软艺">中科软艺</SelectItem>
                      <SelectItem value="软艺信息">软艺信息</SelectItem>
                      <SelectItem value="中科集团">中科集团</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.entity && (
                    <p className="text-sm text-destructive">{formErrors.entity}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>
                    客户状态 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={createData.status}
                    onValueChange={(value) => updateCreateData('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="请选择" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="未联系">未联系</SelectItem>
                      <SelectItem value="未接通">未接通</SelectItem>
                      <SelectItem value="初步沟通">初步沟通</SelectItem>
                      <SelectItem value="需求调研">需求调研</SelectItem>
                      <SelectItem value="方案报价">方案报价</SelectItem>
                      <SelectItem value="合同洽谈">合同洽谈</SelectItem>
                      <SelectItem value="已签单">已签单</SelectItem>
                      <SelectItem value="已终止">已终止</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.status && (
                    <p className="text-sm text-destructive">{formErrors.status}</p>
                  )}
                </div>
              </div>

              {/* Row 5: Tags */}
              <div className="space-y-2">
                <Label>意向标签</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <span
                      key={tag}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium cursor-pointer transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-dashed h-7"
                    onClick={() => setCustomTagVisible(true)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    新增标签
                  </Button>
                </div>
              </div>

              {/* Row 6: Requirement & Attachments */}
              <div className="space-y-2">
                <Label>客户需求梗概</Label>
                <Textarea
                  placeholder="请输入客户需求描述"
                  rows={6}
                  maxLength={1000}
                  value={createData.requirement}
                  onChange={(e) => updateCreateData('requirement', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>附件上传</Label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    点击或拖拽文件到此处上传
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    multiple
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  支持上传图片、PDF、Word、Excel等文件
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setVisible(false);
                  setCreateData({
                    name: '',
                    contact: '',
                    phone: '',
                    wechat: '',
                    source: '',
                    keyword: '',
                    customerId: '',
                    level: '',
                    entity: '',
                    status: '',
                    requirement: '',
                  });
                  setSelectedTags([]);
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleCreateLead}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Trash Lead Dialog */}
        <Dialog
          open={trashVisible}
          onOpenChange={(open) => {
            if (!open) {
              setTrashVisible(false);
              setTrashData({ reason: '' });
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>丢弃垃圾线索</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  丢弃原因 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="请详细说明该线索为垃圾线索的原因，如：重复线索、虚假信息、无效联系方式等"
                  rows={4}
                  value={trashData.reason}
                  onChange={(e) =>
                    setTrashData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
                {formErrors.reason && (
                  <p className="text-sm text-destructive">{formErrors.reason}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setTrashVisible(false);
                  setTrashData({ reason: '' });
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleTrashLead}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Custom Tag Dialog */}
        <Dialog
          open={customTagVisible}
          onOpenChange={(open) => {
            if (!open) {
              setCustomTagVisible(false);
              setCustomTagData({ tagName: '' });
              setFormErrors({});
            }
          }}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>新增标签</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>
                  标签名称 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="请输入标签名称，如：物联网、区块链等"
                  maxLength={10}
                  value={customTagData.tagName}
                  onChange={(e) =>
                    setCustomTagData((prev) => ({ ...prev, tagName: e.target.value }))
                  }
                />
                {formErrors.tagName && (
                  <p className="text-sm text-destructive">{formErrors.tagName}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setCustomTagVisible(false);
                  setCustomTagData({ tagName: '' });
                  setFormErrors({});
                }}
              >
                取消
              </Button>
              <Button onClick={handleAddCustomTag}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CompanyEntityInfoModal
          visible={companyModalVisible}
          mode="view"
          defaultTab="files"
          record={selectedCompanyEntity}
          permissions={companyEntityPermissions}
          onCancel={() => setCompanyModalVisible(false)}
          onGoManage={() => navigate('/system/company')}
        />
      </div>
    </TooltipProvider>
  );
}
