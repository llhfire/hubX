// src/app/pages/daily-report/RoleSelectModal.tsx

import { Modal, Button, Space, Typography } from '@arco-design/web-react';

const { Text } = Typography;

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSelect: (role: 'sales' | 'general') => void;
}

export function RoleSelectModal({ visible, onCancel, onSelect }: Props) {
  const handleSelect = (role: 'sales' | 'general') => {
    onSelect(role);
  };

  return (
    <Modal
      title="选择日报类型"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      style={{ width: 400 }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <Text style={{ display: 'block', marginBottom: 24 }}>
          请选择您当前要填写的日报类型：
        </Text>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            style={{ width: '100%', height: 60 }}
            onClick={() => handleSelect('sales')}
          >
            销售日报
          </Button>
          <Button
            size="large"
            style={{ width: '100%', height: 60 }}
            onClick={() => handleSelect('general')}
          >
            通用日报
          </Button>
        </Space>
      </div>
    </Modal>
  );
}