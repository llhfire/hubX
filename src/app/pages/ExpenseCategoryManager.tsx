import { useState } from 'react';
import {
  Card,
  Button,
  Switch,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Popconfirm,
  Message,
  Tree,
  Checkbox,
  Badge,
} from '@arco-design/web-react';
import { IconPlus, IconEdit, IconDelete, IconDown, IconRight } from '@arco-design/web-react/icon';

const { Title, Text } = Typography;
const RadioGroup = Radio.Group;

interface ExpenseCategory {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
  level: 1 | 2;
  accountCode: string;
  accountName: string;
  status: boolean;
  bizScopes: string[];
  remark: string;
  order: number;
}

const BIZ_SCOPES = ['出差', '报销', '报价', '合同'];

const ACCOUNT_OPTIONS = [
  { value: '6601', label: '6601 — 销售费用' },
  { value: '6602', label: '6602 — 管理费用' },
  { value: '6603', label: '6603 — 研发费用' },
  { value: '6611', label: '6611 — 差旅费' },
  { value: '6612', label: '6612 — 业务招待费' },
  { value: '6621', label: '6621 — 办公费' },
  { value: '6631', label: '6631 — 薪酬费用' },
  { value: '6641', label: '6641 — 折旧费' },
];

const initialCategories: ExpenseCategory[] = [
  { id: 'B', name: '商务费用', code: 'B00', parentId: null, level: 1, accountCode: '6601', accountName: '销售费用', status: true, bizScopes: ['出差', '报销', '报价'], remark: '一切对外商务活动产生的费用', order: 1 },
  { id: 'B01', name: '差旅费', code: 'B01', parentId: 'B', level: 2, accountCode: '6611', accountName: '差旅费', status: true, bizScopes: ['出差', '报销'], remark: '因公出行产生的交通、住宿等', order: 1 },
  { id: 'B02', name: '业务招待费', code: 'B02', parentId: 'B', level: 2, accountCode: '6612', accountName: '业务招待费', status: true, bizScopes: ['报销'], remark: '客户宴请、礼品等', order: 2 },
  { id: 'B03', name: '市场推广费', code: 'B03', parentId: 'B', level: 2, accountCode: '6601', accountName: '销售费用', status: true, bizScopes: ['报销', '报价'], remark: '展会、广告投放等', order: 3 },
  { id: 'R', name: '研发费用', code: 'R00', parentId: null, level: 1, accountCode: '6603', accountName: '研发费用', status: true, bizScopes: ['报销'], remark: '研发项目相关支出', order: 2 },
  { id: 'R01', name: '研发差旅费', code: 'R01', parentId: 'R', level: 2, accountCode: '6611', accountName: '差旅费', status: true, bizScopes: ['出差', '报销'], remark: '研发人员因公出行', order: 1 },
  { id: 'R02', name: '软件工具费', code: 'R02', parentId: 'R', level: 2, accountCode: '6621', accountName: '办公费', status: true, bizScopes: ['报销'], remark: 'IDE、SaaS工具订阅等', order: 2 },
  { id: 'O', name: '运营费用', code: 'O00', parentId: null, level: 1, accountCode: '6602', accountName: '管理费用', status: true, bizScopes: ['报销'], remark: '日常运营及行政支出', order: 3 },
  { id: 'O01', name: '办公用品费', code: 'O01', parentId: 'O', level: 2, accountCode: '6621', accountName: '办公费', status: true, bizScopes: ['报销'], remark: '文具、耗材等', order: 1 },
  { id: 'O02', name: '通讯费', code: 'O02', parentId: 'O', level: 2, accountCode: '6621', accountName: '办公费', status: false, bizScopes: ['报销'], remark: '手机话费、宽带等', order: 2 },
  { id: 'X', name: '其他费用', code: 'X00', parentId: null, level: 1, accountCode: '6602', accountName: '管理费用', status: true, bizScopes: ['报销'], remark: '不属于以上分类的杂项费用', order: 4 },
];

function buildTree(categories: ExpenseCategory[]) {
  const parents = categories.filter((c) => c.level === 1).sort((a, b) => a.order - b.order);
  return parents.map((p) => ({
    ...p,
    children: categories.filter((c) => c.parentId === p.id).sort((a, b) => a.order - b.order),
  }));
}

export function ExpenseCategoryManager() {
  const [categories, setCategories] = useState<ExpenseCategory[]>(initialCategories);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<ExpenseCategory | null>(null);
  const [defaultLevel, setDefaultLevel] = useState<1 | 2>(1);
  const [form] = Form.useForm();
  const [formLevel, setFormLevel] = useState<1 | 2>(1);

  const tree = buildTree(categories);

  const parents = categories.filter((c) => c.level === 1 && c.status);

  const displayList = selectedParentId
    ? categories.filter((c) => c.parentId === selectedParentId || c.id === selectedParentId)
    : categories.filter((c) => c.level === 1);

  const openCreate = (level: 1 | 2, parentId?: string) => {
    setEditing(null);
    setDefaultLevel(level);
    setFormLevel(level);
    form.resetFields();
    form.setFieldsValue({ level, parentId: parentId || undefined });
    setModalVisible(true);
  };

  const openEdit = (record: ExpenseCategory) => {
    setEditing(record);
    setFormLevel(record.level);
    form.setFieldsValue({
      level: record.level,
      parentId: record.parentId || undefined,
      name: record.name,
      code: record.code,
      accountCode: record.accountCode,
      bizScopes: record.bizScopes,
      remark: record.remark,
    });
    setModalVisible(true);
  };

  const handleToggleStatus = (id: string, val: boolean) => {
    setCategories((prev) => prev.map((c) => {
      if (c.id === id) return { ...c, status: val };
      if (!val && c.parentId === id) return { ...c, status: false };
      return c;
    }));
  };

  const handleDelete = (record: ExpenseCategory) => {
    if (record.level === 1) {
      const childCount = categories.filter((c) => c.parentId === record.id).length;
      if (childCount > 0) {
        Modal.confirm({
          title: '确认删除',
          content: `该分类下包含 ${childCount} 个二级分类，删除将导致关联业务报错，是否确认？`,
          okButtonProps: { status: 'danger' },
          onOk: () => {
            setCategories((prev) => prev.filter((c) => c.id !== record.id && c.parentId !== record.id));
            if (selectedParentId === record.id) setSelectedParentId(null);
            Message.success('已删除');
          },
        });
        return;
      }
    }
    setCategories((prev) => prev.filter((c) => c.id !== record.id));
    Message.success('已删除');
  };

  const handleSave = () => {
    form.validate().then((values) => {
      const codeExists = categories.some(
        (c) => c.code === values.code && (!editing || c.id !== editing.id)
      );
      if (codeExists) { Message.error('分类编码已存在，请修改'); return; }

      const acct = ACCOUNT_OPTIONS.find((a) => a.value === values.accountCode);

      if (editing) {
        setCategories((prev) => prev.map((c) =>
          c.id === editing.id
            ? { ...c, ...values, accountName: acct?.label.split(' — ')[1] || '' }
            : c
        ));
        Message.success('已更新');
      } else {
        const newCat: ExpenseCategory = {
          id: values.code,
          name: values.name,
          code: values.code,
          parentId: values.level === 2 ? values.parentId : null,
          level: values.level,
          accountCode: values.accountCode,
          accountName: acct?.label.split(' — ')[1] || '',
          status: true,
          bizScopes: values.bizScopes || [],
          remark: values.remark || '',
          order: categories.filter((c) => values.level === 1 ? c.level === 1 : c.parentId === values.parentId).length + 1,
        };
        setCategories((prev) => [...prev, newCat]);
        Message.success('已创建');
      }
      setModalVisible(false);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Title heading={4} style={{ margin: 0 }}>费用分类管理</Title>
        <Space>
          <Button onClick={() => openCreate(2)}>新增二级分类</Button>
          <Button type="primary" icon={<IconPlus />} onClick={() => openCreate(1)}>新增一级分类</Button>
        </Space>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Left: tree */}
        <Card title="分类结构" bodyStyle={{ padding: '8px 0' }}>
          <div
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              background: selectedParentId === null ? 'rgb(var(--primary-1))' : 'transparent',
              color: selectedParentId === null ? 'rgb(var(--primary-6))' : 'inherit',
              fontWeight: selectedParentId === null ? 500 : 400,
              fontSize: 13,
            }}
            onClick={() => setSelectedParentId(null)}
          >
            全部一级分类
          </div>
          {tree.map((parent) => (
            <div key={parent.id}>
              <div
                className="flex items-center gap-2"
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  background: selectedParentId === parent.id ? 'rgb(var(--primary-1))' : 'transparent',
                  color: selectedParentId === parent.id ? 'rgb(var(--primary-6))' : 'inherit',
                  borderLeft: selectedParentId === parent.id ? '3px solid rgb(var(--primary-6))' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
                onClick={() => setSelectedParentId(parent.id === selectedParentId ? null : parent.id)}
              >
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{parent.name}</span>
                {!parent.status && <Tag size="small" color="gray">停用</Tag>}
                <span style={{ color: 'var(--color-text-3)', fontSize: 12 }}>{parent.children.length}</span>
              </div>
              {selectedParentId === parent.id && parent.children.map((child) => (
                <div
                  key={child.id}
                  style={{
                    padding: '6px 16px 6px 32px',
                    fontSize: 12,
                    color: child.status ? 'var(--color-text-2)' : 'var(--color-text-4)',
                  }}
                >
                  {child.name}
                  {!child.status && <span style={{ marginLeft: 6, color: '#aaa' }}>（停用）</span>}
                </div>
              ))}
            </div>
          ))}
        </Card>

        {/* Right: table */}
        <Card
          title={selectedParentId
            ? `${categories.find((c) => c.id === selectedParentId)?.name || ''} — 详细配置`
            : '一级分类列表'
          }
          extra={
            selectedParentId && (
              <Button size="small" icon={<IconPlus />} type="primary"
                onClick={() => openCreate(2, selectedParentId)}>
                新增子分类
              </Button>
            )
          }
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: 'var(--color-fill-2)', borderBottom: '1px solid var(--color-border-2)' }}>
                {['分类名称', '编码', '会计科目', '适用场景', '状态', '操作'].map((h) => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontWeight: 500, color: 'var(--color-text-2)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayList.map((item) => {
                const isParent = item.level === 1;
                const childCount = categories.filter((c) => c.parentId === item.id).length;
                return (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--color-border-2)', background: isParent ? 'var(--color-fill-1)' : '#fff' }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div className="flex items-center gap-2">
                        {isParent
                          ? <Tag size="small" color="arcoblue">一级</Tag>
                          : <span style={{ paddingLeft: 12, color: 'var(--color-text-3)' }}>└</span>
                        }
                        <span style={{ fontWeight: isParent ? 500 : 400 }}>{item.name}</span>
                        {isParent && childCount > 0 && (
                          <span style={{ color: 'var(--color-text-3)', fontSize: 11 }}>({childCount})</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--color-text-2)' }}>
                      {item.code}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: 'var(--color-text-2)' }}>{item.accountCode}</span>
                      <span style={{ color: 'var(--color-text-3)', marginLeft: 6 }}>— {item.accountName}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Space size={4}>
                        {item.bizScopes.map((s) => (
                          <Tag key={s} size="small" color="cyan">{s}</Tag>
                        ))}
                      </Space>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Switch
                        checked={item.status}
                        size="small"
                        onChange={(v) => handleToggleStatus(item.id, v)}
                      />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Space>
                        <Button type="text" size="small" icon={<IconEdit />} onClick={() => openEdit(item)}>编辑</Button>
                        {isParent && (
                          <Button type="text" size="small" icon={<IconPlus />} onClick={() => openCreate(2, item.id)}>
                            子类
                          </Button>
                        )}
                        <Popconfirm
                          title={isParent && childCount > 0
                            ? `该分类下有 ${childCount} 个子分类，确认删除？`
                            : '确认删除该分类？'
                          }
                          onOk={() => handleDelete(item)}
                        >
                          <Button type="text" size="small" icon={<IconDelete />} status="danger" />
                        </Popconfirm>
                      </Space>
                    </td>
                  </tr>
                );
              })}
              {displayList.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-3)' }}>
                    暂无数据
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      <Modal
        title={editing ? '编辑费用分类' : '新增费用分类'}
        visible={modalVisible}
        maskClosable={false}
        style={{ width: 560 }}
        onCancel={() => setModalVisible(false)}
        onOk={handleSave}
        okText="保存"
      >
        <Form form={form} layout="vertical" autoComplete="off">
          <Form.Item label="分类级别" field="level" rules={[{ required: true }]}>
            <RadioGroup onChange={(v) => setFormLevel(v)}>
              <Radio value={1}>一级分类</Radio>
              <Radio value={2}>二级分类</Radio>
            </RadioGroup>
          </Form.Item>

          {formLevel === 2 && (
            <Form.Item label="所属父级" field="parentId" rules={[{ required: true, message: '请选择父级分类' }]}>
              <Select placeholder="请选择一级分类">
                {parents.map((p) => (
                  <Select.Option key={p.id} value={p.id}>{p.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Form.Item label="分类名称" field="name" rules={[{ required: true, message: '请输入分类名称' }]}>
              <Input placeholder="如：差旅费" />
            </Form.Item>
            <Form.Item label="分类编码" field="code" rules={[{ required: true, message: '请输入分类编码' }]}>
              <Input placeholder="如：B01（全局唯一）" />
            </Form.Item>
          </div>

          <Form.Item label="关联会计科目" field="accountCode" rules={[{ required: true, message: '请选择会计科目' }]}>
            <Select placeholder="请选择会计科目">
              {ACCOUNT_OPTIONS.map((a) => (
                <Select.Option key={a.value} value={a.value}>{a.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="适用业务场景" field="bizScopes">
            <Checkbox.Group options={BIZ_SCOPES.map((s) => ({ label: s, value: s }))} />
          </Form.Item>

          <Form.Item label="备注" field="remark">
            <Input.TextArea placeholder="分类说明或用途备注" rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
