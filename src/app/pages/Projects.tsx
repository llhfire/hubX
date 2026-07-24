import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  FileText,
  Send,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { Progress } from '../components/ui/progress';
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
  BusinessLine,
  Project,
  ProjectPriority,
  ProjectStatus,
  businessLines,
  companyEntities,
  createProjectNo,
  employees,
  initialDailyReports,
  initialProjects,
  projectPriorities,
  projectStatuses,
  roleEmployees,
  summarizeProgress,
} from './project-management/mockData';

type ProjectFormValues = {
  name: string;
  latestProgress?: string;
  priority: ProjectPriority;
  entity?: string;
  status: ProjectStatus;
  businessLine?: BusinessLine;
  salesUsers?: string[];
  owner: string;
  assistants?: string[];
  productUsers?: string[];
  uiUsers?: string[];
  frontendUsers?: string[];
  backendUsers?: string[];
  opsUsers?: string[];
  testUsers?: string[];
  legalUsers?: string[];
  progress?: number;
  startDate?: string;
  expectedEndDate?: string;
  remark?: string;
};

const defaultFormValues: ProjectFormValues = {
  name: '',
  priority: '中',
  status: '未开始',
  businessLine: '外包',
  owner: '',
  progress: 0,
};

function statusBadge(status: ProjectStatus) {
  const variantMap: Record<ProjectStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    未开始: 'outline',
    进行中: 'default',
    已完成: 'secondary',
    验收中: 'default',
    搁置: 'secondary',
    延迟: 'destructive',
    催款中: 'secondary',
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

function priorityTag(priority: ProjectPriority) {
  const variantMap: Record<ProjectPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    高: 'destructive',
    中: 'default',
    低: 'secondary',
  };
  return <Badge variant={variantMap[priority]}>{priority}</Badge>;
}

function toDateString(value: any) {
  if (!value) return '';
  return value?.format?.('YYYY-MM-DD') ?? value;
}

function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [keyword, setKeyword] = useState('');
  const [ownerFilter, setOwnerFilter] = useState<string>();
  const [priorityFilter, setPriorityFilter] = useState<ProjectPriority>();
  const [statusFilter, setStatusFilter] = useState<ProjectStatus>();
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [followingProject, setFollowingProject] = useState<Project | null>(null);

  // Project form state
  const [projectForm, setProjectForm] = useState<ProjectFormValues>(defaultFormValues);

  // Follow form state
  const [followForm, setFollowForm] = useState({
    status: '' as ProjectStatus | '',
    progress: 0,
    content: '',
    attachmentName: '',
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const keywordMatched = !keyword || project.name.includes(keyword);
      const ownerMatched = !ownerFilter || project.owner === ownerFilter;
      const priorityMatched = !priorityFilter || project.priority === priorityFilter;
      const statusMatched = !statusFilter || project.status === statusFilter;
      return keywordMatched && ownerMatched && priorityMatched && statusMatched;
    });
  }, [keyword, ownerFilter, priorityFilter, projects, statusFilter]);

  const openCreateModal = () => {
    setEditingProject(null);
    setProjectForm(defaultFormValues);
    setProjectModalVisible(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      latestProgress: project.latestProgress,
      priority: project.priority,
      entity: project.entity,
      status: project.status,
      businessLine: project.businessLine,
      salesUsers: project.salesUsers,
      owner: project.owner,
      assistants: project.assistants,
      productUsers: project.productUsers,
      uiUsers: project.uiUsers,
      frontendUsers: project.frontendUsers,
      backendUsers: project.backendUsers,
      opsUsers: project.opsUsers,
      testUsers: project.testUsers,
      legalUsers: project.legalUsers,
      progress: project.progress,
      startDate: project.startDate,
      expectedEndDate: project.expectedEndDate,
      remark: project.remark,
    });
    setProjectModalVisible(true);
  };

  const saveProject = () => {
    if (!projectForm.name) {
      toast.error('请输入项目名称');
      return;
    }
    if (!projectForm.owner) {
      toast.error('请选择负责人');
      return;
    }

    const nextProject: Project = {
      id: editingProject?.id ?? String(Date.now()),
      projectNo: editingProject?.projectNo ?? createProjectNo(projects.length),
      name: projectForm.name,
      latestProgress: projectForm.latestProgress || '暂无进展',
      priority: projectForm.priority,
      entity: projectForm.entity || '',
      status: projectForm.status,
      businessLine: projectForm.businessLine || '外包',
      salesUsers: projectForm.salesUsers || [],
      owner: projectForm.owner,
      assistants: projectForm.assistants || [],
      productUsers: projectForm.productUsers || [],
      uiUsers: projectForm.uiUsers || [],
      frontendUsers: projectForm.frontendUsers || [],
      backendUsers: projectForm.backendUsers || [],
      opsUsers: projectForm.opsUsers || [],
      testUsers: projectForm.testUsers || [],
      legalUsers: projectForm.legalUsers || [],
      progress: projectForm.progress ?? 0,
      startDate: toDateString(projectForm.startDate),
      expectedEndDate: toDateString(projectForm.expectedEndDate),
      remark: projectForm.remark || '',
      attachments: editingProject?.attachments ?? [],
      createdAt: editingProject?.createdAt ?? '2026-05-09 10:00',
    };

    setProjects((current) => {
      if (editingProject) {
        return current.map((item) => (item.id === editingProject.id ? nextProject : item));
      }
      return [nextProject, ...current];
    });
    setProjectModalVisible(false);
    setProjectForm(defaultFormValues);
    toast.success(editingProject ? '项目已更新' : '项目已新建');
  };

  const openFollowModal = (project: Project) => {
    setFollowingProject(project);
    setFollowForm({
      status: project.status,
      progress: project.progress,
      content: '',
      attachmentName: '',
    });
    setFollowModalVisible(true);
  };

  const saveFollow = () => {
    if (!followForm.status) {
      toast.error('请选择状态');
      return;
    }
    if (followForm.progress === undefined || followForm.progress === null) {
      toast.error('请输入总进度');
      return;
    }
    if (!followForm.content) {
      toast.error('请输入跟进详情');
      return;
    }
    if (!followingProject) return;

    setProjects((current) =>
      current.map((project) =>
        project.id === followingProject.id
          ? {
              ...project,
              status: followForm.status as ProjectStatus,
              progress: followForm.progress,
              latestProgress: summarizeProgress(followForm.content),
            }
          : project
      )
    );
    setFollowModalVisible(false);
    setFollowForm({ status: '', progress: 0, content: '', attachmentName: '' });
    toast.success('跟进记录已保存，项目状态已同步');
  };

  const removeProject = (project: Project) => {
    const hasDailyReports = initialDailyReports.some((report) => report.projectId === project.id);
    setProjects((current) => current.filter((item) => item.id !== project.id));
    toast.success(hasDailyReports ? '项目已删除，关联日报仅在原始日报模块保留' : '项目已删除');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-2xl font-semibold">项目管理</h4>
        <Button onClick={openCreateModal}>
          <Plus className="size-4" />
          新建项目
        </Button>
      </div>

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">全部项目</p>
                <div className="text-3xl font-semibold mt-1">{projects.length}</div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                <FileText className="size-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <div className="text-3xl font-semibold mt-1">
                  {projects.filter((p) => p.status === '进行中').length}
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Send className="size-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已完成</p>
                <div className="text-3xl font-semibold mt-1">
                  {projects.filter((p) => p.status === '已完成' || p.status === '验收中').length}
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-green-500/10">
                <Eye className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">延期/搁置</p>
                <div className="text-3xl font-semibold mt-1">
                  {projects.filter((p) => p.status === '延迟' || p.status === '搁置').length}
                </div>
              </div>
              <div className="flex size-10 items-center justify-center rounded-lg bg-red-500/10">
                <Trash2 className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative w-60">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="搜索项目名称"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="负责人" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee} value={employee}>
                    {employee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="优先级" />
              </SelectTrigger>
              <SelectContent>
                {projectPriorities.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                {projectStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setKeyword('');
                setOwnerFilter(undefined);
                setPriorityFilter(undefined);
                setStatusFilter(undefined);
              }}
            >
              重置
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">编号</TableHead>
                  <TableHead className="w-[220px]">项目名称</TableHead>
                  <TableHead className="w-[100px]">负责人</TableHead>
                  <TableHead className="w-[140px]">销售</TableHead>
                  <TableHead className="w-[120px]">对接主体</TableHead>
                  <TableHead className="w-[260px]">最新进展</TableHead>
                  <TableHead className="w-[100px]">业务线</TableHead>
                  <TableHead className="w-[90px]">优先级</TableHead>
                  <TableHead className="w-[110px]">状态</TableHead>
                  <TableHead className="w-[120px]">开始日期</TableHead>
                  <TableHead className="w-[130px]">预计结束日期</TableHead>
                  <TableHead className="w-[150px]">总进度</TableHead>
                  <TableHead className="w-[150px]">添加时间</TableHead>
                  <TableHead className="w-[220px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.projectNo}</TableCell>
                      <TableCell>
                        <Button
                          variant="link"
                          className="p-0 h-auto"
                          onClick={() => navigate(`/projects/${record.id}`)}
                        >
                          {record.name}
                        </Button>
                      </TableCell>
                      <TableCell>{record.owner}</TableCell>
                      <TableCell>{record.salesUsers.join('、') || '-'}</TableCell>
                      <TableCell>{record.entity || '-'}</TableCell>
                      <TableCell>{record.latestProgress}</TableCell>
                      <TableCell>{record.businessLine}</TableCell>
                      <TableCell>{priorityTag(record.priority)}</TableCell>
                      <TableCell>{statusBadge(record.status)}</TableCell>
                      <TableCell>{record.startDate || '-'}</TableCell>
                      <TableCell>{record.expectedEndDate || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={record.progress} className="w-20" />
                          <span className="text-xs text-muted-foreground">{record.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{record.createdAt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/projects/${record.id}`)}
                          >
                            <Eye className="size-4" />
                            详情
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(record)}
                          >
                            <Pencil className="size-4" />
                            编辑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFollowModal(record)}
                          >
                            <Send className="size-4" />
                            跟进
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              const hasDailyReports = initialDailyReports.some(
                                (report) => report.projectId === record.id
                              );
                              if (
                                window.confirm(
                                  hasDailyReports
                                    ? '该项目已有关联日报，确认删除项目吗？'
                                    : '确认删除该项目吗？'
                                )
                              ) {
                                removeProject(record);
                              }
                            }}
                          >
                            <Trash2 className="size-4" />
                            删除
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 新建/编辑项目弹窗 */}
      <Dialog open={projectModalVisible} onOpenChange={setProjectModalVisible}>
        <DialogContent className="max-w-[860px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? '编辑项目' : '新建项目'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField label="项目名称" required>
                  <Input
                    placeholder="请输入项目名称"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </FormField>
              </div>
              <div className="col-span-3">
                <FormField label="优先级" required>
                  <Select
                    value={projectForm.priority}
                    onValueChange={(v) => setProjectForm((f) => ({ ...f, priority: v as ProjectPriority }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectPriorities.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
              <div className="col-span-3">
                <FormField label="状态" required>
                  <Select
                    value={projectForm.status}
                    onValueChange={(v) => setProjectForm((f) => ({ ...f, status: v as ProjectStatus }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatuses.map((item) => (
                        <SelectItem key={item} value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="对接主体">
                <Select
                  value={projectForm.entity}
                  onValueChange={(v) => setProjectForm((f) => ({ ...f, entity: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {companyEntities.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="业务线">
                <Select
                  value={projectForm.businessLine}
                  onValueChange={(v) => setProjectForm((f) => ({ ...f, businessLine: v as BusinessLine }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {businessLines.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="负责人" required>
                <Select
                  value={projectForm.owner}
                  onValueChange={(v) => setProjectForm((f) => ({ ...f, owner: v }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="销售人员">
                <MultiSelect
                  options={roleEmployees.sales}
                  value={projectForm.salesUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, salesUsers: v }))}
                />
              </FormField>
              <FormField label="协助人">
                <MultiSelect
                  options={employees}
                  value={projectForm.assistants}
                  onChange={(v) => setProjectForm((f) => ({ ...f, assistants: v }))}
                />
              </FormField>
              <FormField label="总进度">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={projectForm.progress ?? 0}
                    onChange={(e) => setProjectForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">%</span>
                </div>
              </FormField>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <FormField label="产品">
                <MultiSelect
                  options={roleEmployees.product}
                  value={projectForm.productUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, productUsers: v }))}
                />
              </FormField>
              <FormField label="UI">
                <MultiSelect
                  options={roleEmployees.ui}
                  value={projectForm.uiUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, uiUsers: v }))}
                />
              </FormField>
              <FormField label="前端">
                <MultiSelect
                  options={roleEmployees.frontend}
                  value={projectForm.frontendUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, frontendUsers: v }))}
                />
              </FormField>
              <FormField label="后端">
                <MultiSelect
                  options={roleEmployees.backend}
                  value={projectForm.backendUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, backendUsers: v }))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="运维">
                <MultiSelect
                  options={roleEmployees.ops}
                  value={projectForm.opsUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, opsUsers: v }))}
                />
              </FormField>
              <FormField label="测试">
                <MultiSelect
                  options={roleEmployees.test}
                  value={projectForm.testUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, testUsers: v }))}
                />
              </FormField>
              <FormField label="法务">
                <MultiSelect
                  options={roleEmployees.legal}
                  value={projectForm.legalUsers}
                  onChange={(v) => setProjectForm((f) => ({ ...f, legalUsers: v }))}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="开始日期">
                <Input
                  type="date"
                  value={projectForm.startDate || ''}
                  onChange={(e) => setProjectForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </FormField>
              <FormField label="预计结束日期">
                <Input
                  type="date"
                  value={projectForm.expectedEndDate || ''}
                  onChange={(e) => setProjectForm((f) => ({ ...f, expectedEndDate: e.target.value }))}
                />
              </FormField>
            </div>

            <FormField label="最新进展">
              <Textarea
                rows={3}
                placeholder="请输入最新进展"
                value={projectForm.latestProgress || ''}
                onChange={(e) => setProjectForm((f) => ({ ...f, latestProgress: e.target.value }))}
              />
            </FormField>

            <FormField label="备注">
              <Textarea
                rows={3}
                placeholder="请输入备注"
                value={projectForm.remark || ''}
                onChange={(e) => setProjectForm((f) => ({ ...f, remark: e.target.value }))}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectModalVisible(false)}>
              取消
            </Button>
            <Button onClick={saveProject}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 新增跟进弹窗 */}
      <Dialog open={followModalVisible} onOpenChange={setFollowModalVisible}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle>新增跟进</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="状态" required>
                <Select
                  value={followForm.status}
                  onValueChange={(v) => setFollowForm((f) => ({ ...f, status: v as ProjectStatus }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map((item) => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="总进度" required>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={followForm.progress}
                    onChange={(e) => setFollowForm((f) => ({ ...f, progress: Number(e.target.value) }))}
                  />
                  <span className="text-sm text-muted-foreground shrink-0">%</span>
                </div>
              </FormField>
            </div>
            <FormField label="跟进详情" required>
              <Textarea
                rows={4}
                value={followForm.content}
                onChange={(e) => setFollowForm((f) => ({ ...f, content: e.target.value }))}
              />
            </FormField>
            <FormField label="附件上传">
              <Input
                placeholder="第一版模拟上传，填写附件名称"
                value={followForm.attachmentName}
                onChange={(e) => setFollowForm((f) => ({ ...f, attachmentName: e.target.value }))}
              />
            </FormField>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowModalVisible(false)}>
              取消
            </Button>
            <Button onClick={saveFollow}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/**
 * Multi-select component using checkbox list inside a popover.
 * Simple implementation since Shadcn doesn't have a built-in multi-select.
 */
function MultiSelect({
  options,
  value = [],
  onChange,
}: {
  options: string[];
  value?: string[];
  onChange: (value: string[]) => void;
}) {
  const [open, setOpen] = useState(false);

  const toggle = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter((v) => v !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="border-input data-[placeholder]:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
        onClick={() => setOpen(!open)}
      >
        <span className={value.length ? '' : 'text-muted-foreground'}>
          {value.length ? `已选 ${value.length} 项` : '请选择'}
        </span>
        <svg
          className="size-4 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border p-1 shadow-md">
          {options.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <input
                type="checkbox"
                checked={value.includes(item)}
                onChange={() => toggle(item)}
                className="size-4 accent-primary"
              />
              {item}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
