import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  ArrowLeft,
  Pencil,
  FileText,
  Link as LinkIcon,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ProjectDocument,
  ProjectFollowUp,
  ProjectLeadRelation,
  ProjectStatus,
  availableLeads,
  buildProjectMemberHours,
  calculateProjectHours,
  initialDailyReports,
  initialDocuments,
  initialFollowUps,
  initialLeadRelations,
  initialProjects,
  projectStatuses,
  summarizeProgress,
} from './project-management/mockData';
import {
  buildProjectSummaryCards,
  type ProjectSummaryCard,
  type SummaryRiskLevel,
} from './projectDetailSummary';
import { initialDeliveryPlans } from './delivery-plan/mockData';
import { initialRequirements, initialTasks, initialDefects } from './issues/mockData';

const SUMMARY_LEVEL_STYLE: Record<SummaryRiskLevel, string> = {
  正常: 'bg-green-100 text-green-700',
  注意: 'bg-blue-100 text-blue-700',
  预警: 'bg-orange-100 text-orange-700',
  严重: 'bg-red-100 text-red-700',
};

const STATUS_STYLE: Record<ProjectStatus, string> = {
  未开始: 'bg-gray-100 text-gray-600',
  进行中: 'bg-blue-100 text-blue-700',
  已完成: 'bg-green-100 text-green-700',
  验收中: 'bg-blue-100 text-blue-700',
  搁置: 'bg-orange-100 text-orange-700',
  延迟: 'bg-red-100 text-red-700',
  催款中: 'bg-orange-100 text-orange-700',
};

function getTodayString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function SummaryHighlightCard({
  card,
  href,
  onClick,
}: {
  card: ProjectSummaryCard;
  href?: string;
  onClick?: () => void;
}) {
  const isInteractive = !!href || !!onClick;

  const content = (
    <Card
      className={`h-full ${isInteractive ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{card.title}</span>
            <span
              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${SUMMARY_LEVEL_STYLE[card.level]}`}
            >
              {card.level}
            </span>
          </div>
          <div className="text-[22px] font-semibold leading-[30px] text-foreground">
            {card.value}
          </div>
          <div className="text-sm font-medium leading-[22px] text-foreground">
            {card.alert}
          </div>
          <span className="text-xs text-muted-foreground">{card.detail}</span>
        </div>
      </CardContent>
    </Card>
  );

  if (!isInteractive) {
    return content;
  }

  if (href && !onClick) {
    return (
      <Link
        to={href}
        style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
      >
        {content}
      </Link>
    );
  }

  return content;
}

function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {status}
    </span>
  );
}

export function ProjectDetail() {
  const { id = '1' } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(initialProjects.find((item) => item.id === id) ?? initialProjects[0]);
  const [leadRelations, setLeadRelations] = useState<ProjectLeadRelation[]>(initialLeadRelations);
  const [followUps, setFollowUps] = useState<ProjectFollowUp[]>(initialFollowUps);
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);

  // Dialog open states
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);

  // Follow form state
  const [followStatus, setFollowStatus] = useState<ProjectStatus>(project.status);
  const [followProgress, setFollowProgress] = useState<string>(String(project.progress));
  const [followContent, setFollowContent] = useState('');
  const [followAttachmentName, setFollowAttachmentName] = useState('');

  // Lead form state
  const [leadKeyword, setLeadKeyword] = useState('');
  const [selectedLeadNo, setSelectedLeadNo] = useState<string>('');

  // Document form state
  const [docTitle, setDocTitle] = useState('');
  const [docOnlineUrl, setDocOnlineUrl] = useState('');
  const [docOwner, setDocOwner] = useState('');
  const [docUploadedFileName, setDocUploadedFileName] = useState('');
  const [docDescription, setDocDescription] = useState('');

  // Contract state
  const [selectedContractId, setSelectedContractId] = useState<string | undefined>(project.contractId);

  // Unlink confirm states
  const [unlinkLeadId, setUnlinkLeadId] = useState<string | null>(null);
  const [unlinkDocumentId, setUnlinkDocumentId] = useState<string | null>(null);
  const [unlinkContractConfirm, setUnlinkContractConfirm] = useState(false);

  const hasPlan = !!initialDeliveryPlans[project.id];

  const contractOptions = [
    { value: '1', label: 'CT20260320001 - 某科技公司年度框架协议' },
    { value: '2', label: 'HT-2026-002 - B公司小程序定制开发合同' },
    { value: '3', label: 'HT-2026-003 - 内部OA优化合同' },
    { value: '4', label: 'HT-2026-004 - A公司CRM系统开发合同' },
  ];

  const projectDailyReports = initialDailyReports.filter((report) => report.projectId === project.id);
  const memberHours = buildProjectMemberHours(project.id, initialDailyReports);
  const totalHours = calculateProjectHours(project.id, initialDailyReports);
  const projectLeads = leadRelations.filter((relation) => relation.projectId === project.id);
  const projectFollowUps = followUps.filter((follow) => follow.projectId === project.id);
  const projectDocuments = documents.filter((document) => document.projectId === project.id);
  const deliveryPlan = initialDeliveryPlans[project.id];
  const today = getTodayString();
  const workItemCounts = useMemo(() => ({
    requirements: initialRequirements.filter(r => r.projectId === project.id).length,
    tasks: initialTasks.filter(t => t.projectId === project.id).length,
    defects: initialDefects.filter(d => d.projectId === project.id).length,
  }), [project.id]);

  const summaryCards = useMemo(
    () =>
      buildProjectSummaryCards({
        project,
        allProjects: initialProjects,
        deliveryPlan,
        memberHours,
        totalHours,
        today,
        workItemCounts,
      }),
    [deliveryPlan, memberHours, project, today, totalHours, workItemCounts],
  );

  const filteredAvailableLeads = useMemo(() => {
    const linkedLeadNos = new Set(projectLeads.map((lead) => lead.leadNo));
    return availableLeads.filter((lead) => {
      const keywordMatched = !leadKeyword || lead.leadName.includes(leadKeyword) || lead.leadNo.includes(leadKeyword);
      return keywordMatched && !linkedLeadNos.has(lead.leadNo);
    });
  }, [leadKeyword, projectLeads]);

  const ownerOptions = [
    project.owner,
    ...project.assistants,
    ...project.productUsers,
    ...project.uiUsers,
    ...project.frontendUsers,
    ...project.backendUsers,
  ].filter(Boolean);

  // ── Modal open handlers ──────────────────────────────────────

  const openFollowModal = () => {
    setFollowStatus(project.status);
    setFollowProgress(String(project.progress));
    setFollowContent('');
    setFollowAttachmentName('');
    setFollowModalOpen(true);
  };

  const openCreateDocument = () => {
    setEditingDocument(null);
    setDocTitle('');
    setDocOnlineUrl('');
    setDocOwner('');
    setDocUploadedFileName('');
    setDocDescription('');
    setDocumentModalOpen(true);
  };

  const openEditDocument = (document: ProjectDocument) => {
    setEditingDocument(document);
    setDocTitle(document.title);
    setDocOnlineUrl(document.onlineUrl);
    setDocOwner(document.owner);
    setDocUploadedFileName(document.uploadedFileName);
    setDocDescription(document.description);
    setDocumentModalOpen(true);
  };

  // ── Save handlers ────────────────────────────────────────────

  const saveFollow = () => {
    if (!followContent.trim()) {
      toast.error('请输入跟进详情');
      return;
    }
    const attachmentName = followAttachmentName.trim();
    const nextFollow: ProjectFollowUp = {
      id: `follow-${Date.now()}`,
      projectId: project.id,
      status: followStatus,
      progress: Number(followProgress),
      content: followContent,
      attachments: attachmentName ? [{ id: `follow-att-${Date.now()}`, name: attachmentName, size: '模拟文件' }] : [],
      operator: project.owner,
      createdAt: '2026-05-09 11:00',
    };
    setFollowUps([nextFollow, ...followUps]);
    setProject({ ...project, status: followStatus, progress: Number(followProgress), latestProgress: summarizeProgress(followContent) });
    setFollowModalOpen(false);
    toast.success('跟进记录已新增');
  };

  const saveLeadRelation = () => {
    if (!selectedLeadNo) {
      toast.error('请选择线索');
      return;
    }
    const selectedLead = availableLeads.find((lead) => lead.leadNo === selectedLeadNo);
    if (!selectedLead) return;
    setLeadRelations([
      { ...selectedLead, id: `relation-${Date.now()}`, projectId: project.id },
      ...leadRelations,
    ]);
    setLeadModalOpen(false);
    setSelectedLeadNo('');
    setLeadKeyword('');
    toast.success('线索已关联到项目');
  };

  const removeLeadRelation = (relationId: string) => {
    setLeadRelations(leadRelations.filter((relation) => relation.id !== relationId));
    setUnlinkLeadId(null);
    toast.success('已解除线索关联');
  };

  const saveDocument = () => {
    const onlineUrl = docOnlineUrl.trim();
    const uploadedFileName = docUploadedFileName.trim();
    if (!onlineUrl && !uploadedFileName) {
      toast.error('线上地址和上传文档至少填写一个');
      return;
    }
    if (!docTitle.trim()) {
      toast.error('请输入标题');
      return;
    }
    if (!docOwner) {
      toast.error('请选择负责人');
      return;
    }

    const nextDocument: ProjectDocument = {
      id: editingDocument?.id ?? `doc-${Date.now()}`,
      projectId: project.id,
      title: docTitle,
      onlineUrl,
      owner: docOwner,
      uploadedFileName,
      description: docDescription || '',
      createdAt: editingDocument?.createdAt ?? '2026-05-09 11:30',
    };

    setDocuments((current) => {
      if (editingDocument) {
        return current.map((item) => (item.id === editingDocument.id ? nextDocument : item));
      }
      return [nextDocument, ...current];
    });
    setDocumentModalOpen(false);
    toast.success(editingDocument ? '项目文档已更新' : '项目文档已新增');
  };

  const removeDocument = (documentId: string) => {
    setDocuments(documents.filter((document) => document.id !== documentId));
    setUnlinkDocumentId(null);
    toast.success('项目文档已删除');
  };

  return (
    <div>
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="h-4 w-4" />
            返回
          </Button>
          <h4 className="text-lg font-semibold m-0">{project.name}</h4>
          <StatusPill status={project.status} />
        </div>
      </div>

      {/* ── Summary Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        {summaryCards.map((card) => (
          <SummaryHighlightCard
            key={card.key}
            card={card}
            href={
              card.key === 'delivery'
                ? `/projects/${project.id}/delivery`
                : card.key === 'hours'
                  ? `/projects/${project.id}/dailyreports`
                  : undefined
            }
            onClick={
              card.key === 'workItems'
                ? () => navigate(`/projects/${project.id}/issues`)
                : card.key === 'hours'
                  ? () => navigate(`/projects/${project.id}/dailyreports`)
                  : undefined
            }
          />
        ))}
      </div>

      {/* ── Info Alert ──────────────────────────────────────── */}
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          成本核算将在后续阶段接入人工成本设置、项目报销、投放日消耗、回款和利润分析；当前阶段先沉淀项目工时入口。
        </AlertDescription>
      </Alert>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        {/* Left: Tabs */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="basic">
                <div className="px-6 pt-6">
                  <TabsList>
                    <TabsTrigger value="basic">基础信息</TabsTrigger>
                    <TabsTrigger value="leads">关联线索 ({projectLeads.length})</TabsTrigger>
                    <TabsTrigger value="customers">关联客户</TabsTrigger>
                    <TabsTrigger value="daily">关联日报 ({projectDailyReports.length})</TabsTrigger>
                    <TabsTrigger value="documents">项目文档 ({projectDocuments.length})</TabsTrigger>
                  </TabsList>
                </div>

                {/* ── Basic Info Tab ──────────────────────────── */}
                <TabsContent value="basic" className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                    <div><span className="text-muted-foreground">编号：</span>{project.projectNo}</div>
                    <div><span className="text-muted-foreground">项目名称：</span>{project.name}</div>
                    <div><span className="text-muted-foreground">总进度：</span>{project.progress}%</div>
                    <div><span className="text-muted-foreground">对接主体：</span>{project.entity || '-'}</div>
                    <div><span className="text-muted-foreground">优先级：</span>{project.priority}</div>
                    <div><span className="text-muted-foreground">状态：</span>{project.status}</div>
                    <div><span className="text-muted-foreground">业务线：</span>{project.businessLine}</div>
                    <div><span className="text-muted-foreground">最新进展：</span>{project.latestProgress}</div>
                    <div><span className="text-muted-foreground">添加时间：</span>{project.createdAt}</div>
                    <div><span className="text-muted-foreground">负责人：</span>{project.owner}</div>
                    <div><span className="text-muted-foreground">销售人员：</span>{project.salesUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">协助人：</span>{project.assistants.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">产品：</span>{project.productUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">UI：</span>{project.uiUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">前端：</span>{project.frontendUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">后端：</span>{project.backendUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">运维：</span>{project.opsUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">测试：</span>{project.testUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">法务：</span>{project.legalUsers.join('、') || '-'}</div>
                    <div><span className="text-muted-foreground">开始日期：</span>{project.startDate || '-'}</div>
                    <div><span className="text-muted-foreground">预计结束日期：</span>{project.expectedEndDate || '-'}</div>
                    <div><span className="text-muted-foreground">备注：</span>{project.remark || '-'}</div>
                  </div>

                  {/* Contract section */}
                  <div className="flex items-center gap-3 mt-6 mb-2">
                    <Separator className="flex-1" />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">合同关联</span>
                    <Separator className="flex-1" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">关联合同：</span>
                    {project.contractId ? (
                      <>
                        <Badge variant="default">{project.contractId}</Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={hasPlan}
                              onClick={() => { setSelectedContractId(project.contractId); setContractModalOpen(true); }}
                            >
                              更换
                            </Button>
                          </TooltipTrigger>
                          {hasPlan && <TooltipContent>请先删除交付计划</TooltipContent>}
                        </Tooltip>
                        <AlertDialog open={unlinkContractConfirm} onOpenChange={setUnlinkContractConfirm}>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" disabled={hasPlan}>
                              解除
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认解除合同关联吗？</AlertDialogTitle>
                              <AlertDialogDescription>解除后项目将不再关联此合同。</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction onClick={() => { setProject({ ...project, contractId: undefined }); setUnlinkContractConfirm(false); }}>
                                确认
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <>
                        <span className="text-muted-foreground">未关联</span>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedContractId(undefined); setContractModalOpen(true); }}>
                          选择合同
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Attachments section */}
                  <div className="flex items-center gap-3 mt-6 mb-2">
                    <Separator className="flex-1" />
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">附件列表</span>
                    <Separator className="flex-1" />
                  </div>
                  {project.attachments.length ? (
                    <div className="flex flex-col gap-2">
                      {project.attachments.map((file) => (
                        <Badge key={file.id} variant="outline" className="w-fit gap-1">
                          <FileText className="h-3 w-3" />
                          {file.name} · {file.size}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
                      暂无附件
                    </div>
                  )}
                </TabsContent>

                {/* ── Leads Tab ───────────────────────────────── */}
                <TabsContent value="leads" className="px-6 pb-6">
                  <div className="flex justify-end mb-3">
                    <Button onClick={() => { setSelectedLeadNo(''); setLeadKeyword(''); setLeadModalOpen(true); }}>
                      <LinkIcon className="h-4 w-4" />
                      关联线索
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[140px]">编号</TableHead>
                          <TableHead className="w-[220px]">线索名称</TableHead>
                          <TableHead className="w-[100px]">归属人</TableHead>
                          <TableHead className="w-[160px]">售前群名称</TableHead>
                          <TableHead className="w-[120px]">客户分类</TableHead>
                          <TableHead className="w-[120px]">线索来源</TableHead>
                          <TableHead className="w-[100px]">客户称呼</TableHead>
                          <TableHead className="w-[130px]">联系电话</TableHead>
                          <TableHead className="w-[140px]">微信</TableHead>
                          <TableHead className="w-[160px]">线索添加时间</TableHead>
                          <TableHead className="w-[100px] sticky right-0 bg-card">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectLeads.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                              暂无数据
                            </TableCell>
                          </TableRow>
                        ) : (
                          projectLeads.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{record.leadNo}</TableCell>
                              <TableCell>{record.leadName}</TableCell>
                              <TableCell>{record.owner}</TableCell>
                              <TableCell>{record.preSaleGroupName}</TableCell>
                              <TableCell>{record.customerCategory}</TableCell>
                              <TableCell>{record.source}</TableCell>
                              <TableCell>{record.customerName}</TableCell>
                              <TableCell>{record.phone}</TableCell>
                              <TableCell>{record.wechat}</TableCell>
                              <TableCell>{record.leadCreatedAt}</TableCell>
                              <TableCell className="sticky right-0 bg-card">
                                <AlertDialog open={unlinkLeadId === record.id} onOpenChange={(open) => setUnlinkLeadId(open ? record.id : null)}>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                      删除关联
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>确认解除该线索关联吗？</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>取消</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => removeLeadRelation(record.id)}>
                                        确认
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* ── Customers Tab ───────────────────────────── */}
                <TabsContent value="customers" className="px-6 pb-6">
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-sm">
                    关联客户将在后续客户模块联动阶段实现
                  </div>
                </TabsContent>

                {/* ── Daily Reports Tab ───────────────────────── */}
                <TabsContent value="daily" className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">点击查看项目的日报列表和工时统计</span>
                    <Button onClick={() => navigate(`/projects/${project.id}/dailyreports`)}>
                      查看日报列表
                    </Button>
                  </div>
                  <h6 className="text-base font-semibold mb-3">工时概览</h6>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">编号</TableHead>
                          <TableHead>人员名称</TableHead>
                          <TableHead>职位</TableHead>
                          <TableHead>已用工时</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {memberHours.map((item, index) => (
                          <TableRow key={item.key}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.personName}</TableCell>
                            <TableCell>{item.position}</TableCell>
                            <TableCell>{item.hours}H</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={3} className="font-medium">总计</TableCell>
                          <TableCell className="font-medium">{totalHours}H</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                </TabsContent>

                {/* ── Documents Tab ───────────────────────────── */}
                <TabsContent value="documents" className="px-6 pb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">管理项目文档、线上地址和上传附件。</span>
                    <Button onClick={openCreateDocument}>
                      <Plus className="h-4 w-4" />
                      添加文档
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[70px]">编号</TableHead>
                          <TableHead className="w-[150px]">标题</TableHead>
                          <TableHead className="w-[180px]">线上地址</TableHead>
                          <TableHead className="w-[90px]">负责人</TableHead>
                          <TableHead className="w-[130px]">文档下载</TableHead>
                          <TableHead className="w-[180px]">文档说明</TableHead>
                          <TableHead className="w-[140px]">添加日期</TableHead>
                          <TableHead className="w-[120px]">操作</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectDocuments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                              暂无数据
                            </TableCell>
                          </TableRow>
                        ) : (
                          projectDocuments.map((record, index) => (
                            <TableRow key={record.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{record.title}</TableCell>
                              <TableCell>{record.onlineUrl || '-'}</TableCell>
                              <TableCell>{record.owner}</TableCell>
                              <TableCell>{record.uploadedFileName || '-'}</TableCell>
                              <TableCell>{record.description}</TableCell>
                              <TableCell>{record.createdAt}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => openEditDocument(record)}>
                                    <Pencil className="h-3.5 w-3.5" />
                                    编辑
                                  </Button>
                                  <AlertDialog open={unlinkDocumentId === record.id} onOpenChange={(open) => setUnlinkDocumentId(open ? record.id : null)}>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        删除
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>确认删除该文档吗？</AlertDialogTitle>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>取消</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => removeDocument(record.id)}>
                                          确认
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle>跟进记录</CardTitle>
                <Button variant="ghost" size="sm" onClick={openFollowModal}>
                  <Plus className="h-4 w-4" />
                  新增
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6">
                {/* Vertical line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                <div className="flex flex-col gap-6">
                  {projectFollowUps.map((follow) => (
                    <div key={follow.id} className="relative">
                      {/* Dot */}
                      <div className="absolute -left-6 top-1.5 w-[10px] h-[10px] rounded-full bg-primary border-2 border-background" />
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <StatusPill status={follow.status} />
                        <Badge variant="secondary">{follow.progress}%</Badge>
                        <span className="text-xs text-muted-foreground">{follow.operator}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mb-1 block">{follow.createdAt}</span>
                      <div className="text-sm">{follow.content}</div>
                      {follow.attachments.map((file) => (
                        <Badge key={file.id} variant="outline" className="mt-1.5 gap-1 w-fit">
                          <FileText className="h-3 w-3" />
                          {file.name}
                        </Badge>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Follow Modal ────────────────────────────────────── */}
      <Dialog open={followModalOpen} onOpenChange={setFollowModalOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>添加跟进</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>状态</Label>
              <Select value={followStatus} onValueChange={(v) => setFollowStatus(v as ProjectStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择状态" />
                </SelectTrigger>
                <SelectContent>
                  {projectStatuses.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>总进度</Label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={followProgress}
                  onChange={(e) => setFollowProgress(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>跟进详情</Label>
            <Textarea
              rows={4}
              value={followContent}
              onChange={(e) => setFollowContent(e.target.value)}
              placeholder="请输入跟进详情"
            />
          </div>
          <div className="grid gap-2">
            <Label>附件上传</Label>
            <Input
              placeholder="第一版模拟上传，填写附件名称"
              value={followAttachmentName}
              onChange={(e) => setFollowAttachmentName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFollowModalOpen(false)}>取消</Button>
            <Button onClick={saveFollow}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Lead Modal ──────────────────────────────────────── */}
      <Dialog open={leadModalOpen} onOpenChange={setLeadModalOpen}>
        <DialogContent className="sm:max-w-[680px]">
          <DialogHeader>
            <DialogTitle>关联线索</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="relative">
              <Input
                placeholder="输入标题或编号搜索线索"
                value={leadKeyword}
                onChange={(e) => setLeadKeyword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>选择线索</Label>
              <Select value={selectedLeadNo} onValueChange={setSelectedLeadNo}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择线索" />
                </SelectTrigger>
                <SelectContent>
                  {filteredAvailableLeads.map((lead) => (
                    <SelectItem key={lead.leadNo} value={lead.leadNo}>
                      {lead.leadNo} - {lead.leadName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLeadModalOpen(false)}>取消</Button>
            <Button onClick={saveLeadRelation}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Document Modal ──────────────────────────────────── */}
      <Dialog open={documentModalOpen} onOpenChange={setDocumentModalOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>{editingDocument ? '编辑文档' : '添加文档'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>标题</Label>
              <Input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} placeholder="请输入标题" />
            </div>
            <div className="grid gap-2">
              <Label>线上地址</Label>
              <Input value={docOnlineUrl} onChange={(e) => setDocOnlineUrl(e.target.value)} placeholder="请输入线上文档地址" />
            </div>
            <div className="grid gap-2">
              <Label>负责人</Label>
              <Select value={docOwner} onValueChange={setDocOwner}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择负责人" />
                </SelectTrigger>
                <SelectContent>
                  {ownerOptions.map((user) => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>上传文档</Label>
              <Input value={docUploadedFileName} onChange={(e) => setDocUploadedFileName(e.target.value)} placeholder="第一版模拟上传，填写文件名" />
            </div>
            <div className="grid gap-2">
              <Label>文档说明</Label>
              <Textarea rows={3} value={docDescription} onChange={(e) => setDocDescription(e.target.value)} placeholder="请输入文档说明" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocumentModalOpen(false)}>取消</Button>
            <Button onClick={saveDocument}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Contract Modal ──────────────────────────────────── */}
      <Dialog open={contractModalOpen} onOpenChange={setContractModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>关联合同</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label>选择合同</Label>
            <Select value={selectedContractId} onValueChange={setSelectedContractId}>
              <SelectTrigger>
                <SelectValue placeholder="请选择合同" />
              </SelectTrigger>
              <SelectContent>
                {contractOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setContractModalOpen(false)}>取消</Button>
            <Button onClick={() => { if (selectedContractId) { setProject({ ...project, contractId: selectedContractId }); } setContractModalOpen(false); }}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
