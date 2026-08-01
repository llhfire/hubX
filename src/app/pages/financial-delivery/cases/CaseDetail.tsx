import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, Printer, Pencil, Info, ExternalLink, CheckCircle, AlertTriangle, AlertCircle, CircleDot, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  mockCases,
  mockFeatureLists,
  mockFeatures,
  mockQuotations,
  mockQuotationFeatureItems,
  mockQuotationServiceItems,
  mockCostItems,
  mockCostTrends,
  mockCostStructures,
  mockForecastCostStructures,
  mockFinancialModels,
  mockProfitModes,
  mockPostMortems,
  quotationStatusMap,
  CaseStatus,
  HealthStatus,
  FeatureListStatus,
  QuotationStatus,
  caseStatusMap,
  healthStatusMap,
  featureListStatusMap,
  featureCategoryMap,
  serviceCategoryMap,
} from '../mockData';
import type { FinancialModel } from '../mockData';

// 财务模型详情内容组件
function ModelDetailContent({ model }: { model: FinancialModel }) {
  return (
    <div className="space-y-4 text-sm">
      {/* 基本信息 */}
      <div className="p-3 bg-muted rounded-lg">
        <p className="leading-relaxed">{model.description}</p>
        <div className="mt-2">
          <p className="font-medium">适用场景：</p>
          <ul className="list-disc list-inside text-muted-foreground mt-1">
            {model.applicableScenarios.map((scenario, index) => (
              <li key={index}>{scenario}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 设计理念 - 直接渲染，无额外容器 */}
      <div>
        <h3 className="font-semibold mb-2">设计理念</h3>
        <div className="whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-1.5">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-1.5">{children}</ul>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {model.designRationale}
          </ReactMarkdown>
        </div>
      </div>

      {/* 计算公式 - 直接渲染，无额外容器 */}
      <div>
        <h3 className="font-semibold mb-2">计算公式</h3>
        <div className="whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-base font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-sm font-bold mb-1">{children}</h2>,
              h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
              p: ({ children }) => <p className="mb-1.5">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-1.5">{children}</ul>,
              li: ({ children }) => <li className="mb-0.5">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto">{children}</code>
                ) : (
                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                );
              },
            }}
          >
            {model.calculationFormula}
          </ReactMarkdown>
        </div>
      </div>

      {/* 假设条件 */}
      <div>
        <h3 className="font-semibold mb-2">假设条件</h3>
        <ul className="list-disc pl-5 space-y-0.5">
          {model.assumptions.map((assumption, index) => (
            <li key={index}>{assumption}</li>
          ))}
        </ul>
      </div>

      {/* 局限性 */}
      <div>
        <h3 className="font-semibold mb-2">局限性</h3>
        <ul className="list-disc pl-5 space-y-0.5">
          {model.limitations.map((limitation, index) => (
            <li key={index} className="text-orange-600">{limitation}</li>
          ))}
        </ul>
      </div>

      {/* 更新历史 */}
      <div>
        <h3 className="font-semibold mb-2">更新历史</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">版本</TableHead>
              <TableHead className="w-[90px]">日期</TableHead>
              <TableHead>变更内容</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {model.updateHistory.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono text-xs">{item.version}</TableCell>
                <TableCell className="text-xs">{item.date}</TableCell>
                <TableCell className="text-xs">{item.changes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<FinancialModel | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedAuditItem, setSelectedAuditItem] = useState<any>(null);
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  // 获取财务模型数据
  const costModel = useMemo(() => mockFinancialModels['cost-software-outsourcing-tier2'], []);
  const revenueModel = useMemo(() => mockFinancialModels['revenue-software-outsourcing'], []);

  // 获取 Case 数据
  const caseData = useMemo(() => mockCases.find((item) => item.id === id), [id]);

  // 获取功能清单数据
  const featureLists = useMemo(() => mockFeatureLists.filter((item) => item.caseId === id), [id]);

  // 获取当前功能清单的功能点
  const currentFeatureList = useMemo(
    () => featureLists.find((item) => item.status === FeatureListStatus.LOCKED) || featureLists[0],
    [featureLists]
  );

  const features = useMemo(
    () => (currentFeatureList ? mockFeatures.filter((item) => item.featureListId === currentFeatureList.id) : []),
    [currentFeatureList]
  );

  // 获取报价单数据
  const quotations = useMemo(() => mockQuotations.filter((item) => item.caseId === id), [id]);

  // 获取当前报价单
  const currentQuotation = useMemo(
    () => quotations.find((item) => item.status === QuotationStatus.APPROVED) || quotations[0],
    [quotations]
  );

  // 获取报价功能项
  const quotationFeatureItems = useMemo(
    () => (currentQuotation ? mockQuotationFeatureItems.filter((item) => item.quotationId === currentQuotation.id) : []),
    [currentQuotation]
  );

  // 获取报价服务项
  const quotationServiceItems = useMemo(
    () => (currentQuotation ? mockQuotationServiceItems.filter((item) => item.quotationId === currentQuotation.id) : []),
    [currentQuotation]
  );

  // 获取成本项数据
  const costItems = useMemo(() => mockCostItems.filter((item) => item.caseId === id), [id]);

  // 获取成本趋势数据
  const costTrends = useMemo(() => mockCostTrends[id || ''] || [], [id]);

  // 获取成本结构数据
  const costStructure = useMemo(() => mockCostStructures[id || ''] || [], [id]);
  const forecastCostStructure = useMemo(() => mockForecastCostStructures[id || ''] || [], [id]);

  // 获取事后总结数据
  const postMortem = useMemo(() => mockPostMortems.find((item) => item.caseId === id), [id]);

  // 如果没有找到 Case
  if (!caseData) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">未找到业务单</h2>
        <Button className="mt-4" onClick={() => navigate('/financial-delivery/cases')}>
          返回列表
        </Button>
      </div>
    );
  }

  // 获取状态徽章
  const getStatusBadge = (status: CaseStatus) => {
    const config = caseStatusMap[status];
    const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      default: 'default',
      processing: 'secondary',
      success: 'default',
      warning: 'outline',
      error: 'destructive',
    };
    return <Badge variant={variantMap[config.color] || 'default'}>{config.label}</Badge>;
  };

  // 渲染概览标签页
  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">业务单编号</p>
              <p className="font-medium">{caseData.caseNo}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">状态</p>
              <div>{getStatusBadge(caseData.status)}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">健康状态</p>
              <Badge
                variant={
                  caseData.healthStatus === HealthStatus.GREEN
                    ? 'default'
                    : caseData.healthStatus === HealthStatus.YELLOW
                    ? 'outline'
                    : 'destructive'
                }
              >
                {healthStatusMap[caseData.healthStatus].label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">线索名称</p>
              {caseData.leadId ? (
                <a
                  href={`/leads/${caseData.leadId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  {caseData.leadName || '-'}
                </a>
              ) : (
                <p className="font-medium">{caseData.leadName || '-'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">项目名称</p>
              {caseData.projectId ? (
                <a
                  href={`/projects/${caseData.projectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  {caseData.projectName || '-'}
                </a>
              ) : (
                <p className="font-medium">{caseData.projectName || '-'}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">合同金额</p>
              <p className="font-medium">
                {caseData.contractAmount ? `¥${caseData.contractAmount.toLocaleString()}` : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">行业</p>
              <p className="font-medium">{caseData.industry || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">项目类型</p>
              <p className="font-medium">{caseData.projectType || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">技术栈</p>
              <p className="font-medium">{caseData.techStack ? caseData.techStack.join(', ') : '-'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 财务指标 */}
      <Card>
        <CardHeader>
          <CardTitle>财务指标</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">合同金额</p>
              <p className="text-2xl font-bold">¥{(caseData.contractAmount || 0).toLocaleString()}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setSelectedModel(revenueModel)}>
                    <Info className="h-3 w-3 mr-1" />
                    收入模型说明
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ width: '800px', maxWidth: '95vw', maxHeight: '85vh' }} className="flex flex-col">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>{selectedModel?.name}</DialogTitle>
                    <DialogDescription>
                      版本：{selectedModel?.version} | 类型：{selectedModel?.type === 'cost' ? '成本模型' : '收入模型'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {selectedModel && <ModelDetailContent model={selectedModel} />}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已发生成本</p>
              <p className="text-2xl font-bold text-red-600">
                ¥{(caseData.totalCost || 0).toLocaleString()}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-xs" onClick={() => setSelectedModel(costModel)}>
                    <Info className="h-3 w-3 mr-1" />
                    成本模型说明
                  </Button>
                </DialogTrigger>
                <DialogContent style={{ width: '800px', maxWidth: '95vw', maxHeight: '85vh' }} className="flex flex-col">
                  <DialogHeader className="flex-shrink-0">
                    <DialogTitle>{selectedModel?.name}</DialogTitle>
                    <DialogDescription>
                      版本：{selectedModel?.version} | 类型：{selectedModel?.type === 'cost' ? '成本模型' : '收入模型'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {selectedModel && <ModelDetailContent model={selectedModel} />}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">已确认收入</p>
              <p className="text-2xl font-bold text-green-600">
                ¥{(caseData.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">当前利润率</p>
              <p
                className="text-2xl font-bold"
                style={{
                  color:
                    (caseData.currentMargin || 0) >= 30
                      ? '#22c55e'
                      : (caseData.currentMargin || 0) >= 20
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              >
                {caseData.currentMargin || 0}%
              </p>
            </div>
          </div>

          {/* 预测指标 */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">预测指标（EAC）</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">预测总成本</p>
                <p className="text-lg font-bold">
                  ¥{(caseData.eac || 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  完工估算 (EAC)
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">WIP 资金占用</p>
                <p className="text-lg font-bold">
                  ¥{(caseData.wipValue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {caseData.wipDays || 0} 天未验收
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">预测净利润</p>
                <p className="text-lg font-bold">
                  ¥{((caseData.contractAmount || 0) - (caseData.eac || 0)).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  合同金额 - EAC
                </p>
              </div>
              <div className="p-3 border rounded-lg">
                <p className="text-xs text-muted-foreground">预测利润率</p>
                <p className="text-lg font-bold">
                  {((1 - (caseData.eac || 0) / (caseData.contractAmount || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  目标: {caseData.targetMargin || 35}%
                </p>
              </div>
            </div>
          </div>

          {/* 预算与合同变更情况 */}
          {featureLists.filter(fl => fl.caseId === id).length > 1 && (
            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">需求变更与合同调整</h4>
              <div className="p-4 border rounded-lg">
                <div className="grid grid-cols-2 gap-6">
                  {/* 工时评估变更 */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium">工时评估变更：</p>
                    <div className="space-y-1 text-sm">
                      <p>原始工时：<strong>{featureLists.find(fl => fl.caseId === id && fl.version === 1)?.totalEstimatedDays || 0}</strong>天</p>
                      <p>变更追加：<strong className="text-orange-600">+{((featureLists.find(fl => fl.caseId === id && fl.version === featureLists.filter(fl2 => fl2.caseId === id).length)?.totalEstimatedDays || 0) - (featureLists.find(fl => fl.caseId === id && fl.version === 1)?.totalEstimatedDays || 0))}</strong>天</p>
                      <p>当前工时：<strong className="text-blue-600">{featureLists.find(fl => fl.caseId === id && fl.version === featureLists.filter(fl2 => fl2.caseId === id).length)?.totalEstimatedDays || 0}</strong>天</p>
                    </div>
                  </div>
                  {/* 合同金额变更 */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium">合同金额调整：</p>
                    <div className="space-y-1 text-sm">
                      <p>原始合同：<strong>¥185,000</strong></p>
                      <p>变更追加：<strong className="text-green-600">+¥20,000</strong></p>
                      <p>当前合同：<strong className="text-blue-600">¥205,000</strong></p>
                    </div>
                  </div>
                </div>
                {/* 变更单列表 */}
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">变更单记录：</p>
                  <div className="flex items-center gap-3 text-xs">
                    <Badge variant="outline">CR-001</Badge>
                    <span>2026-07-15</span>
                    <span>订单管理模块增强</span>
                    <span className="text-green-600">+¥20,000</span>
                    <Badge variant="success">已审批</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 同类项目对比 */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">同类项目对比</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">项目</th>
                    <th className="text-right py-2 font-medium">合同金额</th>
                    <th className="text-right py-2 font-medium">利润率</th>
                    <th className="text-right py-2 font-medium">工时效率</th>
                    <th className="text-right py-2 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-muted font-medium">
                    <td className="py-2">📌 当前项目</td>
                    <td className="text-right py-2">¥{(caseData.contractAmount || 0).toLocaleString()}</td>
                    <td className="text-right py-2">{caseData.currentMargin || 0}%</td>
                    <td className="text-right py-2">1.0</td>
                    <td className="text-right py-2">
                      <Badge variant="outline">{caseData.projectType || '软件定制'}</Badge>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">电商购物项目A</td>
                    <td className="text-right py-2">¥120,000</td>
                    <td className="text-right py-2">32.5%</td>
                    <td className="text-right py-2">1.15</td>
                    <td className="text-right py-2"><Badge>已完成</Badge></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">电商购物项目B</td>
                    <td className="text-right py-2">¥95,000</td>
                    <td className="text-right py-2">28.3%</td>
                    <td className="text-right py-2">0.95</td>
                    <td className="text-right py-2"><Badge>已完成</Badge></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">电商购物项目C</td>
                    <td className="text-right py-2">¥150,000</td>
                    <td className="text-right py-2">22.1%</td>
                    <td className="text-right py-2">0.88</td>
                    <td className="text-right py-2"><Badge variant="secondary">进行中</Badge></td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t font-medium bg-muted">
                    <td className="py-2">同类型平均</td>
                    <td className="text-right py-2">¥121,667</td>
                    <td className="text-right py-2">27.6%</td>
                    <td className="text-right py-2">0.99</td>
                    <td className="text-right py-2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span>当前项目利润率 {caseData.currentMargin || 0}% {((caseData.currentMargin || 0) >= 27.6) ? '高于' : '低于'} 同类平均 27.6%</span>
              <span>|</span>
              <span>工时效率 1.0 {((1.0) >= 0.99) ? '达标' : '偏低'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成本与收入趋势图 */}
      {costTrends.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>成本与收入趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-500" />
                  <span>实际成本</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderTop: '2px dashed #3b82f6', height: 0 }} />
                  <span>预测成本</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderTop: '2px dashed #16a34a', height: 0 }} />
                  <span>合同约定收款</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-orange-500" />
                  <span>实际收款</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => value ? `¥${Number(value).toLocaleString()}` : '-'} />
                  <Legend />
                  {/* 实际成本 - 实线 */}
                  <Area
                    type="monotone"
                    dataKey="actualTotalCost"
                    name="实际成本"
                    stroke="#3b82f6"
                    fill="#dbeafe"
                    strokeWidth={2}
                    connectNulls={false}
                  />
                  {/* 预测成本 - 虚线 */}
                  <Area
                    type="monotone"
                    dataKey="forecastTotalCost"
                    name="预测成本(EAC)"
                    stroke="#3b82f6"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    connectNulls={false}
                  />
                  {/* 合同约定收款 - 阶梯虚线（绿色） */}
                  <Area
                    type="stepAfter"
                    dataKey="contractRevenue"
                    name="合同约定收款"
                    stroke="#16a34a"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    connectNulls={false}
                  />
                  {/* 实际收款 - 阶梯实线（橙色） */}
                  <Area
                    type="stepAfter"
                    dataKey="actualRevenue"
                    name="实际收款"
                    stroke="#f97316"
                    fill="#fed7aa"
                    strokeWidth={2}
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {/* 收款差异说明 */}
              <div className="mt-4 p-3 bg-orange-50 rounded-lg text-sm">
                <p className="font-medium text-orange-800 mb-2">收款进度分析：</p>
                <div className="space-y-1 text-orange-700">
                  <p>• 首期款（¥55,500）：已收到 ✓</p>
                  <p>• 中期款（¥74,000）：已收到 ¥46,250，未收 ¥27,750（2笔未付）</p>
                  <p>• 尾款（¥55,500）：未收到</p>
                  <p>• 合同约定收款：¥111,000，实际收款：¥101,750</p>
                  <p>• 当前未收金额：<strong className="text-red-600">¥83,250</strong>（应收¥185,000 - 实收¥101,750）</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>利润率趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-blue-500" />
                  <span>实际利润率（实线）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 border-t-2 border-dashed" style={{ borderTop: '2px dashed #3b82f6', height: 0 }} />
                  <span>预测利润率（虚线）</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0.5 bg-green-500" />
                  <span>目标基线（{caseData.targetMargin || 30}%）</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 50]} />
                  <Tooltip formatter={(value) => value ? `${Number(value).toFixed(1)}%` : '-'} />
                  <Legend />
                  {/* 目标基线 - 绿色水平线 */}
                  <Line
                    type="monotone"
                    dataKey={() => caseData.targetMargin || 30}
                    name="目标基线"
                    stroke="#22c55e"
                    strokeWidth={2}
                    strokeDasharray="10 5"
                    dot={false}
                    activeDot={false}
                  />
                  {/* 实际利润率 - 实线 */}
                  <Line
                    type="monotone"
                    dataKey="actualMargin"
                    name="实际利润率"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                  {/* 预测利润率 - 虚线 */}
                  <Line
                    type="monotone"
                    dataKey="forecastMargin"
                    name="预测利润率"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* 利润率分析说明 */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="font-medium text-blue-800 mb-2">利润率分析：</p>
                <div className="space-y-1 text-blue-700">
                  <p>• 目标利润率基线：<strong>{caseData.targetMargin || 30}%</strong>（合同签订时设定）</p>
                  <p>• 当前实际利润率：<strong>{caseData.currentMargin || 30.5}%</strong>（{((caseData.currentMargin || 30.5) >= (caseData.targetMargin || 30)) ? '高于' : '低于'}目标 {(Math.abs((caseData.currentMargin || 30.5) - (caseData.targetMargin || 30))).toFixed(1)} 个百分点）</p>
                  <p>• 结项预测利润率：<strong>{((1 - (caseData.eac || 116000) / (caseData.contractAmount || 185000)) * 100).toFixed(1)}%</strong></p>
                  <p>• 利润率波动原因：主要受回款节奏影响，中期款后置导致收入确认延迟</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 成本结构分析 */}
      {costStructure.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>成本结构</CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCostStructureView('actual')}
                  className={`px-3 py-1 text-xs rounded ${costStructureView === 'actual' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  已发生
                </button>
                <button
                  onClick={() => setCostStructureView('forecast')}
                  className={`px-3 py-1 text-xs rounded ${costStructureView === 'forecast' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  预测
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={costStructureView === 'actual' ? costStructure : forecastCostStructure}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {(costStructureView === 'actual' ? costStructure : forecastCostStructure).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `¥${Number(value).toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-muted-foreground mt-2">
                {costStructureView === 'actual' ? '已发生' : '预测'}成本合计：¥{(costStructureView === 'actual' ? costStructure : forecastCostStructure).reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>成本构成明细</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* 表头 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4" />
                    <span>成本类别</span>
                  </div>
                  <div className="flex gap-8">
                    <span className="w-24 text-right">已发生</span>
                    <span className="w-24 text-right">预测</span>
                  </div>
                </div>

                {/* 数据行 */}
                {costStructure.map((item, index) => {
                  const forecastItem = forecastCostStructure.find(f => f.category === item.category);
                  const variance = forecastItem ? forecastItem.amount - item.amount : 0;
                  return (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.category}</span>
                      </div>
                      <div className="flex gap-8 text-sm">
                        <div className="w-24 text-right">
                          <div>¥{item.amount.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                        </div>
                        <div className="w-24 text-right">
                          <div className={variance > 0 ? 'text-orange-600' : 'text-muted-foreground'}>
                            ¥{(forecastItem?.amount || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">{forecastItem?.percentage || 0}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 合计行 */}
                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>合计</span>
                    <div className="flex gap-8">
                      <span className="w-24 text-right">
                        ¥{costStructure.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </span>
                      <span className="w-24 text-right text-orange-600">
                        ¥{forecastCostStructure.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 差异说明 */}
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <span className="text-blue-700">
                    预测增加：¥{(forecastCostStructure.reduce((sum, item) => sum + item.amount, 0) - costStructure.reduce((sum, item) => sum + item.amount, 0)).toLocaleString()}
                    （+{((forecastCostStructure.reduce((sum, item) => sum + item.amount, 0) - costStructure.reduce((sum, item) => sum + item.amount, 0)) / costStructure.reduce((sum, item) => sum + item.amount, 0) * 100).toFixed(1)}%）
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 成本增长曲线（叠加面积图） */}
      {costTrends.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>成本增长曲线</CardTitle>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#1e40af' }} />
                <span>人力成本</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#3b82f6' }} />
                <span>商务成本</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#60a5fa' }} />
                <span>运营成本</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#93c5fd' }} />
                <span>第三方成本</span>
              </div>
              <div className="w-px h-4 bg-gray-300 mx-2" />
              <div className="flex items-center gap-2">
                <div className="w-4 h-3 rounded" style={{ backgroundColor: '#93c5fd', opacity: 0.4 }} />
                <span>预测</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={costTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => value ? [`¥${Number(value).toLocaleString()}`, name] : '-'} />
                  <Legend />
                  {/* 已发生成本 - 堆叠面积图 */}
                  <Area
                    type="monotone"
                    dataKey="actualLaborCost"
                    name="人力成本"
                    stackId="actual"
                    stroke="#1e40af"
                    fill="#1e40af"
                    fillOpacity={0.8}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="actualCommercialCost"
                    name="商务成本"
                    stackId="actual"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.8}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="actualOperationCost"
                    name="运营成本"
                    stackId="actual"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.8}
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="actualThirdPartyCost"
                    name="第三方成本"
                    stackId="actual"
                    stroke="#93c5fd"
                    fill="#93c5fd"
                    fillOpacity={0.8}
                    connectNulls={false}
                  />
                  {/* 预测成本 - 半透明叠加 */}
                  <Area
                    type="monotone"
                    dataKey="forecastLaborCost"
                    name="人力成本(预测)"
                    stackId="forecast"
                    stroke="#1e40af"
                    fill="#93c5fd"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecastCommercialCost"
                    name="商务成本(预测)"
                    stackId="forecast"
                    stroke="#3b82f6"
                    fill="#93c5fd"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecastOperationCost"
                    name="运营成本(预测)"
                    stackId="forecast"
                    stroke="#60a5fa"
                    fill="#93c5fd"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    connectNulls={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="forecastThirdPartyCost"
                    name="第三方成本(预测)"
                    stackId="forecast"
                    stroke="#93c5fd"
                    fill="#93c5fd"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    strokeDasharray="8 4"
                    connectNulls={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
              {/* 预测区域标注 */}
              <div className="absolute top-4 right-16 bg-white/80 px-3 py-1 rounded border text-xs text-gray-500">
                PROJECTED
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // 渲染功能清单标签页
  const [expandedFeatureLists, setExpandedFeatureLists] = useState<Set<string>>(new Set());
  const [expandedQuotations, setExpandedQuotations] = useState<Set<string>>(new Set());
  const [costStructureView, setCostStructureView] = useState<'actual' | 'forecast'>('actual');

  const toggleFeatureListExpand = (id: string) => {
    setExpandedFeatureLists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleQuotationExpand = (id: string) => {
    setExpandedQuotations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const renderFeatureListTab = () => {
    const allFeatureLists = featureLists.filter(fl => fl.caseId === id);

    return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>工时评估</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">由技术部评估，评估人：主管1人 + 工程师1人 | 共 {allFeatureLists.length} 份评估</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出 Excel
          </Button>
          <Button size="sm">新建变更评估</Button>
        </div>
      </CardHeader>
      <CardContent>
        {allFeatureLists.length > 0 ? (
          <div className="space-y-4">
            {/* 逐个显示每份工时评估 */}
            {allFeatureLists.sort((a, b) => a.version - b.version).map((fl, index) => (
              <div key={fl.id} className={`rounded-lg border ${index === allFeatureLists.length - 1 ? 'bg-blue-50 border-blue-200' : 'bg-muted'}`}>
                {/* 摘要行 - 点击展开/收起 */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleFeatureListExpand(fl.id)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'outline' : 'default'}>
                      {index === 0 ? '原始评估' : `变更评估 #${index}`}
                    </Badge>
                    <h4 className="font-medium">工时评估 v{fl.version}</h4>
                    <Badge variant={fl.status === FeatureListStatus.LOCKED ? 'default' : 'secondary'}>
                      {featureListStatusMap[fl.status].label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {fl.totalEstimatedDays}天 | ¥{fl.totalEstimatedCost.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(fl.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">{expandedFeatureLists.has(fl.id) ? '▼' : '▶'}</span>
                  </div>
                </div>

                {/* 展开详情 - 完整表格 */}
                {expandedFeatureLists.has(fl.id) && (
                  <div className="px-4 pb-4 border-t">
                    {/* 摘要信息 */}
                    <div className="grid grid-cols-4 gap-4 text-sm mt-3 mb-4">
                      <div>
                        <p className="text-muted-foreground">总人天</p>
                        <p className="font-bold text-lg">{fl.totalEstimatedDays}天</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">估算成本</p>
                        <p className="font-bold text-lg">¥{fl.totalEstimatedCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">评估人</p>
                        <p className="font-medium">张三（主管）+ 李四（工程师）</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">状态</p>
                        <p className="font-medium">{fl.status === FeatureListStatus.LOCKED ? '已确认' : '待确认'}</p>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="mb-4 p-2 bg-orange-50 rounded text-xs">
                        <span className="text-muted-foreground">变更说明：</span>
                        <span className="text-orange-600 font-medium">
                          工时 +{fl.totalEstimatedDays - (allFeatureLists[index - 1]?.totalEstimatedDays || 0)}天，
                          成本 +¥{((fl.totalEstimatedCost || 0) - (allFeatureLists[index - 1]?.totalEstimatedCost || 0)).toLocaleString()}
                        </span>
                      </div>
                    )}

                    {/* 完整工时评估表格 */}
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40px]">#</TableHead>
                            <TableHead className="w-[140px]">功能模块</TableHead>
                            <TableHead className="w-[160px]">功能描述</TableHead>
                            <TableHead className="w-[50px]">优先级</TableHead>
                            <TableHead className="w-[50px]">产品</TableHead>
                            <TableHead className="w-[50px]">UI</TableHead>
                            <TableHead className="w-[50px]">Java</TableHead>
                            <TableHead className="w-[50px]">Web</TableHead>
                            <TableHead className="w-[50px]">Flutter</TableHead>
                            <TableHead className="w-[50px]">测试</TableHead>
                            <TableHead className="w-[60px]">合计</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-gray-100">
                            <TableCell colSpan={11} className="font-medium text-sm">用户模块</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs">1.1</TableCell>
                            <TableCell className="text-xs">用户注册/登录</TableCell>
                            <TableCell className="text-xs">手机号注册、微信登录</TableCell>
                            <TableCell><Badge variant="destructive" className="text-xs">P0</Badge></TableCell>
                            <TableCell className="text-xs">0.5</TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs font-medium">7.5</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs">1.2</TableCell>
                            <TableCell className="text-xs">角色权限</TableCell>
                            <TableCell className="text-xs">RBAC权限模型</TableCell>
                            <TableCell><Badge variant="destructive" className="text-xs">P0</Badge></TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">-</TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs font-medium">7</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-100">
                            <TableCell colSpan={11} className="font-medium text-sm">商品模块</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs">2.1</TableCell>
                            <TableCell className="text-xs">商品管理</TableCell>
                            <TableCell className="text-xs">增删改查、分类管理</TableCell>
                            <TableCell><Badge variant="destructive" className="text-xs">P0</Badge></TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">3</TableCell>
                            <TableCell className="text-xs">-</TableCell>
                            <TableCell className="text-xs">1.5</TableCell>
                            <TableCell className="text-xs font-medium">9.5</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-100">
                            <TableCell colSpan={11} className="font-medium text-sm">订单模块</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs">3.1</TableCell>
                            <TableCell className="text-xs">下单流程</TableCell>
                            <TableCell className="text-xs">购物车、支付、回调</TableCell>
                            <TableCell><Badge variant="destructive" className="text-xs">P0</Badge></TableCell>
                            <TableCell className="text-xs">1</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs">3</TableCell>
                            <TableCell className="text-xs">3</TableCell>
                            <TableCell className="text-xs">2</TableCell>
                            <TableCell className="text-xs font-medium">13</TableCell>
                          </TableRow>
                          <TableRow className="font-bold bg-gray-200">
                            <TableCell colSpan={4} className="text-xs">合计</TableCell>
                            <TableCell className="text-xs">2.5</TableCell>
                            <TableCell className="text-xs">5</TableCell>
                            <TableCell className="text-xs">7</TableCell>
                            <TableCell className="text-xs">10</TableCell>
                            <TableCell className="text-xs">5</TableCell>
                            <TableCell className="text-xs">5.5</TableCell>
                            <TableCell className="text-xs">35</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">暂无工时评估</p>
        )}
      </CardContent>
    </Card>
    );
  };

  // 渲染报价单标签页
  const renderQuotationTab = () => {
    const allQuotations = quotations.filter(q => q.caseId === id);

    return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>报价单</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">共 {allQuotations.length} 份报价单</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出 Excel
          </Button>
          <Button size="sm">新建变更报价</Button>
        </div>
      </CardHeader>
      <CardContent>
        {allQuotations.length > 0 ? (
          <div className="space-y-4">
            {/* 逐个显示每份报价单 */}
            {allQuotations.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((quote, index) => (
              <div key={quote.id} className={`rounded-lg border ${index === allQuotations.length - 1 ? 'bg-blue-50 border-blue-200' : 'bg-muted'}`}>
                {/* 摘要行 - 点击展开/收起 */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleQuotationExpand(quote.id)}
                >
                  <div className="flex items-center gap-3">
                    <Badge variant={index === 0 ? 'outline' : 'default'}>
                      {index === 0 ? '原始报价' : `变更报价 #${index}`}
                    </Badge>
                    <h4 className="font-medium">{quote.quotationNo}</h4>
                    <Badge>{quotationStatusMap[quote.status as keyof typeof quotationStatusMap]?.label || quote.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      ¥{quote.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-muted-foreground">{expandedQuotations.has(quote.id) ? '▼' : '▶'}</span>
                  </div>
                </div>

                {/* 展开详情 - 完整报价表格 */}
                {expandedQuotations.has(quote.id) && (
                  <div className="px-4 pb-4 border-t">
                    {/* 摘要信息 */}
                    <div className="grid grid-cols-4 gap-4 text-sm mt-3 mb-4">
                      <div>
                        <p className="text-muted-foreground">项目名称</p>
                        <p className="font-medium">{quote.projectName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">功能报价</p>
                        <p className="font-medium">¥{quote.totalFeatureCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">服务报价</p>
                        <p className="font-medium">¥{quote.totalServiceCost.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">报价总金额</p>
                        <p className="font-bold text-lg text-blue-600">¥{quote.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    {index > 0 && (
                      <div className="mb-4 p-2 bg-green-50 rounded text-xs">
                        <span className="text-muted-foreground">变更说明：</span>
                        <span className="text-green-600 font-medium">
                          合同金额增加 +¥{quote.totalAmount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground ml-2">（{quote.description}）</span>
                      </div>
                    )}

                    {/* 功能报价明细表格 */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">功能报价明细</h5>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[40px]">#</TableHead>
                              <TableHead className="w-[140px]">功能名称</TableHead>
                              <TableHead className="w-[50px]">产品</TableHead>
                              <TableHead className="w-[50px]">设计</TableHead>
                              <TableHead className="w-[50px]">前端</TableHead>
                              <TableHead className="w-[50px]">后端</TableHead>
                              <TableHead className="w-[50px]">测试</TableHead>
                              <TableHead className="w-[60px]">人天合计</TableHead>
                              <TableHead className="w-[80px] text-right">金额</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">用户注册/登录</TableCell>
                              <TableCell className="text-xs">0.5</TableCell>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs font-medium">5.5</TableCell>
                              <TableCell className="text-xs text-right">¥2,750</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">商品管理</TableCell>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">3</TableCell>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">1.5</TableCell>
                              <TableCell className="text-xs font-medium">9.5</TableCell>
                              <TableCell className="text-xs text-right">¥4,750</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">3</TableCell>
                              <TableCell className="text-xs">订单管理</TableCell>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">3</TableCell>
                              <TableCell className="text-xs">3</TableCell>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs font-medium">11</TableCell>
                              <TableCell className="text-xs text-right">¥5,500</TableCell>
                            </TableRow>
                            <TableRow className="font-bold bg-gray-200">
                              <TableCell colSpan={2} className="text-xs">合计</TableCell>
                              <TableCell className="text-xs">2.5</TableCell>
                              <TableCell className="text-xs">5</TableCell>
                              <TableCell className="text-xs">8</TableCell>
                              <TableCell className="text-xs">6</TableCell>
                              <TableCell className="text-xs">4.5</TableCell>
                              <TableCell className="text-xs">26</TableCell>
                              <TableCell className="text-xs text-right">¥13,000</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* 服务费用明细表格 */}
                    <div className="mb-4">
                      <h5 className="text-sm font-medium mb-2">服务费用明细</h5>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[40px]">#</TableHead>
                              <TableHead className="w-[100px]">服务类别</TableHead>
                              <TableHead className="w-[140px]">服务项目</TableHead>
                              <TableHead className="w-[80px] text-right">金额</TableHead>
                              <TableHead className="w-[100px]">说明</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-xs">1</TableCell>
                              <TableCell className="text-xs">驻场服务</TableCell>
                              <TableCell className="text-xs">客户现场驻场</TableCell>
                              <TableCell className="text-xs text-right">¥{quote.totalServiceCost > 10000 ? '12,000' : '6,000'}</TableCell>
                              <TableCell className="text-xs">{quote.totalServiceCost > 10000 ? '开发期间30天' : '开发期间15天'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">2</TableCell>
                              <TableCell className="text-xs">培训服务</TableCell>
                              <TableCell className="text-xs">用户培训</TableCell>
                              <TableCell className="text-xs text-right">¥{quote.totalServiceCost > 10000 ? '3,000' : '1,500'}</TableCell>
                              <TableCell className="text-xs">系统使用培训</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs">3</TableCell>
                              <TableCell className="text-xs">维护服务</TableCell>
                              <TableCell className="text-xs">首年免费维护</TableCell>
                              <TableCell className="text-xs text-right">¥0</TableCell>
                              <TableCell className="text-xs">首年免费</TableCell>
                            </TableRow>
                            <TableRow className="font-bold bg-gray-200">
                              <TableCell colSpan={3} className="text-xs">合计</TableCell>
                              <TableCell className="text-xs text-right">¥{quote.totalServiceCost.toLocaleString()}</TableCell>
                              <TableCell className="text-xs"></TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    {/* 报价构成汇总 */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">报价构成</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <p className="text-xs text-muted-foreground">功能开发</p>
                          <p className="font-bold">¥{quote.totalFeatureCost.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <p className="text-xs text-muted-foreground">服务费用</p>
                          <p className="font-bold">¥{quote.totalServiceCost.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <p className="text-xs text-muted-foreground">合计</p>
                          <p className="font-bold text-blue-600">¥{quote.totalAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无报价单</p>
            <Button className="mt-4">创建报价单</Button>
          </div>
        )}
      </CardContent>
    </Card>
    );
  };

  // 渲染成本归集标签页
  const renderCostTab = () => {
    const handleAnalyze = () => {
    setAnalyzing(true);
    // 模拟 AI 分析延迟后显示结果
    setTimeout(() => {
      setAnalyzing(true); // 保持分析状态，显示审计列
    }, 1000);
  };

  // AI 审计逻辑
  const getAuditResult = (item: any, index: number) => {
    if (!analyzing) return { status: 'idle', reason: '', details: '' };

    // 模拟 AI 审计规则
    const rules = [
      // 招待费超标
      {
        condition: item.costType === '招待费' && item.amount > 1500,
        status: 'warning',
        reason: '招待费超标',
        details: `当前金额 ¥${item.amount.toLocaleString()}，超出标准 ¥1,500。\n\n建议：\n- 控制单次招待费用\n- 提前申请审批\n- 选择性价比更高的场所`,
      },
      // 返工工时偏高
      {
        condition: item.costType === '返工工时' && item.amount > 400,
        status: 'warning',
        reason: '返工工时偏高',
        details: `当前金额 ¥${item.amount.toLocaleString()}，占开发成本比例偏高。\n\n可能原因：\n- 需求理解偏差\n- 代码质量问题\n- 测试覆盖不足\n\n建议：\n- 加强代码审查\n- 完善测试用例\n- 需求评审确认`,
      },
      // AI 费用偏高
      {
        condition: item.costType === '编程大模型 API' && item.amount > 2000,
        status: 'warning',
        reason: 'AI 调用费用偏高',
        details: `当前金额 ¥${item.amount.toLocaleString()}，超出预算。\n\n优化建议：\n- 优化 prompt 模板，减少无效调用\n- 使用缓存机制降低重复调用\n- 批量处理相似任务\n- 评估是否所有任务都需要 AI 辅助`,
      },
      // 团建旅游费用
      {
        condition: item.costType === '团队旅游',
        status: 'info',
        reason: '团建旅游费用',
        details: `金额 ¥${item.amount.toLocaleString()}\n\n确认事项：\n- 是否与项目里程碑相关\n- 是否有审批记录\n- 参与人数是否合理\n\n建议：\n- 补充项目关联说明\n- 保留活动照片和签到记录`,
      },
      // 礼品费
      {
        condition: item.costType === '礼品费',
        status: 'info',
        reason: '礼品费用',
        details: `金额 ¥${item.amount.toLocaleString()}\n\n确认事项：\n- 是否有审批记录\n- 是否符合公司礼品标准\n- 是否有签收记录\n\n建议：\n- 补充审批流程\n- 记录礼品用途和对象`,
      },
      // 测试设备
      {
        condition: item.costType === '测试设备分摊',
        status: 'info',
        reason: '新购测试设备',
        details: `金额 ¥${item.amount.toLocaleString()}\n\n确认事项：\n- 是否有采购审批\n- 设备型号和数量是否合理\n- 是否需要资产登记\n\n建议：\n- 补充采购审批单\n- 登记固定资产台账\n- 明确使用人和归还时间`,
      },
    ];

    for (const rule of rules) {
      if (rule.condition) {
        return rule;
      }
    }

    // 默认通过
    return { status: 'pass', reason: '费用合理', details: `金额 ¥${item.amount.toLocaleString()} 在合理区间内。` };
  };

  // 审计结论汇总
  const getAuditSummary = () => {
    const warnings = costItems.filter((item, index) => getAuditResult(item, index).status === 'warning');
    const infos = costItems.filter((item, index) => getAuditResult(item, index).status === 'info');
    const passed = costItems.filter((item, index) => getAuditResult(item, index).status === 'pass');

    return {
      total: costItems.length,
      warnings: warnings.length,
      infos: infos.length,
      passed: passed.length,
      warningItems: warnings.map((item) => ({ item, result: getAuditResult(item, costItems.indexOf(item)) })),
      infoItems: infos.map((item) => ({ item, result: getAuditResult(item, costItems.indexOf(item)) })),
    };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>成本归集</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={analyzing}>
            {analyzing ? '分析中...' : 'AI 成本分析'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出 Excel
          </Button>
          <Button size="sm">添加成本项</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* 成本汇总 */}
          <div className="grid grid-cols-5 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">人力成本</p>
                <p className="text-xl font-bold">
                  ¥{costItems
                    .filter((item) => item.costCategory === 'labor')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">开发工时、返工工时、出差补贴</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">商务成本</p>
                <p className="text-xl font-bold">
                  ¥{costItems
                    .filter((item) => item.costCategory === 'commercial')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">差旅、招待、礼品</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">运营成本</p>
                <p className="text-xl font-bold">
                  ¥{costItems
                    .filter((item) => item.costCategory === 'operation')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">租金、社保、税金、宿舍、分摊</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto text-xs mt-1">
                      分摊模型说明
                    </Button>
                  </DialogTrigger>
                  <DialogContent style={{ width: '1000px', maxWidth: '95vw', maxHeight: '85vh' }} className="flex flex-col">
                    <DialogHeader className="flex-shrink-0">
                      <DialogTitle className="text-xl">运营成本分摊模型</DialogTitle>
                      <DialogDescription className="text-sm">
                        模型：运营成本人天分摊模型 | 版本：20260801001
                      </DialogDescription>
                    </DialogHeader>
                    <div className="overflow-y-auto flex-1 min-h-0 p-6 bg-muted rounded-lg space-y-4">
                      <div className="p-5 bg-white rounded-lg border">
                        <p className="font-medium text-base mb-3">分摊原则：按项目实际消耗人天占比分摊公司运营成本</p>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-muted-foreground mb-2 font-medium">计算公式：</p>
                            <p className="font-mono text-sm p-3 bg-gray-100 rounded">项目分摊额 = 公司月度运营成本 × 项目月数 × (项目人天 / 公司总人天)</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-2 font-medium">本项目数据：</p>
                            <div className="space-y-1.5 text-sm">
                              <p>项目人天：<strong className="text-blue-600">180人天</strong>（25+15+45+40+35+20）</p>
                              <p>公司月度运营成本：<strong className="text-blue-600">¥35,000</strong></p>
                              <p>项目周期：<strong className="text-blue-600">2个月</strong></p>
                              <p>分摊比例：<strong className="text-blue-600">30%</strong>（180/600）</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-5 pt-4 border-t">
                          <p className="font-medium mb-3 text-base">分摊明细：</p>
                          <div className="grid grid-cols-4 gap-3">
                            <div className="text-center p-4 bg-gray-50 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">办公室租金</p>
                              <p className="font-bold text-lg">¥3,600</p>
                              <p className="text-xs text-muted-foreground mt-1">¥6,000/月×2月×30%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">社保公积金</p>
                              <p className="font-bold text-lg">¥5,040</p>
                              <p className="text-xs text-muted-foreground mt-1">¥8,400/月×2月×30%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">管理费用</p>
                              <p className="font-bold text-lg">¥2,400</p>
                              <p className="text-xs text-muted-foreground mt-1">¥4,000/月×2月×30%</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg border">
                              <p className="text-muted-foreground text-sm mb-1">其他分摊</p>
                              <p className="font-bold text-lg">¥2,732</p>
                              <p className="text-xs text-muted-foreground mt-1">水电/宿舍/设备等</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">第三方成本</p>
                <p className="text-xl font-bold">
                  ¥{costItems
                    .filter((item) => item.costCategory === 'third_party')
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">云服务、域名、软件、AI 工具</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">总成本</p>
                <p className="text-xl font-bold text-red-600">
                  ¥{costItems.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI 审计分析结论框 */}
          {analyzing && (
            <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="bg-blue-600 text-white rounded-full p-1"><CheckCircle className="h-3 w-3" /></span>
                  AI 审计分析结论
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const summary = getAuditSummary();
                  return (
                    <div className="space-y-3">
                      {/* 审计概览 */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          通过：<strong>{summary.passed}</strong> 项
                        </span>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          警告：<strong>{summary.warnings}</strong> 项
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CircleDot className="h-4 w-4 text-blue-500" />
                          提示：<strong>{summary.infos}</strong> 项
                        </span>
                        <span className="text-muted-foreground ml-auto">
                          共审计 {summary.total} 项成本
                        </span>
                      </div>

                      {/* 警告项列表 */}
                      {summary.warningItems.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-yellow-700 flex items-center gap-1.5">
                            <AlertTriangle className="h-4 w-4" />
                            需要关注：
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {summary.warningItems.map(({ item, result }) => (
                              <Button
                                key={item.id}
                                variant="outline"
                                size="sm"
                                className="h-auto py-1.5 border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
                                onClick={() => {
                                  setSelectedAuditItem({ item, result });
                                  setShowAuditDialog(true);
                                }}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1.5 text-yellow-500" />
                                {item.costType} - ¥{item.amount.toLocaleString()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 提示项列表 */}
                      {summary.infoItems.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-blue-700 flex items-center gap-1.5">
                            <CircleDot className="h-4 w-4" />
                            建议确认：
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {summary.infoItems.map(({ item, result }) => (
                              <Button
                                key={item.id}
                                variant="outline"
                                size="sm"
                                className="h-auto py-1.5 border-blue-300 bg-blue-50 hover:bg-blue-100"
                                onClick={() => {
                                  setSelectedAuditItem({ item, result });
                                  setShowAuditDialog(true);
                                }}
                              >
                                <CircleDot className="h-3 w-3 mr-1.5 text-blue-500" />
                                {item.costType} - ¥{item.amount.toLocaleString()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 无问题提示 */}
                      {summary.warnings === 0 && summary.infos === 0 && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>所有成本项均在合理区间内，无需处理。</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* 成本明细 - 已发生 */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              已发生成本
              <span className="text-sm font-normal text-muted-foreground">
                （共 {costItems.filter(item => item.status === 'actual').length} 项，¥{costItems.filter(item => item.status === 'actual').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}）
              </span>
            </h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">时间范围</TableHead>
                  <TableHead className="w-[100px]">成本类别</TableHead>
                  <TableHead className="w-[120px]">成本类型</TableHead>
                  <TableHead className="w-[100px] text-right">金额&nbsp;&nbsp;&nbsp;</TableHead>
                  <TableHead className="w-[100px] pl-4">来源</TableHead>
                  <TableHead className="w-[120px]">员工</TableHead>
                  <TableHead>描述</TableHead>
                  {analyzing && <TableHead className="w-[80px] text-center">AI 审计</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {costItems.filter(item => item.status === 'actual').map((item, index) => {
                  const auditResult = getAuditResult(item, index);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="w-[140px] px-2 text-xs">
                        {new Date(item.date).toLocaleDateString()}
                        {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell className="w-[100px] px-2">
                        <Badge variant="outline">
                          {item.costCategory === 'labor' ? '人力成本' : item.costCategory === 'commercial' ? '商务成本' : item.costCategory === 'operation' ? '运营成本' : item.costCategory === 'third_party' ? '第三方成本' : '硬件成本'}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[120px] px-2 font-medium">{item.costType}</TableCell>
                      <TableCell className="w-[100px] px-2 text-right">¥{item.amount.toLocaleString()}</TableCell>
                      <TableCell className="w-[100px] px-2">
                        <Badge variant="secondary">
                          {item.sourceType === 'daily_report' ? '日报' : item.sourceType === 'reimbursement' ? '报销单' : item.sourceType === 'work_item' ? '工作项' : '手动录入'}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[120px] px-2">{item.employeeName || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate px-2">{item.description || '-'}</TableCell>
                      {analyzing && (
                        <TableCell className="text-center">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { setSelectedAuditItem({ item, result: auditResult }); setShowAuditDialog(true); }}>
                            {auditResult.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
                            {auditResult.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                            {auditResult.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
                            {auditResult.status === 'info' && <CircleDot className="h-5 w-5 text-blue-500" />}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>

          {/* 成本明细 - 未发生（预测） */}
          {costItems.filter(item => item.status === 'forecast').length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                未发生成本（预测）
                <span className="text-sm font-normal text-muted-foreground">
                  （共 {costItems.filter(item => item.status === 'forecast').length} 项，¥{costItems.filter(item => item.status === 'forecast').reduce((sum, item) => sum + item.amount, 0).toLocaleString()}）
                </span>
              </h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">预计时间</TableHead>
                    <TableHead className="w-[100px]">成本类别</TableHead>
                    <TableHead className="w-[120px]">成本类型</TableHead>
                    <TableHead className="w-[100px] text-right">预计金额&nbsp;&nbsp;&nbsp;</TableHead>
                    <TableHead className="w-[120px]">员工</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costItems.filter(item => item.status === 'forecast').map((item) => (
                    <TableRow key={item.id} className="bg-orange-50/50">
                      <TableCell className="w-[140px] px-2 text-xs">
                        {new Date(item.date).toLocaleDateString()}
                        {item.endDate && ` - ${new Date(item.endDate).toLocaleDateString()}`}
                      </TableCell>
                      <TableCell className="w-[100px] px-2">
                        <Badge variant="outline">
                          {item.costCategory === 'labor' ? '人力成本' : item.costCategory === 'commercial' ? '商务成本' : item.costCategory === 'operation' ? '运营成本' : item.costCategory === 'third_party' ? '第三方成本' : '硬件成本'}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[120px] px-2 font-medium">{item.costType}</TableCell>
                      <TableCell className="w-[100px] px-2 text-right text-orange-600">¥{item.amount.toLocaleString()}</TableCell>
                      <TableCell className="w-[120px] px-2">{item.employeeName || '-'}</TableCell>
                      <TableCell className="max-w-[200px] truncate px-2">{item.description || '-'}</TableCell>
                      <TableCell className="w-[80px] px-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">预测</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* AI 审计图例 */}
          {analyzing && (
            <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4 pt-4 border-t">
              <span className="font-medium">AI 审计图例：</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-600" /> 通过
              </span>
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> 警告（需关注）
              </span>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-red-500" /> 异常（需处理）
              </span>
              <span className="flex items-center gap-1.5">
                <CircleDot className="h-4 w-4 text-blue-500" /> 提示（可优化）
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    );
  };

  // 渲染项目决算标签页
  const renderPostMortemTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>项目决算</CardTitle>
      </CardHeader>
      <CardContent>
        {postMortem ? (
          <div className="space-y-6">
            {/* 根因分析 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">根因分析</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类别</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="text-right">影响金额</TableHead>
                    <TableHead className="text-right">置信度</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {postMortem.rootCauses.map((cause, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">
                          {cause.category === 'scope_creep'
                            ? '需求变更'
                            : cause.category === 'quality_issue'
                            ? '质量问题'
                            : cause.category === 'efficiency'
                            ? '效率问题'
                            : cause.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{cause.description}</TableCell>
                      <TableCell className="text-right">¥{cause.impact.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(cause.confidence * 100).toFixed(0)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 经验教训 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">经验教训</h3>
              <ul className="list-disc pl-5 space-y-2">
                {postMortem.lessonsLearned.map((lesson, index) => (
                  <li key={index}>{lesson}</li>
                ))}
              </ul>
            </div>

            {/* 效率指标 */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">人均产出效率</p>
                <p className="text-xl font-bold">{postMortem.unitOutputPerFte} FTE</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">复用节约额</p>
                <p className="text-xl font-bold text-green-600">
                  ¥{postMortem.reuseSaving.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">模型校准状态</p>
                <Badge variant={postMortem.calibrationApplied ? 'default' : 'outline'}>
                  {postMortem.calibrationApplied ? '已校准' : '未校准'}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">暂无项目决算数据</p>
            <Button className="mt-4">生成项目决算</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/financial-delivery/cases')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <h1 className="text-2xl font-bold">业务单详情</h1>
          {getStatusBadge(caseData.status)}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            导出
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            打印
          </Button>
          <Button size="sm" onClick={() => navigate(`/financial-delivery/cases/${id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </Button>
        </div>
      </div>

      {/* 主要内容 */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="features">工时评估 ({featureLists.length})</TabsTrigger>
          <TabsTrigger value="quotation">报价单 ({quotations.length})</TabsTrigger>
          <TabsTrigger value="costs">成本归集 ({costItems.length})</TabsTrigger>
          <TabsTrigger value="post-mortem">项目决算</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">{renderOverviewTab()}</TabsContent>
        <TabsContent value="features">{renderFeatureListTab()}</TabsContent>
        <TabsContent value="quotation">{renderQuotationTab()}</TabsContent>
        <TabsContent value="costs">{renderCostTab()}</TabsContent>
        <TabsContent value="post-mortem">{renderPostMortemTab()}</TabsContent>
      </Tabs>

      {/* AI 审计详情弹窗 */}
      <Dialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <DialogContent style={{ width: '600px', maxWidth: '90vw' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAuditItem?.result?.status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {selectedAuditItem?.result?.status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
              {selectedAuditItem?.result?.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {selectedAuditItem?.result?.status === 'info' && <CircleDot className="h-5 w-5 text-blue-500" />}
              {selectedAuditItem?.item?.costType}
            </DialogTitle>
            <DialogDescription>
              审计结果：{selectedAuditItem?.result?.reason}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* 成本信息 */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">成本类型</p>
                <p className="font-medium">{selectedAuditItem?.item?.costType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">金额</p>
                <p className="font-medium">¥{selectedAuditItem?.item?.amount?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">日期</p>
                <p className="font-medium">{selectedAuditItem?.item?.date}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">描述</p>
                <p className="font-medium text-sm">{selectedAuditItem?.item?.description || '-'}</p>
              </div>
            </div>

            {/* 审计详情 */}
            <div>
              <h4 className="text-sm font-medium mb-2">AI 审计分析</h4>
              <div className="text-sm whitespace-pre-wrap p-3 bg-background border rounded-lg leading-relaxed">
                {selectedAuditItem?.result?.details}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}