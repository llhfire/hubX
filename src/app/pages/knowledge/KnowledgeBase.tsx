import { useState, useMemo } from 'react';
import {
  Card,
  Grid,
  Statistic,
  Table,
  Button,
  Space,
  Tag,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  TextArea,
  Typography,
  Rate,
  Avatar,
  Divider,
  Popconfirm,
  Empty,
  Input as SearchInput,
  Descriptions,
  Badge,
} from '@arco-design/web-react';
import {
  IconFile,
  IconPlus,
  IconEdit,
  IconDelete,
  IconSearch,
  IconEye,
  IconCalendar,
  IconUser,
  IconApps,
  IconStar,
  IconFolder,
  IconDesktop,
} from '@arco-design/web-react/icon';

const Row = Grid.Row;
const Col = Grid.Col;
const TabPane = Tabs.TabPane;
const Title = Typography.Title;
const FormItem = Form.Item;
const SelectOption = Select.Option;

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
  tech:     { label: '技术方案', icon: <IconDesktop size={14} />,  color: 'var(--primary)' },
  sop:      { label: 'SOP 流程', icon: <IconFile size={14} />,      color: 'var(--success-500)' },
  template: { label: '模板',     icon: <IconFile size={14} />,      color: 'var(--chart-5)' },
  review:   { label: '项目复盘', icon: <IconSearch size={14} />,   color: 'var(--warning-500)' },
  other:    { label: '其他',     icon: <IconFolder size={14} />,    color: 'var(--muted-foreground)' },
};

const PERMISSION_LABELS: Record<Permission, { label: string; color: string }> = {
  public:     { label: '公开', color: 'var(--success-500)' },
  department: { label: '部门', color: 'var(--primary)' },
  project:    { label: '项目', color: 'var(--warning-500)' },
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
  const [form] = Form.useForm();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterCategory, setFilterCategory] = useState<DocCategory | ''>('');
  const [filterTag, setFilterTag] = useState('');

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(d => d.tags.forEach(t => tagSet.add(t)));
    return Array.from(tagSet);
  }, [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter(d => {
      if (searchKeyword && !d.title.includes(searchKeyword) && !d.content.includes(searchKeyword)) return false;
      if (filterCategory && d.category !== filterCategory) return false;
      if (filterTag && !d.tags.includes(filterTag)) return false;
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
    form.resetFields();
    form.setFieldsValue({ category: 'tech', permission: 'public', tags: [] });
    setModalVisible(true);
  };

  const handleEdit = (doc: Document) => {
    setEditingDoc(doc);
    form.setFieldsValue(doc);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  const handleSubmit = () => {
    form.validate().then(values => {
      if (editingDoc) {
        setDocuments(prev => prev.map(d => d.id === editingDoc.id ? { ...d, ...values, updatedAt: '2026-07-02' } : d));
      } else {
        const newDoc: Document = {
          id: `doc-${Date.now()}`,
          ...values,
          author: '当前用户',
          department: '技术部',
          createdAt: '2026-07-02',
          updatedAt: '2026-07-02',
          views: 0,
        };
        setDocuments(prev => [newDoc, ...prev]);
      }
      setModalVisible(false);
    });
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* 摘要栏 */}
      <Row gutter={16}>
        <Col span={4}><Card><Statistic title="文档总数" value={summary.total} suffix="篇" icon={<IconFile style={{ color: 'var(--primary)' }} />} /></Card></Col>
        <Col span={4}><Card><Statistic title="技术方案" value={summary.tech} suffix="篇" icon={<IconApps style={{ color: 'var(--primary)' }} />} /></Card></Col>
        <Col span={4}><Card><Statistic title="SOP 流程" value={summary.sop} suffix="篇" icon={<IconStar style={{ color: 'var(--success-500)' }} />} /></Card></Col>
        <Col span={4}><Card><Statistic title="模板" value={summary.templates} suffix="个" icon={<IconFolder style={{ color: 'var(--chart-5)' }} />} /></Card></Col>
        <Col span={4}><Card><Statistic title="项目复盘" value={summary.reviews} suffix="篇" icon={<IconEye style={{ color: 'var(--warning-500)' }} />} /></Card></Col>
        <Col span={4}><Card><Statistic title="总阅读量" value={summary.totalViews} suffix="次" icon={<IconEye style={{ color: 'var(--info-500)' }} />} /></Card></Col>
      </Row>

      {/* 主体 Tab */}
      <Card bordered={false}>
        <Tabs activeTab={activeTab} onChange={setActiveTab}>
          <TabPane key="all" title={<span><IconFile /> 全部文档</span>} />
          <TabPane key="tech" title={<span><IconDesktop size={14} /> 技术方案</span>} />
          <TabPane key="sop" title={<span><IconFile size={14} /> SOP 流程</span>} />
          <TabPane key="template" title={<span><IconFile size={14} /> 模板库</span>} />
          <TabPane key="review" title={<span><IconSearch size={14} /> 项目复盘</span>} />
        </Tabs>

        <div style={{ paddingTop: 16 }}>
          {/* 全部文档 Tab */}
          {(activeTab === 'all' || activeTab === 'tech' || activeTab === 'sop' || activeTab === 'review') && (
            <div>
              {/* 筛选 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16, alignItems: 'center' }}>
                <SearchInput
                  style={{ width: 240 }}
                  placeholder="搜索文档标题或内容"
                  prefix={<IconSearch />}
                  allowClear
                  value={searchKeyword}
                  onChange={setSearchKeyword}
                />
                {activeTab === 'all' && (
                  <Select style={{ width: 130 }} placeholder="全部分类" allowClear value={filterCategory} onChange={v => setFilterCategory(v as DocCategory | '')}>
                    {Object.entries(CATEGORY_LABELS).map(([k, m]) => <SelectOption key={k} value={k}>{m.icon} {m.label}</SelectOption>)}
                  </Select>
                )}
                <Select style={{ width: 130 }} placeholder="全部标签" allowClear value={filterTag} onChange={setFilterTag}>
                  {allTags.map(t => <SelectOption key={t} value={t}>{t}</SelectOption>)}
                </Select>
                <div style={{ marginLeft: 'auto' }}>
                  <Button type="primary" icon={<IconPlus />} onClick={handleAdd}>新建文档</Button>
                </div>
              </div>

              {/* 文档表格 */}
              <Table
                columns={[
                  {
                    title: '标题', dataIndex: 'title', width: 200,
                    render: (_: unknown, row: Document) => (
                      <Button type="text" style={{ fontWeight: 600, padding: 0 }} onClick={() => setDetailDoc(row)}>
                        {row.title}
                      </Button>
                    ),
                  },
                  {
                    title: '分类', dataIndex: 'category', width: 90,
                    render: (c: DocCategory) => <Tag color={CATEGORY_LABELS[c].color} style={{ color: '#fff' }}>{CATEGORY_LABELS[c].label}</Tag>,
                  },
                  {
                    title: '标签', dataIndex: 'tags', width: 200,
                    render: (tags: string[]) => (
                      <Space size={4} wrap>
                        {tags.map(t => <Tag key={t} size="small">{t}</Tag>)}
                      </Space>
                    ),
                  },
                  { title: '作者', dataIndex: 'author', width: 70 },
                  { title: '部门', dataIndex: 'department', width: 70 },
                  {
                    title: '权限', dataIndex: 'permission', width: 70,
                    render: (p: Permission) => <Tag color={PERMISSION_LABELS[p].color} style={{ color: '#fff' }}>{PERMISSION_LABELS[p].label}</Tag>,
                  },
                  { title: '阅读', dataIndex: 'views', width: 60, render: (v: number) => `${v}次` },
                  { title: '更新时间', dataIndex: 'updatedAt', width: 100 },
                  {
                    title: '操作', width: 100,
                    render: (_: unknown, row: Document) => (
                      <Space>
                        <Button type="text" size="small" icon={<IconEdit />} onClick={() => handleEdit(row)}>编辑</Button>
                        <Popconfirm title="确定删除?" onOk={() => handleDelete(row.id)}>
                          <Button type="text" size="small" status="danger" icon={<IconDelete />}>删除</Button>
                        </Popconfirm>
                      </Space>
                    ),
                  },
                ] as any}
                data={activeTab === 'all' ? filteredDocs : filteredDocs.filter(d => d.category === activeTab)}
                rowKey="id"
                pagination={{ pageSize: 10, showTotal: true }}
              />
            </div>
          )}

          {/* 模板库 Tab */}
          {activeTab === 'template' && (
            <Row gutter={16}>
              {mockTemplates.map(tpl => (
                <Col span={6} key={tpl.id} style={{ marginBottom: 16 }}>
                  <Card size="small" style={{ borderRadius: 8 }} extra={<Tag color="purple" style={{ color: '#fff' }}>模板</Tag>}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}><IconFile size={14} style={{ marginRight: 4 }} /> {tpl.name}</div>
                    <Typography.Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>{tpl.description}</Typography.Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tag size="small">{tpl.category}</Tag>
                      <Typography.Text type="secondary" style={{ fontSize: 11 }}>使用 {tpl.usageCount} 次</Typography.Text>
                    </div>
                    <Button type="primary" size="small" long style={{ marginTop: 12 }}>使用模板</Button>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Card>

      {/* 新建/编辑弹窗 */}
      <Modal
        title={editingDoc ? '编辑文档' : '新建文档'}
        visible={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: 560 }}
      >
        <Form form={form} layout="vertical">
          <FormItem label="标题" field="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="文档标题" />
          </FormItem>
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="分类" field="category" rules={[{ required: true }]}>
                <Select placeholder="选择分类">
                  {Object.entries(CATEGORY_LABELS).map(([k, m]) => <SelectOption key={k} value={k}>{m.icon} {m.label}</SelectOption>)}
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="可见性" field="permission" rules={[{ required: true }]}>
                <Select placeholder="选择可见性">
                  {Object.entries(PERMISSION_LABELS).map(([k, m]) => <SelectOption key={k} value={k}>{m.label}</SelectOption>)}
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>
          <FormItem label="标签" field="tags">
            <Select mode="tags" placeholder="输入标签后回车" />
          </FormItem>
          <FormItem label="内容" field="content">
            <Input.TextArea placeholder="文档内容（支持 Markdown）" autoSize={{ minRows: 4, maxRows: 10 }} />
          </FormItem>
        </Form>
      </Modal>

      {/* 文档详情弹窗 */}
      <Modal
        title={detailDoc?.title || ''}
        visible={!!detailDoc}
        onCancel={() => setDetailDoc(null)}
        footer={null}
        style={{ width: 640 }}
      >
        {detailDoc && (
          <div>
            <Space style={{ marginBottom: 12 }}>
              <Tag color={CATEGORY_LABELS[detailDoc.category].color} style={{ color: '#fff' }}>{CATEGORY_LABELS[detailDoc.category].label}</Tag>
              <Tag color={PERMISSION_LABELS[detailDoc.permission].color} style={{ color: '#fff' }}>{PERMISSION_LABELS[detailDoc.permission].label}</Tag>
              {detailDoc.tags.map(t => <Tag key={t}>{t}</Tag>)}
            </Space>
            <Descriptions
              column={2}
              labelStyle={{ color: 'var(--color-text-2)' }}
              data={[
                { label: '作者', value: detailDoc.author },
                { label: '部门', value: detailDoc.department },
                { label: '创建时间', value: detailDoc.createdAt },
                { label: '更新时间', value: detailDoc.updatedAt },
                { label: '阅读量', value: `${detailDoc.views} 次` },
              ]}
            />
            <Divider style={{ margin: '12px 0' }} />
            <Typography.Paragraph>{detailDoc.content}</Typography.Paragraph>
          </div>
        )}
      </Modal>
    </Space>
  );
}
