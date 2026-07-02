// src/app/pages/daily-report/RoleSelectModal.tsx

import { Modal, Button, Space, Typography, Card } from '@arco-design/web-react';
import { IconCustomerService, IconExperiment, IconEdit, IconApps } from '@arco-design/web-react/icon';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSelect: (role: 'sales' | 'general' | 'ad-delivery' | 'dev') => void;
}

const REPORT_TYPES = [
  { key: 'sales' as const,        label: '销售日报',  desc: '线索跟进、客户沟通',     icon: <IconCustomerService />, color: '#165dff' },
  { key: 'ad-delivery' as const,  label: '投放日报',  desc: '平台投放数据、优化动作',  icon: <IconExperiment />,       color: '#ff7d00' },
  { key: 'dev' as const,          label: '开发日报',  desc: '工种/项目/工时/代码进展', icon: <IconEdit />,            color: '#00b42a' },
  { key: 'general' as const,      label: '通用日报',  desc: '项目任务、总结、计划',     icon: <IconApps />,             color: '#7c3aed' },
];

export function RoleSelectModal({ visible, onCancel, onSelect }: Props) {
  return (
    <Modal
      title="选择日报类型"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ width: 420 }}
    >
      <div style={{ padding: '16px 0' }}>
        <Text style={{ display: 'block', marginBottom: 16, textAlign: 'center' }}>
          请选择您当前要填写的日报类型：
        </Text>
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {REPORT_TYPES.map(rt => (
            <Button
              key={rt.key}
              size="large"
              style={{ width: '100%', height: 64, textAlign: 'left', padding: '0 20px' }}
              onClick={() => onSelect(rt.key)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22, color: rt.color }}>{rt.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{rt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{rt.desc}</div>
                </div>
              </div>
            </Button>
          ))}
        </Space>
      </div>
    </Modal>
  );
}