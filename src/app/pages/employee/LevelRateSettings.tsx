import { useState, useMemo } from 'react';
import {
  Card,
  Tabs,
  Tag,
  Table,
  InputNumber,
  Button,
  Space,
  Typography,
  Message,
} from '@arco-design/web-react';
import { IconSave, IconUserGroup } from '@arco-design/web-react/icon';
import { useEmployee } from './EmployeeContext';
import {
  LevelRateConfig,
  Position,
  ALL_POSITIONS,
  ALL_JOB_LEVELS,
  formatCurrency,
  getLevelColor,
} from './mockData';

const TabPane = Tabs.TabPane;
const Title = Typography.Title;

export function LevelRateSettings() {
  const { levelRates, updateLevelRate } = useEmployee();

  const [activePosition, setActivePosition] = useState<Position>('前端开发');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const positionRates = useMemo(
    () => levelRates.filter(r => r.position === activePosition),
    [levelRates, activePosition],
  );

  const handleEdit = (record: LevelRateConfig) => {
    setEditingKey(`${record.level}-${record.position}`);
    setEditValue(record.standardRate);
  };

  const handleSave = (record: LevelRateConfig) => {
    updateLevelRate(record.level, record.position, editValue);
    setEditingKey(null);
    Message.success(`已更新 ${record.level}·${record.position} 的标准时薪为 ${formatCurrency(editValue)}/h，对应员工已同步更新`);
  };

  const columns = [
    {
      title: '职级',
      dataIndex: 'level',
      width: 70,
      render: (v: string) => (
        <Tag color={getLevelColor(v as any)} style={{ color: '#fff', fontWeight: 700 }}>
          {v}
        </Tag>
      ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      width: 90,
      render: (v: string) => <Tag>{v}</Tag>,
    },
    {
      title: '时薪范围（元/小时）',
      width: 220,
      render: (_: unknown, record: LevelRateConfig) => (
        <span style={{ color: 'var(--color-text-2)' }}>
          {formatCurrency(record.minRate)} ~ {formatCurrency(record.maxRate)}
        </span>
      ),
    },
    {
      title: '标准时薪（元/小时）',
      width: 200,
      dataIndex: 'standardRate',
      render: (_: unknown, record: LevelRateConfig) => {
        const key = `${record.level}-${record.position}`;
        if (editingKey === key) {
          return (
            <Space>
              <InputNumber
                style={{ width: 100 }}
                min={record.minRate}
                max={record.maxRate}
                value={editValue}
                onChange={v => setEditValue(v || 0)}
                prefix="¥"
                suffix="/h"
                size="small"
                autoFocus
              />
              <Button type="text" size="small" onClick={() => handleSave(record)}>
                保存
              </Button>
              <Button type="text" size="small" status="danger" onClick={() => setEditingKey(null)}>
                取消
              </Button>
            </Space>
          );
        }
        return (
          <span style={{ fontWeight: 700, color: 'rgb(var(--primary-6))', fontSize: 15 }}>
            {formatCurrency(record.standardRate)}/h
          </span>
        );
      },
    },
    { title: '等级描述', dataIndex: 'description' },
    {
      title: '操作',
      width: 100,
      render: (_: unknown, record: LevelRateConfig) => {
        if (editingKey === `${record.level}-${record.position}`) return null;
        return (
          <Button type="text" size="small" icon={<IconSave />} onClick={() => handleEdit(record)}>
            编辑时薪
          </Button>
        );
      },
    },
  ];

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card bordered={false}>
        <div style={{ marginBottom: 16 }}>
          <Title heading={5} style={{ margin: 0 }}>
            <Space>
              <IconUserGroup />
              职级 × 职位 标准时薪配置
            </Space>
          </Title>
          <Typography.Paragraph style={{ margin: '8px 0 0', color: 'var(--color-text-3)', fontSize: 13 }}>
            修改标准时薪后，系统中对应「职级 × 职位」的员工标准时薪会自动同步更新。
          </Typography.Paragraph>
        </div>

        <Tabs
          activeTab={activePosition}
          onChange={(key) => setActivePosition(key as Position)}
          type="card-gutter"
        >
          {ALL_POSITIONS.map(pos => (
            <TabPane key={pos} title={pos} />
          ))}
        </Tabs>

        <div style={{ marginTop: 12 }}>
          <Table
            columns={columns as any}
            data={positionRates}
            rowKey={(record) => `${record.level}-${record.position}`}
            pagination={false}
          />
        </div>
      </Card>
    </Space>
  );
}
