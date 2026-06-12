import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Switch,
  Tag,
  Radio,
  Select,
  Typography,
  Popconfirm,
  Message,
} from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconCopy, IconArrowRight } from '@arco-design/web-react/icon';

const { Title } = Typography;
const RadioGroup = Radio.Group;

type RejectPolicy = '驳回至上一级' | '驳回至发起人' | '流程终止';
type ApproveStrategy = '单签' | '会签';

interface ApprovalNode {
  id: string;
  name: string;
  strategy: ApproveStrategy;
  rejectPolicy: RejectPolicy;
}

interface WorkflowTemplate {
  key: string;
  id: string;
  name: string;
  description: string;
  nodeCount: number;
  nodes: ApprovalNode[];
  status: boolean;
  updatedAt: string;
}

const initialTemplates: WorkflowTemplate[] = [
  {
    key: '1',
    id: 'T001',
    name: '通用双层审批',
    description: '适用于大多数业务场景，部门负责人初审，财务复审',
    nodeCount: 2,
    nodes: [
      { id: 'n1', name: '部门审批', strategy: '单签', rejectPolicy: '驳回至发起人' },
      { id: 'n2', name: '财务审批', strategy: '单签', rejectPolicy: '驳回至上一级' },
    ],
    status: true,
    updatedAt: '2026-04-20',
  },
  {
    key: '2',
    id: 'T002',
    name: '高额费用三级审批',
    description: '用于大额报销、合同审批，需经过三级审核',
    nodeCount: 3,
    nodes: [
      { id: 'n1', name: '直属上级', strategy: '单签', rejectPolicy: '驳回至发起人' },
      { id: 'n2', name: '部门总监', strategy: '单签', rejectPolicy: '驳回至上一级' },
      { id: 'n3', name: '财务核算', strategy: '会签', rejectPolicy: '流程终止' },
    ],
    status: true,
    updatedAt: '2026-04-18',
  },
  {
    key: '3',
    id: 'T003',
    name: '快速单签审批',
    description: '单一审批节点，适合低风险业务快速流转',
    nodeCount: 1,
    nodes: [
      { id: 'n1', name: '直属经理', strategy: '单签', rejectPolicy: '驳回至发起人' },
    ],
    status: false,
    updatedAt: '2026-04-10',
  },
];

const strategyColor: Record<ApproveStrategy, string> = {
  单签: 'arcoblue',
  会签: 'purple',
};

const rejectOptions: RejectPolicy[] = ['驳回至上一级', '驳回至发起人', '流程终止'];

function FlowPreview({ nodes }: { nodes: ApprovalNode[] }) {
  return (
    <div className="flex items-center flex-wrap gap-1" style={{ margin: '4px 0' }}>
      <span style={{
        padding: '2px 10px',
        borderRadius: 12,
        background: '#e8f5e9',
        color: '#2e7d32',
        fontSize: 12,
        fontWeight: 500,
      }}>发起</span>
      {nodes.map((node) => (
        <span key={node.id} className="flex items-center gap-1">
          <IconArrowRight style={{ fontSize: 12, color: '#aaa' }} />
          <span style={{
            padding: '2px 10px',
            borderRadius: 12,
            background: '#e3f2fd',
            color: '#1565c0',
            fontSize: 12,
            fontWeight: 500,
          }}>{node.name}</span>
        </span>
      ))}
      <IconArrowRight style={{ fontSize: 12, color: '#aaa' }} />
      <span style={{
        padding: '2px 10px',
        borderRadius: 12,
        background: '#fce4ec',
        color: '#c62828',
        fontSize: 12,
        fontWeight: 500,
      }}>结束</span>
    </div>
  );
}

export function WorkflowTemplateList() {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(initialTemplates);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  const [form] = Form.useForm();
  const [nodes, setNodes] = useState<ApprovalNode[]>([]);

  const openCreate = () => {
    setEditingTemplate(null);
    setNodes([{ id: Date.now().toString(), name: '', strategy: '单签', rejectPolicy: '驳回至发起人' }]);
    form.resetFields();
    setModalVisible(true);
  };

  const openEdit = (record: WorkflowTemplate) => {
    setEditingTemplate(record);
    setNodes(record.nodes.map((n) => ({ ...n })));
    form.setFieldsValue({ name: record.name, description: record.description });
    setModalVisible(true);
  };

  const openCopy = (record: WorkflowTemplate) => {
    setEditingTemplate(null);
    const copiedNodes = record.nodes.map((n) => ({ ...n, id: Date.now().toString() + Math.random() }));
    setNodes(copiedNodes);
    form.setFieldsValue({ name: `${record.name}-副本`, description: record.description });
    setModalVisible(true);
  };

  const handleDelete = (key: string) => {
    setTemplates((prev) => prev.filter((t) => t.key !== key));
    Message.success('模板已删除');
  };

  const handleStatusChange = (key: string, val: boolean) => {
    setTemplates((prev) => prev.map((t) => t.key === key ? { ...t, status: val } : t));
  };

  const handleSave = () => {
    form.validate().then((values) => {
      if (nodes.length === 0) { Message.error('请至少添加一个审批节点'); return; }
      if (nodes.some((n) => !n.name.trim())) { Message.error('节点名称不能为空'); return; }

      if (editingTemplate) {
        setTemplates((prev) => prev.map((t) =>
          t.key === editingTemplate.key
            ? { ...t, name: values.name, description: values.description, nodes, nodeCount: nodes.length, updatedAt: '2026-05-06' }
            : t
        ));
        Message.success('模板已更新');
      } else {
        const newId = `T00${templates.length + 1}`;
        setTemplates((prev) => [...prev, {
          key: Date.now().toString(),
          id: newId,
          name: values.name,
          description: values.description || '',
          nodes,
          nodeCount: nodes.length,
          status: true,
          updatedAt: '2026-05-06',
        }]);
        Message.success('模板已创建');
      }
      setModalVisible(false);
    });
  };

  const addNode = () => {
    setNodes((prev) => [...prev, { id: Date.now().toString(), name: '', strategy: '单签', rejectPolicy: '驳回至发起人' }]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const updateNode = (id: string, field: keyof ApprovalNode, value: string) => {
    setNodes((prev) => prev.map((n) => n.id === id ? { ...n, [field]: value } : n));
  };

  const columns = [
    { title: '模板ID', dataIndex: 'id', width: 80 },
    {
      title: '模板名称',
      dataIndex: 'name',
      width: 180,
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    { title: '描述', dataIndex: 'description' },
    {
      title: '审批流',
      dataIndex: 'nodes',
      width: 380,
      render: (_: any, record: WorkflowTemplate) => <FlowPreview nodes={record.nodes} />,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 80,
      render: (val: boolean, record: WorkflowTemplate) => (
        <Switch checked={val} size="small" onChange={(v) => handleStatusChange(record.key, v)} />
      ),
    },
    { title: '最后修改', dataIndex: 'updatedAt', width: 110 },
    {
      title: '操作',
      width: 140,
      fixed: 'right' as const,
      render: (_: any, record: WorkflowTemplate) => (
        <Space>
          <Button type="text" size="small" icon={<IconEdit />} onClick={() => openEdit(record)}>编辑</Button>
          <Button type="text" size="small" icon={<IconCopy />} onClick={() => openCopy(record)}>复制</Button>
          <Popconfirm title="确认删除该模板？" onOk={() => handleDelete(record.key)}>
            <Button type="text" size="small" icon={<IconDelete />} status="danger" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>审批模板管理</Title>
        <Button type="primary" icon={<IconPlus />} onClick={openCreate}>新建模板</Button>
      </div>

      <Card>
        <Table columns={columns} data={templates} pagination={false} scroll={{ x: 1000 }} />
      </Card>

      <Modal
        title={editingTemplate ? '编辑审批模板' : '新建审批模板'}
        visible={modalVisible}
        maskClosable={false}
        style={{ width: 680 }}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="保存模板"
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item label="模板名称" field="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="如：通用双层审批" />
          </Form.Item>
          <Form.Item label="模板描述" field="description">
            <Input.TextArea placeholder="适用场景说明" rows={2} />
          </Form.Item>
        </Form>

        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 500, marginBottom: 12, color: 'var(--color-text-1)' }}>审批节点配置</div>

          {/* Start node */}
          <div className="flex items-center gap-3" style={{ marginBottom: 8 }}>
            <div style={{
              padding: '6px 16px',
              borderRadius: 20,
              background: '#e8f5e9',
              color: '#2e7d32',
              fontSize: 13,
              fontWeight: 500,
              minWidth: 80,
              textAlign: 'center',
            }}>发起节点</div>
            <span style={{ color: '#aaa', fontSize: 12 }}>自动生成，不可删除</span>
          </div>

          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-start gap-2" style={{ marginBottom: 8 }}>
              <div style={{ color: '#aaa', fontSize: 12, paddingTop: 8, minWidth: 16 }}>↓</div>
              <div style={{
                flex: 1,
                border: '1px solid var(--color-border-2)',
                borderRadius: 6,
                padding: '10px 12px',
                background: 'var(--color-fill-1)',
              }}>
                <div className="flex items-center gap-3 flex-wrap">
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4, width: '100%' }}>
                    审批节点 {index + 1}
                  </div>
                  <Input
                    placeholder="节点名称（如：部门审批）"
                    value={node.name}
                    onChange={(v) => updateNode(node.id, 'name', v)}
                    style={{ width: 180 }}
                  />
                  <RadioGroup
                    value={node.strategy}
                    onChange={(v) => updateNode(node.id, 'strategy', v)}
                  >
                    <Radio value="单签">单签</Radio>
                    <Radio value="会签">会签</Radio>
                  </RadioGroup>
                  <Select
                    value={node.rejectPolicy}
                    onChange={(v) => updateNode(node.id, 'rejectPolicy', v)}
                    style={{ width: 150 }}
                  >
                    {rejectOptions.map((o) => (
                      <Select.Option key={o} value={o}>{o}</Select.Option>
                    ))}
                  </Select>
                  <Button
                    type="text"
                    size="small"
                    icon={<IconDelete />}
                    status="danger"
                    disabled={nodes.length === 1}
                    onClick={() => removeNode(node.id)}
                  />
                </div>
              </div>
            </div>
          ))}

          <div style={{ color: '#aaa', fontSize: 12, marginBottom: 8 }}>↓</div>

          {/* End node */}
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
            <div style={{
              padding: '6px 16px',
              borderRadius: 20,
              background: '#fce4ec',
              color: '#c62828',
              fontSize: 13,
              fontWeight: 500,
              minWidth: 80,
              textAlign: 'center',
            }}>结束节点</div>
            <span style={{ color: '#aaa', fontSize: 12 }}>自动生成，不可删除</span>
          </div>

          <Button type="dashed" icon={<IconPlus />} onClick={addNode} style={{ width: '100%' }}>
            添加审批节点
          </Button>
        </div>
      </Modal>
    </div>
  );
}
