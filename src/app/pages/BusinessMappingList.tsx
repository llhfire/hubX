import { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  Space,
  Modal,
  Tag,
  Typography,
  Descriptions,
  Message,
  Checkbox,
  Badge,
} from '@arco-design/web-react';
import { IconEdit, IconEye } from '@arco-design/web-react/icon';

const { Title } = Typography;

type AssigneeType = '具体人员' | '部门角色' | '指定主管' | '上一节点负责人';

interface NodeAssignment {
  nodeId: string;
  nodeName: string;
  strategy: '单签' | '会签';
  assigneeType: AssigneeType;
  assigneeValue: string;
  skipIfEmpty: boolean;
}

interface BusinessMapping {
  key: string;
  bizCode: string;
  bizName: string;
  templateId: string | null;
  templateName: string | null;
  assignments: NodeAssignment[];
  updatedAt: string;
}

const templates = [
  {
    id: 'T001',
    name: '通用双层审批',
    nodes: [
      { id: 'n1', name: '部门审批', strategy: '单签' as const },
      { id: 'n2', name: '财务审批', strategy: '单签' as const },
    ],
  },
  {
    id: 'T002',
    name: '高额费用三级审批',
    nodes: [
      { id: 'n1', name: '直属上级', strategy: '单签' as const },
      { id: 'n2', name: '部门总监', strategy: '单签' as const },
      { id: 'n3', name: '财务核算', strategy: '会签' as const },
    ],
  },
  {
    id: 'T003',
    name: '快速单签审批',
    nodes: [
      { id: 'n1', name: '直属经理', strategy: '单签' as const },
    ],
  },
];

const assigneeTypeOptions: AssigneeType[] = ['具体人员', '部门角色', '指定主管', '上一节点负责人'];

const assigneeValueOptions: Record<AssigneeType, string[]> = {
  具体人员: ['张三（财务主管）', '李四（总经理）', '王五（运营总监）', '赵六（销售总监）'],
  部门角色: ['部门经理', '财务主管', '差旅管理员', '销售主管', '技术总监'],
  指定主管: ['直属上级', '部门总监', 'CEO'],
  上一节点负责人: ['上一节点负责人'],
};

const initialMappings: BusinessMapping[] = [
  {
    key: '1',
    bizCode: 'TRAVEL',
    bizName: '出差申请',
    templateId: 'T001',
    templateName: '通用双层审批',
    assignments: [
      { nodeId: 'n1', nodeName: '部门审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '部门经理', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '财务审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '差旅管理员', skipIfEmpty: false },
    ],
    updatedAt: '2026-04-20',
  },
  {
    key: '2',
    bizCode: 'REIMBURSE',
    bizName: '报销申请',
    templateId: 'T002',
    templateName: '高额费用三级审批',
    assignments: [
      { nodeId: 'n1', nodeName: '直属上级', strategy: '单签', assigneeType: '指定主管', assigneeValue: '直属上级', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '部门总监', strategy: '单签', assigneeType: '部门角色', assigneeValue: '部门经理', skipIfEmpty: false },
      { nodeId: 'n3', nodeName: '财务核算', strategy: '会签', assigneeType: '具体人员', assigneeValue: '张三（财务主管）', skipIfEmpty: true },
    ],
    updatedAt: '2026-04-19',
  },
  {
    key: '3',
    bizCode: 'QUOTATION',
    bizName: '报价',
    templateId: 'T001',
    templateName: '通用双层审批',
    assignments: [
      { nodeId: 'n1', nodeName: '部门审批', strategy: '单签', assigneeType: '部门角色', assigneeValue: '销售主管', skipIfEmpty: false },
      { nodeId: 'n2', nodeName: '财务审批', strategy: '单签', assigneeType: '具体人员', assigneeValue: '张三（财务主管）', skipIfEmpty: false },
    ],
    updatedAt: '2026-04-18',
  },
  {
    key: '4',
    bizCode: 'CONTRACT',
    bizName: '合同记录',
    templateId: null,
    templateName: null,
    assignments: [],
    updatedAt: '-',
  },
];

export function BusinessMappingList() {
  const [mappings, setMappings] = useState<BusinessMapping[]>(initialMappings);
  const [configVisible, setConfigVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [editing, setEditing] = useState<BusinessMapping | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<NodeAssignment[]>([]);

  const openConfig = (record: BusinessMapping) => {
    setEditing(record);
    setSelectedTemplateId(record.templateId);
    setAssignments(record.assignments.map((a) => ({ ...a })));
    setConfigVisible(true);
  };

  const openPreview = (record: BusinessMapping) => {
    setEditing(record);
    setPreviewVisible(true);
  };

  const handleTemplateChange = (tid: string) => {
    setSelectedTemplateId(tid);
    const tmpl = templates.find((t) => t.id === tid);
    if (tmpl) {
      setAssignments(tmpl.nodes.map((n) => ({
        nodeId: n.id,
        nodeName: n.name,
        strategy: n.strategy,
        assigneeType: '部门角色',
        assigneeValue: '',
        skipIfEmpty: false,
      })));
    }
  };

  const updateAssignment = (nodeId: string, field: keyof NodeAssignment, value: any) => {
    setAssignments((prev) => prev.map((a) => {
      if (a.nodeId !== nodeId) return a;
      const updated = { ...a, [field]: value };
      if (field === 'assigneeType') updated.assigneeValue = '';
      return updated;
    }));
  };

  const handleSave = () => {
    if (!selectedTemplateId) { Message.error('请选择审批模板'); return; }
    const incomplete = assignments.find((a) => !a.assigneeValue && !a.skipIfEmpty);
    if (incomplete) { Message.warning(`节点"${incomplete.nodeName}"尚未配置审批人`); return; }

    const tmpl = templates.find((t) => t.id === selectedTemplateId);
    setMappings((prev) => prev.map((m) =>
      m.key === editing!.key
        ? { ...m, templateId: selectedTemplateId, templateName: tmpl?.name || '', assignments, updatedAt: '2026-05-06' }
        : m
    ));
    Message.success('业务审批配置已保存');
    setConfigVisible(false);
  };

  const columns = [
    {
      title: '业务模块',
      dataIndex: 'bizName',
      width: 140,
      render: (name: string) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: '当前绑定模板',
      dataIndex: 'templateName',
      width: 200,
      render: (name: string | null) =>
        name ? <Tag color="arcoblue">{name}</Tag> : <span style={{ color: 'var(--color-text-3)' }}>未配置</span>,
    },
    {
      title: '审批环节数',
      dataIndex: 'assignments',
      width: 100,
      render: (arr: NodeAssignment[]) =>
        arr.length > 0 ? `${arr.length} 个节点` : <span style={{ color: '#aaa' }}>—</span>,
    },
    { title: '最近更新', dataIndex: 'updatedAt', width: 120 },
    {
      title: '操作',
      width: 140,
      fixed: 'right' as const,
      render: (_: any, record: BusinessMapping) => (
        <Space>
          <Button type="text" size="small" icon={<IconEdit />} onClick={() => openConfig(record)}>配置</Button>
          {record.templateId && (
            <Button type="text" size="small" icon={<IconEye />} onClick={() => openPreview(record)}>预览</Button>
          )}
        </Space>
      ),
    },
  ];

  const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>业务审批配置</Title>
        <p style={{ color: 'var(--color-text-3)', marginTop: 4, fontSize: 13 }}>
          将业务模块与审批模板绑定，并为每个审批节点指定具体审批人或角色策略。
        </p>
      </div>

      <Card>
        <Table columns={columns} data={mappings} pagination={false} />
      </Card>

      {/* Config Modal */}
      <Modal
        title={`配置审批 — ${editing?.bizName}`}
        visible={configVisible}
        maskClosable={false}
        style={{ width: 780 }}
        onCancel={() => setConfigVisible(false)}
        onOk={handleSave}
        okText="保存配置"
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>步骤 1：选择审批模板</div>
          <Select
            value={selectedTemplateId || undefined}
            placeholder="请选择审批模板"
            style={{ width: 300 }}
            onChange={handleTemplateChange}
          >
            {templates.map((t) => (
              <Select.Option key={t.id} value={t.id}>{t.id} — {t.name}</Select.Option>
            ))}
          </Select>
        </div>

        {currentTemplate && assignments.length > 0 && (
          <div>
            <div style={{ fontWeight: 500, marginBottom: 8 }}>步骤 2：环节审批人映射</div>
            <div style={{ border: '1px solid var(--color-border-2)', borderRadius: 6, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--color-fill-2)', fontSize: 13 }}>
                    {['审批环节', '审批策略', '审批人员 / 策略', '异常处理'].map((h) => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 500, color: 'var(--color-text-2)', borderBottom: '1px solid var(--color-border-2)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a, idx) => (
                    <tr key={a.nodeId} style={{ borderBottom: idx < assignments.length - 1 ? '1px solid var(--color-border-2)' : 'none' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 500 }}>{a.nodeName}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <Tag color={a.strategy === '会签' ? 'purple' : 'arcoblue'}>{a.strategy}</Tag>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Space direction="vertical" size={4}>
                          <Select
                            value={a.assigneeType}
                            onChange={(v) => updateAssignment(a.nodeId, 'assigneeType', v)}
                            style={{ width: 150 }}
                            size="small"
                          >
                            {assigneeTypeOptions.map((o) => (
                              <Select.Option key={o} value={o}>{o}</Select.Option>
                            ))}
                          </Select>
                          {a.assigneeType !== '上一节点负责人' && (
                            <Select
                              value={a.assigneeValue || undefined}
                              placeholder="请选择"
                              onChange={(v) => updateAssignment(a.nodeId, 'assigneeValue', v)}
                              style={{ width: 180 }}
                              size="small"
                              allowClear
                            >
                              {assigneeValueOptions[a.assigneeType].map((o) => (
                                <Select.Option key={o} value={o}>{o}</Select.Option>
                              ))}
                            </Select>
                          )}
                        </Space>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <Checkbox
                          checked={a.skipIfEmpty}
                          onChange={(v) => updateAssignment(a.nodeId, 'skipIfEmpty', v)}
                        >
                          <span style={{ fontSize: 12 }}>审批人为空时自动跳过</span>
                        </Checkbox>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        title={`审批链路预览 — ${editing?.bizName}`}
        visible={previewVisible}
        footer={<Button onClick={() => setPreviewVisible(false)}>关闭</Button>}
        onCancel={() => setPreviewVisible(false)}
        style={{ width: 620 }}
      >
        {editing?.templateId && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ color: 'var(--color-text-3)', fontSize: 13 }}>模板：</span>
              <Tag color="arcoblue">{editing.templateName}</Tag>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div style={{
                  padding: '8px 20px',
                  borderRadius: 20,
                  background: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: 500,
                  fontSize: 13,
                }}>发起人</div>
              </div>

              {editing.assignments.map((a, idx) => (
                <div key={a.nodeId} className="flex items-start gap-2">
                  <div style={{ paddingTop: 10, color: '#aaa', fontSize: 12, minWidth: 12 }}>↓</div>
                  <div style={{
                    flex: 1,
                    border: '1px solid var(--color-border-2)',
                    borderRadius: 8,
                    padding: '10px 16px',
                    background: 'var(--color-fill-1)',
                  }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontWeight: 500 }}>环节 {idx + 1}：{a.nodeName}</span>
                      <Tag color={a.strategy === '会签' ? 'purple' : 'arcoblue'} size="small">{a.strategy}</Tag>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, color: 'var(--color-text-2)' }}>
                      审批人：<span style={{ color: 'var(--color-text-1)', fontWeight: 500 }}>
                        {a.assigneeValue || <span style={{ color: '#aaa' }}>未配置</span>}
                      </span>
                      <span style={{ color: 'var(--color-text-3)', marginLeft: 8 }}>（{a.assigneeType}）</span>
                    </div>
                    {a.skipIfEmpty && (
                      <div style={{ marginTop: 4, fontSize: 12, color: '#ff7d00' }}>⚠ 审批人为空时自动跳过</div>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <div style={{ paddingTop: 0, color: '#aaa', fontSize: 12 }}>↓</div>
              </div>
              <div style={{
                padding: '8px 20px',
                borderRadius: 20,
                background: '#fce4ec',
                color: '#c62828',
                fontWeight: 500,
                fontSize: 13,
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}>审批结束</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
