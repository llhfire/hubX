import { useState } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Button,
  Space,
  Card,
  Typography,
  Tag,
} from '@arco-design/web-react';
import { IconPlus, IconDelete } from '@arco-design/web-react/icon';
import { AdDeliveryRow, AdDeliveryReportContent } from './types';
import { getAdDeliveryMockData } from './templateConfig';

const Title = Typography.Title;

interface Props {
  content: AdDeliveryReportContent;
  onChange: (content: AdDeliveryReportContent) => void;
}

export function AdDeliveryDailyTemplate({ content, onChange }: Props) {
  const [rows, setRows] = useState<AdDeliveryRow[]>(content['ad-delivery-data']?.length ? content['ad-delivery-data'] : getAdDeliveryMockData());

  const updateRows = (newRows: AdDeliveryRow[]) => {
    setRows(newRows);
    onChange({ ...content, 'ad-delivery-data': newRows });
  };

  const updateCell = (id: string, field: keyof AdDeliveryRow, value: any) => {
    const newRows = rows.map(r => r.id === id ? { ...r, [field]: value } : r);
    updateRows(newRows);
  };

  const addRow = () => {
    const newRow: AdDeliveryRow = { id: `ad-${Date.now()}`, platform: '', account: '', spend: 0, impression: 0, click: 0, leads: 0 };
    updateRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    updateRows(rows.filter(r => r.id !== id));
  };

  const handleFieldChange = (field: keyof AdDeliveryReportContent, value: any) => {
    onChange({ ...content, [field]: value });
  };

  // 汇总
  const totalSpend = rows.reduce((s, r) => s + (r.spend || 0), 0);
  const totalImpression = rows.reduce((s, r) => s + (r.impression || 0), 0);
  const totalClick = rows.reduce((s, r) => s + (r.click || 0), 0);
  const totalLeads = rows.reduce((s, r) => s + (r.leads || 0), 0);
  const avgCTR = totalImpression > 0 ? ((totalClick / totalImpression) * 100).toFixed(2) : '0';
  const avgCPL = totalLeads > 0 ? (totalSpend / totalLeads).toFixed(1) : '0';

  const columns = [
    {
      title: '平台', dataIndex: 'platform', width: 120,
      render: (_: unknown, record: AdDeliveryRow) => (
        <Input placeholder="如：百度" value={record.platform} onChange={v => updateCell(record.id, 'platform', v)} size="small" />
      ),
    },
    {
      title: '账户', dataIndex: 'account', width: 120,
      render: (_: unknown, record: AdDeliveryRow) => (
        <Input placeholder="账户名" value={record.account} onChange={v => updateCell(record.id, 'account', v)} size="small" />
      ),
    },
    {
      title: '消耗(元)', dataIndex: 'spend', width: 100,
      render: (_: unknown, record: AdDeliveryRow) => (
        <InputNumber min={0} value={record.spend} onChange={v => updateCell(record.id, 'spend', v || 0)} size="small" style={{ width: '100%' }} />
      ),
    },
    {
      title: '展示', dataIndex: 'impression', width: 90,
      render: (_: unknown, record: AdDeliveryRow) => (
        <InputNumber min={0} value={record.impression} onChange={v => updateCell(record.id, 'impression', v || 0)} size="small" style={{ width: '100%' }} />
      ),
    },
    {
      title: '点击', dataIndex: 'click', width: 80,
      render: (_: unknown, record: AdDeliveryRow) => (
        <InputNumber min={0} value={record.click} onChange={v => updateCell(record.id, 'click', v || 0)} size="small" style={{ width: '100%' }} />
      ),
    },
    {
      title: '线索', dataIndex: 'leads', width: 70,
      render: (_: unknown, record: AdDeliveryRow) => (
        <InputNumber min={0} value={record.leads} onChange={v => updateCell(record.id, 'leads', v || 0)} size="small" style={{ width: '100%' }} />
      ),
    },
    {
      title: 'CTR', width: 70,
      render: (_: unknown, record: AdDeliveryRow) => (
        <span style={{ fontSize: 12 }}>
          {record.impression > 0 ? ((record.click / record.impression) * 100).toFixed(2) : '0.00'}%
        </span>
      ),
    },
    {
      title: 'CPL', width: 70,
      render: (_: unknown, record: AdDeliveryRow) => (
        <span style={{ fontSize: 12 }}>
          {record.leads > 0 ? `¥${(record.spend / record.leads).toFixed(1)}` : '—'}
        </span>
      ),
    },
    {
      title: '', width: 40,
      render: (_: unknown, record: AdDeliveryRow) => (
        <Button type="text" size="small" status="danger" icon={<IconDelete />} onClick={() => removeRow(record.id)} />
      ),
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card size="small" title="投放数据">
        <Table
          columns={columns as any}
          data={rows}
          rowKey="id"
          pagination={false}
          border
          scroll={{ x: 700 }}
        />
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button type="primary" icon={<IconPlus />} size="small" onClick={addRow}>添加平台</Button>
          <Space size={16}>
            <Tag color="blue">总消耗 ¥{totalSpend.toLocaleString()}</Tag>
            <Tag>展示 {totalImpression.toLocaleString()}</Tag>
            <Tag>点击 {totalClick.toLocaleString()}</Tag>
            <Tag color="green">线索 {totalLeads}</Tag>
            <Tag color="orange">CTR {avgCTR}%</Tag>
            <Tag color="purple">CPL ¥{avgCPL}</Tag>
          </Space>
        </div>
      </Card>

      <Card size="small" title="优化动作" bodyStyle={{ padding: '12px 16px' }}>
        <Input.TextArea
          placeholder="今日做了哪些优化操作？（如：调整出价、更换素材、新增关键词等）"
          value={content['optimization-actions'] || ''}
          onChange={v => handleFieldChange('optimization-actions', v)}
          autoSize={{ minRows: 3, maxRows: 6 }}
          style={{ width: '100%' }}
        />
      </Card>

      <Card size="small" title="明日工作计划" bodyStyle={{ padding: '12px 16px' }}>
        <Input.TextArea
          placeholder="请输入明日工作计划（必填）"
          value={content['tomorrow-plan'] || ''}
          onChange={v => handleFieldChange('tomorrow-plan', v)}
          autoSize={{ minRows: 2, maxRows: 4 }}
          style={{ width: '100%' }}
        />
      </Card>
    </Space>
  );
}
