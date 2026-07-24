import { useState, useMemo } from 'react';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Calendar,
  User,
  LayoutGrid,
  Star,
  Folder,
  Monitor,
} from 'lucide-react';

import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../components/ui/pagination';

// ---------- 类型 ----------

type DocCategory = 'tech' | 'sop' | 'template' | 'review' | 'other';
type Permission = 'public' | 'department' | 'project';

interface Document {
  id: string;
  title: string;
  category: DocCategory;
  tags: string[];
  author: string;
  department: string;
  permission: Permission;
  createdAt: string;
  updatedAt: string;
  views: number;
  content: string;
  projectId?: string;
}

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
  content: string;
}

// ---------- 工具 ----------

const CATEGORY_LABELS: Record<DocCategory, { label: string; icon: React.ReactNode; color: string }> = {
  tech:     { label: '技术方案', icon: <Monitor className="inline size-3.5" />,  color: 'text-blue-600' },
  sop:      { label: 'SOP 流程', icon: <FileText className="inline size-3.5" />, color: 'text-green-600' },
  template: { label: '模板',     icon: <FileText className="inline size-3.5" />, color: 'text-purple-600' },
  review:   { label: '项目复盘', icon: <Search className="inline size-3.5" />,   color: 'text-orange-500' },
  other:    { label: '其他',     icon: <Folder className="inline size-3.5" />,    color: 'text-muted-foreground' },
};

const PERMISSION_LABELS: Record<Permission, { label: string; color: string }> = {
  public:     { label: '公开', color: 'bg-green-100 text-green-700' },
  department: { label: '部门', color: 'bg-blue-100 text-blue-700' },
  project:    { label: '项目', color: 'bg-orange-100 text-orange-700' },
};

const CATEGORY_BADGE_VARIANTS: Record<DocCategory, string> = {
  tech:     'bg-blue-100 text-blue-700',
  sop:      'bg-green-100 text-green-700',
  template: 'bg-purple-100 text-purple-700',
  review:   'bg-orange-100 text-orange-700',
  other:    'bg-gray-100 text-gray-700',
};

// ---------- 模拟数据 ----------

const mockDocuments: Document[] = [
  { id: 'doc-1', title: 'React 性能优化最佳实践', category: 'tech', tags: ['React', '性能', 'Frontend'], author: '黄丽', department: '技术部', permission: 'public', createdAt: '2026-06-15', updatedAt: '2026-06-20', views: 45, content: '本文总结 React 应用性能优化的常见手段...' },
  { id: 'doc-2', title: '项目交付 SOP 流程 v2.0', category: 'sop', tags: ['SOP', '交付', '流程'], author: '徐强', department: '技术部', permission: 'department', createdAt: '2026-05-01', updatedAt: '2026-06-10', views: 128, content: '标准项目交付流程：需求确认 → 设计 → 开发 → 测试 → 验收...' },
  { id: 'doc-3', title: '企业管理系统项目复盘', category: 'review', tags: ['复盘', 'CRM', '项目管理'], author: '张三', department: '技术部', permission: 'project', projectId: '1', createdAt: '2026-04-20', updatedAt: '2026-04-25', views: 32, content: '项目概况：周期 3 个月，团队 8 人...' },
  { id: 'doc-4', title: '报价单模板', category: 'template', tags: ['报价', '模板', '商务'], author: '赵玲', department: '财务部', permission: 'public', createdAt: '2026-03-01', updatedAt: '2026-03-01', views: 89, content: '标准报价单格式，包含项目明细、税率、付款方式...' },
  { id: 'doc-5', title: '微服务架构设计指南', category: 'tech', tags: ['架构', '微服务', '后端'], author: '李四', department: '技术部', permission: 'public', createdAt: '2026-02-15', updatedAt: '2026-05-10', views: 67, content: '微服务拆分原则、服务通信、数据一致性...' },
  { id: 'doc-6', title: '客户工单处理规范', category: 'sop', tags: ['工单', '售后', 'SLA'], author: '徐强', department: '技术部', permission: 'department', createdAt: '2026-04-01', updatedAt: '2026-06-01', views: 54, content: '工单分级：紧急/高/中/低，SLA 响应时间...' },
  { id: 'doc-7', title: '电商平台小程序复盘', category: 'review', tags: ['复盘', '小程序', '电商'], author: '李四', department: '技术部', permission: 'project', projectId: '3', createdAt: '2026-05-20', updatedAt: '2026-05-22', views: 28, content: '项目周期 2 个月，主要挑战：支付对接...' },
  { id: 'doc-8', title: '技术方案模板', category: 'template', tags: ['技术方案', '模板'], author: '徐强', department: '技术部', permission: 'public', createdAt: '2026-01-10', updatedAt: '2026-01-10', views: 156, content: '标准技术方案结构：背景、目标、方案设计、风险评估...' },
];

const mockTemplates: Template[] = [
  { id: 'tpl-1', name: '技术方案模板', category: '技术', description: '标准技术方案文档结构，适用于各类项目开发', usageCount: 23, content: '# 技术方案\n\n## 1. 背景\n\n## 2. 目标\n\n## 3. 方案设计\n\n## 4. 技术选型\n\n## 5. 风险评估\n\n## 6. 实施计划' },
  { id: 'tpl-2', name: '项目报价模板', category: '商务', description: '标准报价单格式，包含项目明细、税率、付款方式', usageCount: 45, content: '# 项目报价单\n\n## 项目信息\n- 客户：\n- 项目：\n- 周期：\n\n## 报价明细\n| 项目 | 数量 | 单价 | 合计 |\n|------|------|------|------|\n\n## 付款方式' },
  { id: 'tpl-3', name: '项目复盘模板', category: '管理', description: '项目结束后复盘文档结构', usageCount: 12, content: '# 项目复盘\n\n## 项目概况\n\n## 目标达成情况\n\n## 做得好的地方\n\n## 需要改进的地方\n\n## 经验教训\n\n## 后续行动计划' },
  { id: 'tpl-4', name: 'SOP 标准模板', category: '流程', description: '标准 SOP 流程文档格式', usageCount: 34, content: '# SOP：{流程名称}\n\n## 1. 目的\n\n## 2. 适用范围\n\n## 3. 职责分工\n\n## 4. 操作流程\n\n## 5. 注意事项\n\n## 6. 相关文档' },
];

// ---------- 主组件 ----------

export function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('all');
  const [documents, setDocuments] = useState(mockDocuments);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [detailDoc, setDetailDoc] = useState<Document | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 表单状态
  const [formData, setFormData] = useState<{
    title: string;
    category: DocCategory;
    permission: Permission;
    tags: string;
    content: string;
  }>({
    title: '',
    category: 'tech',
    permission: 'public',
    tags: '',
    content: '',
  });

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(d => d.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      if (searchKeyword && !d.title.includes(searchKeyword) && !d.content.includes(searchKeyword)) return false;
      if (filterCategory && filterCategory !== 'all' && d.category !== filterCategory) return false;
      if (filterTag && filterTag !== 'all' && !d.tags.includes(filterTag)) return false;
      return true;
    });
  }, [documents, searchKeyword, filterCategory, filterTag]);

  const summary = useMemo(() => ({
    total: documents.length,
    tech: documents.filter(d => d.category === 'tech').length,
    sop: documents.filter(d => d.category === 'sop').length,
    templates: mockTemplates.length,
    reviews: documents.filter(d => d.category === 'review').length,
    totalViews: documents.reduce((s, d) => s + d.views, 0),
  }), [documents]);

  const handleAdd = () => {
    setEditingDoc(null);
    setFormData({ title: '', category: 'tech', permission: 'public', tags: '', content: '' });
    setModalVisible(true);
  };

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      category: doc.category,
      permission: doc.permission,
      tags: doc.tags.join(', '),
      content: doc.content,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定删除?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      alert('请输入标题');
      return;
    }
    const tagsArr = formData.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    if (editingDoc) {
      setDocuments(prev => prev.map(d => d.id === editingDoc.id ? { ...d, title: formData.title, category: formData.category, permission: formData.permission, tags: tagsArr, content: formData.content, updatedAt: '2026-07-02' } : d));
    } else {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        permission: formData.permission,
        tags: tagsArr,
        content: formData.content,
        author: '当前用户',
        department: '技术部',
        createdAt: '2026-07-02',
        updatedAt: '2026-07-02',
        views: 0,
      };
      setDocuments(prev => [newDoc, ...prev]);
    }
    setModalVisible(false);
  };

  // 统计卡片数据
  const statCards = [
    { label: '文档总数', value: summary.total, suffix: '篇', icon: <FileText className="text-blue-600" /> },
    { label: '技术方案', value: summary.tech, suffix: '篇', icon: <LayoutGrid className="text-blue-600" /> },
    { label: 'SOP 流程', value: summary.sop, suffix: '篇', icon: <Star className="text-green-600" /> },
    { label: '模板', value: summary.templates, suffix: '个', icon: <Folder className="text-purple-600" /> },
    { label: '项目复盘', value: summary.reviews, suffix: '篇', icon: <Eye className="text-orange-500" /> },
    { label: '总阅读量', value: summary.totalViews, suffix: '次', icon: <Eye className="text-sky-500" /> },
  ];

  // 当前 tab 对应的文档
  const tabDocs = activeTab === 'all'
    ? filteredDocs
    : filteredDocs.filter(d => d.category === activeTab);

  const totalPages = Math.ceil(tabDocs.length / pageSize);
  const pagedDocs = tabDocs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 摘要栏 */}
      <div className="grid grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-semibold">
                    {stat.value}
                    <span className="text-sm font-normal text-muted-foreground ml-1">{stat.suffix}</span>
                  </p>
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 主体 Tab */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setCurrentPage(1); }}>
            <div className="border-b px-4 pt-2">
              <TabsList>
                <TabsTrigger value="all"><FileText className="size-4 mr-1" /> 全部文档</TabsTrigger>
                <TabsTrigger value="tech"><Monitor className="size-4 mr-1" /> 技术方案</TabsTrigger>
                <TabsTrigger value="sop"><FileText className="size-4 mr-1" /> SOP 流程</TabsTrigger>
                <TabsTrigger value="template"><FileText className="size-4 mr-1" /> 模板库</TabsTrigger>
                <TabsTrigger value="review"><Search className="size-4 mr-1" /> 项目复盘</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              {/* 全部文档 / 技术方案 / SOP / 复盘 Tab */}
              {(activeTab === 'all' || activeTab === 'tech' || activeTab === 'sop' || activeTab === 'review') && (
                <div>
                  {/* 筛选 */}
                  <div className="flex flex-wrap gap-3 mb-4 items-center">
                    <div className="relative w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        className="pl-9"
                        placeholder="搜索文档标题或内容"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </div>
                    {activeTab === 'all' && (
                      <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue placeholder="全部分类" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部分类</SelectItem>
                          {Object.entries(CATEGORY_LABELS).map(([k, m]) => (
                            <SelectItem key={k} value={k}>{m.icon} {m.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Select value={filterTag} onValueChange={setFilterTag}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="全部标签" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部标签</SelectItem>
                        {allTags.map(t => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="ml-auto">
                      <Button onClick={handleAdd}>
                        <Plus className="size-4 mr-1" /> 新建文档
                      </Button>
                    </div>
                  </div>

                  {/* 文档表格 */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">标题</TableHead>
                          <TableHead className="w-[90px]">分类</TableHead>
                          <TableHead className="w-[200px]">标签</TableHead>
                          <TableHead className="w-[70px]">作者</TableHead>
                          <TableHead className="w-[70px]">部门</TableHead>
                          <TableHead className="w-[70px]">权限</TableHead>
                          <TableHead className="w-[60px]">阅读</TableHead>
                          <TableHead className="w-[100px]">更新时间</TableHead>
                          <TableHead className="w-[100px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pagedDocs.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                              暂无文档
                            </TableCell>
                          </TableRow>
                        ) : (
                          pagedDocs.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>
                                <button
                                  className="font-semibold text-left hover:underline cursor-pointer bg-transparent border-none p-0"
                                  onClick={() => setDetailDoc(row)}
                                >
                                  {row.title}
                                </button>
                              </TableCell>
                              <TableCell>
                                <Badge className={CATEGORY_BADGE_VARIANTS[row.category]}>
                                  {CATEGORY_LABELS[row.category].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {row.tags.map(t => (
                                    <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{row.author}</TableCell>
                              <TableCell>{row.department}</TableCell>
                              <TableCell>
                                <Badge className={PERMISSION_LABELS[row.permission].color}>
                                  {PERMISSION_LABELS[row.permission].label}
                                </Badge>
                              </TableCell>
                              <TableCell>{row.views}次</TableCell>
                              <TableCell>{row.updatedAt}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                                    <Edit className="size-4 mr-1" /> 编辑
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(row.id)}>
                                    <Trash2 className="size-4 mr-1" /> 删除
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 分页 */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-muted-foreground">
                        共 {tabDocs.length} 篇文档
                      </span>
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                isActive={page === currentPage}
                                onClick={() => setCurrentPage(page)}
                                className="cursor-pointer"
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </div>
              )}

              {/* 模板库 Tab */}
              {activeTab === 'template' && (
                <div className="grid grid-cols-4 gap-4">
                  {mockTemplates.map(tpl => (
                    <Card key={tpl.id} className="rounded-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-semibold flex items-center gap-1">
                            <FileText className="size-4" /> {tpl.name}
                          </CardTitle>
                          <Badge className="bg-purple-100 text-purple-700">模板</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground mb-2">{tpl.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="text-xs">{tpl.category}</Badge>
                          <span className="text-xs text-muted-foreground">使用 {tpl.usageCount} 次</span>
                        </div>
                        <Button className="w-full mt-3" size="sm">使用模板</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* 新建/编辑弹窗 */}
      <Dialog open={modalVisible} onOpenChange={setModalVisible}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{editingDoc ? '编辑文档' : '新建文档'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>标题</Label>
              <Input
                placeholder="文档标题"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>分类</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, category: v as DocCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CATEGORY_LABELS).map(([k, m]) => (
                      <SelectItem key={k} value={k}>{m.icon} {m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>可见性</Label>
                <Select
                  value={formData.permission}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, permission: v as Permission }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择可见性" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PERMISSION_LABELS).map(([k, m]) => (
                      <SelectItem key={k} value={k}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>标签</Label>
              <Input
                placeholder="输入标签，用逗号分隔"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>内容</Label>
              <Textarea
                placeholder="文档内容（支持 Markdown）"
                className="min-h-[100px] max-h-[250px]"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalVisible(false)}>取消</Button>
            <Button onClick={handleSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 文档详情弹窗 */}
      <Dialog open={!!detailDoc} onOpenChange={(open) => { if (!open) setDetailDoc(null); }}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>{detailDoc?.title || ''}</DialogTitle>
          </DialogHeader>
          {detailDoc && (
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={CATEGORY_BADGE_VARIANTS[detailDoc.category]}>
                  {CATEGORY_LABELS[detailDoc.category].label}
                </Badge>
                <Badge className={PERMISSION_LABELS[detailDoc.permission].color}>
                  {PERMISSION_LABELS[detailDoc.permission].label}
                </Badge>
                {detailDoc.tags.map(t => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                <div>
                  <span className="text-muted-foreground">作者：</span>
                  {detailDoc.author}
                </div>
                <div>
                  <span className="text-muted-foreground">部门：</span>
                  {detailDoc.department}
                </div>
                <div>
                  <span className="text-muted-foreground">创建时间：</span>
                  {detailDoc.createdAt}
                </div>
                <div>
                  <span className="text-muted-foreground">更新时间：</span>
                  {detailDoc.updatedAt}
                </div>
                <div>
                  <span className="text-muted-foreground">阅读量：</span>
                  {detailDoc.views} 次
                </div>
              </div>
              <Separator className="my-3" />
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{detailDoc.content}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
