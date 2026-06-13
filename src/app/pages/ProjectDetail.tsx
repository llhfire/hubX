import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  Alert,
  Badge,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Form,
  Grid,
  Input,
  InputNumber,
  Message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Timeline,
  Tooltip,
  Typography,
} from '@arco-design/web-react';
import { IconDelete, IconEdit, IconFile, IconLeft, IconLink, IconPlus, IconSend } from '@arco-design/web-react/icon';
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

const { Title, Text } = Typography;
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const SUMMARY_TAG_COLOR_MAP: Record<
  SummaryRiskLevel,
  'green' | 'arcoblue' | 'orange' | 'red'
> = {
  正常: 'green',
  注意: 'arcoblue',
  预警: 'orange',
  严重: 'red',
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
}: {
  card: ProjectSummaryCard;
  href?: string;
}) {
  const content = (
    <Card bodyStyle={{ padding: 16 }} style={{ height: '100%' }}>
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <div className="flex items-center justify-between gap-3">
          <Text type="secondary">{card.title}</Text>
          <Tag color={SUMMARY_TAG_COLOR_MAP[card.level]}>{card.level}</Tag>
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            lineHeight: '30px',
            color: 'var(--color-text-1)',
          }}
        >
          {card.value}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            lineHeight: '22px',
            color: 'var(--color-text-1)',
          }}
        >
          {card.alert}
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {card.detail}
        </Text>
      </Space>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link
      to={href}
      style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
    >
      {content}
    </Link>
  );
}

function statusBadge(status: ProjectStatus) {
  const map: Record<ProjectStatus, 'default' | 'processing' | 'success' | 'warning' | 'error'> = {
    未开始: 'default',
    进行中: 'processing',
    已完成: 'success',
    验收中: 'processing',
    搁置: 'warning',
    延迟: 'error',
    催款中: 'warning',
  };
  return <Badge status={map[status]} text={status} />;
}

export function ProjectDetail() {
  const { id = '1' } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(initialProjects.find((item) => item.id === id) ?? initialProjects[0]);
  const [leadRelations, setLeadRelations] = useState<ProjectLeadRelation[]>(initialLeadRelations);
  const [followUps, setFollowUps] = useState<ProjectFollowUp[]>(initialFollowUps);
  const [documents, setDocuments] = useState<ProjectDocument[]>(initialDocuments);
  const [leadModalVisible, setLeadModalVisible] = useState(false);
  const [followModalVisible, setFollowModalVisible] = useState(false);
  const [documentModalVisible, setDocumentModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<ProjectDocument | null>(null);
  const [leadKeyword, setLeadKeyword] = useState('');
  const [leadForm] = Form.useForm();
  const [followForm] = Form.useForm();
  const [documentForm] = Form.useForm();
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | undefined>(project.contractId);
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
  const summaryCards = useMemo(
    () =>
      buildProjectSummaryCards({
        project,
        allProjects: initialProjects,
        deliveryPlan,
        memberHours,
        totalHours,
        today,
      }),
    [deliveryPlan, memberHours, project, today, totalHours],
  );

  const filteredAvailableLeads = useMemo(() => {
    const linkedLeadNos = new Set(projectLeads.map((lead) => lead.leadNo));
    return availableLeads.filter((lead) => {
      const keywordMatched = !leadKeyword || lead.leadName.includes(leadKeyword) || lead.leadNo.includes(leadKeyword);
      return keywordMatched && !linkedLeadNos.has(lead.leadNo);
    });
  }, [leadKeyword, projectLeads]);

  const openFollowModal = () => {
    followForm.setFieldsValue({ status: project.status, progress: project.progress });
    setFollowModalVisible(true);
  };

  const saveFollow = () => {
    followForm.validate().then((values) => {
      const attachmentName = values.attachmentName?.trim();
      const nextFollow: ProjectFollowUp = {
        id: `follow-${Date.now()}`,
        projectId: project.id,
        status: values.status,
        progress: values.progress,
        content: values.content,
        attachments: attachmentName ? [{ id: `follow-att-${Date.now()}`, name: attachmentName, size: '模拟文件' }] : [],
        operator: project.owner,
        createdAt: '2026-05-09 11:00',
      };
      setFollowUps([nextFollow, ...followUps]);
      setProject({ ...project, status: values.status, progress: values.progress, latestProgress: summarizeProgress(values.content) });
      setFollowModalVisible(false);
      followForm.resetFields();
      Message.success('跟进记录已新增');
    });
  };

  const saveLeadRelation = () => {
    leadForm.validate().then((values) => {
      const selectedLead = availableLeads.find((lead) => lead.leadNo === values.leadNo);
      if (!selectedLead) return;
      setLeadRelations([
        { ...selectedLead, id: `relation-${Date.now()}`, projectId: project.id },
        ...leadRelations,
      ]);
      setLeadModalVisible(false);
      leadForm.resetFields();
      setLeadKeyword('');
      Message.success('线索已关联到项目');
    });
  };

  const removeLeadRelation = (relationId: string) => {
    setLeadRelations(leadRelations.filter((relation) => relation.id !== relationId));
    Message.success('已解除线索关联');
  };

  const openCreateDocument = () => {
    setEditingDocument(null);
    documentForm.resetFields();
    setDocumentModalVisible(true);
  };

  const openEditDocument = (document: ProjectDocument) => {
    setEditingDocument(document);
    documentForm.setFieldsValue(document as any);
    setDocumentModalVisible(true);
  };

  const saveDocument = () => {
    documentForm.validate().then((values) => {
      const onlineUrl = values.onlineUrl?.trim() ?? '';
      const uploadedFileName = values.uploadedFileName?.trim() ?? '';
      if (!onlineUrl && !uploadedFileName) {
        Message.error('线上地址和上传文档至少填写一个');
        return;
      }

      const nextDocument: ProjectDocument = {
        id: editingDocument?.id ?? `doc-${Date.now()}`,
        projectId: project.id,
        title: values.title,
        onlineUrl,
        owner: values.owner,
        uploadedFileName,
        description: values.description || '',
        createdAt: editingDocument?.createdAt ?? '2026-05-09 11:30',
      };

      setDocuments((current) => {
        if (editingDocument) {
          return current.map((item) => (item.id === editingDocument.id ? nextDocument : item));
        }
        return [nextDocument, ...current];
      });
      setDocumentModalVisible(false);
      documentForm.resetFields();
      Message.success(editingDocument ? '项目文档已更新' : '项目文档已新增');
    });
  };

  const removeDocument = (documentId: string) => {
    setDocuments(documents.filter((document) => document.id !== documentId));
    Message.success('项目文档已删除');
  };

  const memberHourColumns = [
    { title: '编号', width: 80, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '人员名称', dataIndex: 'personName' },
    { title: '职位', dataIndex: 'position' },
    { title: '已用工时', dataIndex: 'hours', render: (hours: number) => `${hours}H` },
  ];

  const dailyColumns = [
    { title: '日期', dataIndex: 'date', width: 120 },
    { title: '项目名称', dataIndex: 'projectName', width: 180 },
    { title: '人员', dataIndex: 'personName', width: 100 },
    { title: '耗时', dataIndex: 'hours', width: 90, render: (hours: number) => `${hours}H` },
    { title: '工作内容', dataIndex: 'workContent', width: 260 },
    { title: '风险/异常反馈', dataIndex: 'riskFeedback', width: 220 },
  ];

  const leadColumns = [
    { title: '编号', dataIndex: 'leadNo', width: 140 },
    { title: '线索名称', dataIndex: 'leadName', width: 220 },
    { title: '归属人', dataIndex: 'owner', width: 100 },
    { title: '售前群名称', dataIndex: 'preSaleGroupName', width: 160 },
    { title: '客户分类', dataIndex: 'customerCategory', width: 120 },
    { title: '线索来源', dataIndex: 'source', width: 120 },
    { title: '客户称呼', dataIndex: 'customerName', width: 100 },
    { title: '联系电话', dataIndex: 'phone', width: 130 },
    { title: '微信', dataIndex: 'wechat', width: 140 },
    { title: '线索添加时间', dataIndex: 'leadCreatedAt', width: 160 },
    {
      title: '操作',
      width: 100,
      fixed: 'right' as const,
      render: (_: unknown, record: ProjectLeadRelation) => (
        <Popconfirm title="确认解除该线索关联吗？" onOk={() => removeLeadRelation(record.id)}>
          <Button type="text" size="small" status="danger">删除关联</Button>
        </Popconfirm>
      ),
    },
  ];

  const documentColumns = [
    { title: '编号', width: 70, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '标题', dataIndex: 'title', width: 150 },
    { title: '线上地址', dataIndex: 'onlineUrl', width: 180, render: (value: string) => value || '-' },
    { title: '负责人', dataIndex: 'owner', width: 90 },
    { title: '文档下载', dataIndex: 'uploadedFileName', width: 130, render: (value: string) => value || '-' },
    { title: '文档说明', dataIndex: 'description', width: 180 },
    { title: '添加日期', dataIndex: 'createdAt', width: 140 },
    {
      title: '操作',
      width: 120,
      render: (_: unknown, record: ProjectDocument) => (
        <Space size="mini">
          <Button type="text" size="mini" icon={<IconEdit />} onClick={() => openEditDocument(record)}>编辑</Button>
          <Popconfirm title="确认删除该文档吗？" onOk={() => removeDocument(record.id)}>
            <Button type="text" size="mini" status="danger" icon={<IconDelete />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="text" icon={<IconLeft />} onClick={() => navigate('/projects')}>返回</Button>
          <Title heading={4} style={{ margin: 0 }}>{project.name}</Title>
          {statusBadge(project.status)}
        </Space>
        <Button type="primary" icon={<IconSend />} onClick={openFollowModal}>新增跟进</Button>
      </div>

      <Grid.Row gutter={16} style={{ marginBottom: 16 }}>
        {summaryCards.map((card) => (
          <Grid.Col span={6} key={card.key}>
            <SummaryHighlightCard
              card={card}
              href={
                card.key === 'delivery'
                  ? `/projects/${project.id}/delivery`
                  : undefined
              }
            />
          </Grid.Col>
        ))}
      </Grid.Row>

      <Alert type="info" style={{ marginBottom: 16 }} content="成本核算将在后续阶段接入人工成本设置、项目报销、投放日消耗、回款和利润分析；当前阶段先沉淀项目工时入口。" />

      <Grid.Row gutter={16} align="start">
        <Grid.Col span={16}>
          <Card>
            <Tabs defaultActiveTab="basic">
              <TabPane key="basic" title="基础信息">
                <Descriptions
                  column={2}
                  data={[
                    { label: '编号', value: project.projectNo },
                    { label: '项目名称', value: project.name },
                    { label: '总进度', value: `${project.progress}%` },
                    { label: '对接主体', value: project.entity || '-' },
                    { label: '优先级', value: project.priority },
                    { label: '状态', value: project.status },
                    { label: '业务线', value: project.businessLine },
                    { label: '最新进展', value: project.latestProgress },
                    { label: '添加时间', value: project.createdAt },
                    { label: '负责人', value: project.owner },
                    { label: '销售人员', value: project.salesUsers.join('、') || '-' },
                    { label: '协助人', value: project.assistants.join('、') || '-' },
                    { label: '产品', value: project.productUsers.join('、') || '-' },
                    { label: 'UI', value: project.uiUsers.join('、') || '-' },
                    { label: '前端', value: project.frontendUsers.join('、') || '-' },
                    { label: '后端', value: project.backendUsers.join('、') || '-' },
                    { label: '运维', value: project.opsUsers.join('、') || '-' },
                    { label: '测试', value: project.testUsers.join('、') || '-' },
                    { label: '法务', value: project.legalUsers.join('、') || '-' },
                    { label: '开始日期', value: project.startDate || '-' },
                    { label: '预计结束日期', value: project.expectedEndDate || '-' },
                    { label: '备注', value: project.remark || '-' },
                  ]}
                />
                <Divider orientation="left">合同关联</Divider>
                <Space>
                  <Text type="secondary">关联合同：</Text>
                  {project.contractId ? (
                    <>
                      <Tag color="blue">{project.contractId}</Tag>
                      <Tooltip content={hasPlan ? '请先删除交付计划' : ''}>
                        <Button type="text" size="small" disabled={hasPlan} onClick={() => { setSelectedContractId(project.contractId); setContractModalVisible(true); }}>更换</Button>
                      </Tooltip>
                      <Popconfirm title="确认解除合同关联吗？" onOk={() => setProject({...project, contractId: undefined})}>
                        <Button type="text" size="small" status="danger" disabled={hasPlan}>解除</Button>
                      </Popconfirm>
                    </>
                  ) : (
                    <>
                      <Text type="secondary">未关联</Text>
                      <Button type="text" size="small" onClick={() => { setSelectedContractId(undefined); setContractModalVisible(true); }}>选择合同</Button>
                    </>
                  )}
                </Space>
                <Divider orientation="left">附件列表</Divider>
                {project.attachments.length ? (
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {project.attachments.map((file) => <Tag key={file.id} icon={<IconFile />}>{file.name} · {file.size}</Tag>)}
                  </Space>
                ) : <Empty description="暂无附件" />}
              </TabPane>

              <TabPane key="leads" title={`关联线索 (${projectLeads.length})`}>
                <div className="flex justify-end" style={{ marginBottom: 12 }}>
                  <Button type="primary" icon={<IconLink />} onClick={() => setLeadModalVisible(true)}>关联线索</Button>
                </div>
                <Table columns={leadColumns} data={projectLeads} rowKey="id" scroll={{ x: 1600 }} pagination={false} />
              </TabPane>

              <TabPane key="customers" title="关联客户">
                <Empty description="关联客户将在后续客户模块联动阶段实现" />
              </TabPane>

              <TabPane key="daily" title={`关联日报 (${projectDailyReports.length})`}>
                <Title heading={6}>总工时列表</Title>
                <Table
                  columns={memberHourColumns}
                  data={memberHours}
                  rowKey="key"
                  pagination={false}
                  summary={() => (
                    <Table.Summary.Row>
                      <Table.Summary.Cell colSpan={3}>总计</Table.Summary.Cell>
                      <Table.Summary.Cell>{totalHours}H</Table.Summary.Cell>
                    </Table.Summary.Row>
                  )}
                />
                <Title heading={6} style={{ marginTop: 24 }}>日报列表</Title>
                <Table columns={dailyColumns} data={projectDailyReports} rowKey="id" scroll={{ x: 1000 }} pagination={false} />
              </TabPane>

              <TabPane key="documents" title={`项目文档 (${projectDocuments.length})`}>
                <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                  <Text type="secondary">管理项目文档、线上地址和上传附件。</Text>
                  <Button type="primary" icon={<IconPlus />} onClick={openCreateDocument}>添加文档</Button>
                </div>
                <Table columns={documentColumns} data={projectDocuments} rowKey="id" scroll={{ x: 960 }} pagination={false} />
              </TabPane>
            </Tabs>
          </Card>
        </Grid.Col>

        <Grid.Col span={8}>
          <Card title="跟进记录" extra={<Button type="text" icon={<IconPlus />} onClick={openFollowModal}>新增</Button>}>
            <Timeline>
              {projectFollowUps.map((follow) => (
                <Timeline.Item key={follow.id} label={follow.createdAt}>
                  <Space size="mini" style={{ marginBottom: 6 }}>{statusBadge(follow.status)}<Tag>{follow.progress}%</Tag><Text type="secondary">{follow.operator}</Text></Space>
                  <div>{follow.content}</div>
                  {follow.attachments.map((file) => <Tag key={file.id} icon={<IconFile />} style={{ marginTop: 6 }}>{file.name}</Tag>)}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        </Grid.Col>
      </Grid.Row>

      <Modal title="添加跟进" visible={followModalVisible} onOk={saveFollow} onCancel={() => setFollowModalVisible(false)} style={{ width: 620 }} maskClosable={false}>
        <Form form={followForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}><FormItem label="状态" field="status" rules={[{ required: true, message: '请选择状态' }]}><Select>{projectStatuses.map((item) => <Select.Option key={item} value={item}>{item}</Select.Option>)}</Select></FormItem></Grid.Col>
            <Grid.Col span={12}><FormItem label="总进度" field="progress" rules={[{ required: true, message: '请输入总进度' }]}><InputNumber min={0} max={100} precision={0} suffix="%" style={{ width: '100%' }} /></FormItem></Grid.Col>
          </Grid.Row>
          <FormItem label="跟进详情" field="content" rules={[{ required: true, message: '请输入跟进详情' }]}><Input.TextArea rows={4} /></FormItem>
          <FormItem label="附件上传" field="attachmentName"><Input placeholder="第一版模拟上传，填写附件名称" /></FormItem>
        </Form>
      </Modal>

      <Modal title="关联线索" visible={leadModalVisible} onOk={saveLeadRelation} onCancel={() => setLeadModalVisible(false)} style={{ width: 680 }} maskClosable={false}>
        <Form form={leadForm} layout="vertical">
          <Input.Search placeholder="输入标题或编号搜索线索" value={leadKeyword} onChange={setLeadKeyword} style={{ marginBottom: 16 }} />
          <FormItem label="选择线索" field="leadNo" rules={[{ required: true, message: '请选择线索' }]}>
            <Select placeholder="请选择线索">
              {filteredAvailableLeads.map((lead) => <Select.Option key={lead.leadNo} value={lead.leadNo}>{lead.leadNo} - {lead.leadName}</Select.Option>)}
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <Modal title={editingDocument ? '编辑文档' : '添加文档'} visible={documentModalVisible} onOk={saveDocument} onCancel={() => setDocumentModalVisible(false)} style={{ width: 620 }} maskClosable={false}>
        <Form form={documentForm} layout="vertical">
          <FormItem label="标题" field="title" rules={[{ required: true, message: '请输入标题' }]}><Input /></FormItem>
          <FormItem label="线上地址" field="onlineUrl"><Input placeholder="请输入线上文档地址" /></FormItem>
          <FormItem label="负责人" field="owner" rules={[{ required: true, message: '请选择负责人' }]}><Select>{[project.owner, ...project.assistants, ...project.productUsers, ...project.uiUsers, ...project.frontendUsers, ...project.backendUsers].filter(Boolean).map((user) => <Select.Option key={user} value={user}>{user}</Select.Option>)}</Select></FormItem>
          <FormItem label="上传文档" field="uploadedFileName"><Input placeholder="第一版模拟上传，填写文件名" /></FormItem>
          <FormItem label="文档说明" field="description"><Input.TextArea rows={3} /></FormItem>
        </Form>
      </Modal>

      <Modal title="关联合同" visible={contractModalVisible} onOk={() => { if (selectedContractId) { setProject({...project, contractId: selectedContractId}); } setContractModalVisible(false); }} onCancel={() => setContractModalVisible(false)} style={{ width: 480 }}>
        <Form layout="vertical">
          <FormItem label="选择合同">
            <Select placeholder="请选择合同" options={contractOptions} value={selectedContractId} onChange={setSelectedContractId} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
