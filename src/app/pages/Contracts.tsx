import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Badge,
  Modal,
  Form,
  Message,
  Space,
  Typography,
  DatePicker,
  InputNumber,
  Upload,
} from '@arco-design/web-react';
import { IconSearch, IconPlus, IconEye, IconDownload } from '@arco-design/web-react/icon';
import { DELIVERY_TYPES } from './delivery-plan/types';

const Title = Typography.Title;

export function Contracts() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const contracts = [
    {
      key: '1',
      contractNo: 'HT202604001',
      name: 'A公司CRM系统开发合同',
      customer: 'A科技公司',
      amount: 120,
      signDate: '2026-03-15',
      startDate: '2026-03-20',
      endDate: '2026-06-20',
      status: '履行中',
      approvalStatus: '已批准',
      received: 80,
      receivable: 40,
      progress: 75,
      deliveryType: '全平台',
    },
    {
      key: '2',
      contractNo: 'HT202604002',
      name: 'B公司电商平台合同',
      customer: 'B电商公司',
      amount: 200,
      signDate: '2026-03-20',
      startDate: '2026-03-25',
      endDate: '2026-08-25',
      status: '履行中',
      approvalStatus: '已批准',
      received: 100,
      receivable: 100,
      progress: 45,
      deliveryType: '小程序',
    },
    {
      key: '3',
      contractNo: 'HT202604003',
      name: 'C公司移动应用开发合同',
      customer: 'C互联网公司',
      amount: 85,
      signDate: '2026-04-01',
      startDate: '2026-04-05',
      endDate: '2026-07-05',
      status: '履行中',
      approvalStatus: '已批准',
      received: 40,
      receivable: 45,
      progress: 30,
      deliveryType: '网站',
    },
    {
      key: '4',
      contractNo: 'HT202604004',
      name: 'D公司数据中台建设合同',
      customer: 'D数据公司',
      amount: 150,
      signDate: '2026-02-10',
      startDate: '2026-02-15',
      endDate: '2026-05-15',
      status: '履行中',
      approvalStatus: '已批准',
      received: 135,
      receivable: 15,
      progress: 90,
    },
    {
      key: '5',
      contractNo: 'HT202603005',
      name: 'E公司小程序开发合同',
      customer: 'E零售公司',
      amount: 55,
      signDate: '2026-03-01',
      startDate: '2026-03-05',
      endDate: '2026-05-05',
      status: '已完成',
      approvalStatus: '已批准',
      received: 55,
      receivable: 0,
      progress: 100,
    },
  ];

  const statusMap = {
    履行中: 'processing',
    已完成: 'success',
    已终止: 'error',
  };

  const approvalStatusMap = {
    待审批: 'warning',
    已批准: 'success',
    已拒绝: 'error',
  };

  const columns = [
    { title: '合同编号', dataIndex: 'contractNo', width: 150 },
    {
      title: '合同名称',
      dataIndex: 'name',
      width: 220,
      render: (name: string) => <a style={{ color: 'rgb(var(--primary-6))' }}>{name}</a>,
    },
    { title: '客户名称', dataIndex: 'customer', width: 150 },
    {
      title: '合同金额',
      dataIndex: 'amount',
      width: 120,
      render: (amount: number) => `${amount}万`,
    },
    { title: '签订日期', dataIndex: 'signDate', width: 120 },
    { title: '开始日期', dataIndex: 'startDate', width: 120 },
    { title: '结束日期', dataIndex: 'endDate', width: 120 },
    {
      title: '合同状态',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Badge status={statusMap[status as keyof typeof statusMap]} text={status} />
      ),
    },
    {
      title: '审批状态',
      dataIndex: 'approvalStatus',
      width: 100,
      render: (status: string) => (
        <Badge
          status={approvalStatusMap[status as keyof typeof approvalStatusMap]}
          text={status}
        />
      ),
    },
    {
      title: '已收款',
      dataIndex: 'received',
      width: 100,
      render: (amount: number) => `${amount}万`,
    },
    {
      title: '待收款',
      dataIndex: 'receivable',
      width: 100,
      render: (amount: number) => `${amount}万`,
    },
    { title: '执行进度', dataIndex: 'progress', width: 100, render: (p: number) => `${p}%` },
    {
      title: '操作',
      width: 180,
      fixed: 'right' as const,
      render: (_, record: any) => (
        <Space>
          <Button
            key={`view-${record.key}`}
            type="text"
            icon={<IconEye />}
            size="small"
            onClick={() => navigate(`/contracts/${record.key}`)}
          >
            查看
          </Button>
          <Button key={`download-${record.key}`} type="text" icon={<IconDownload />} size="small">
            下载
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    form.validate().then((values) => {
      console.log(values);
      Message.success('合同创建成功');
      setVisible(false);
      form.resetFields();
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Title heading={4}>合同管理</Title>
        <Button type="primary" icon={<IconPlus />} onClick={() => setVisible(true)}>
          新建合同
        </Button>
      </div>

      <Card>
        <div className="flex gap-4" style={{ marginBottom: 16 }}>
          <Input
            style={{ width: 240 }}
            placeholder="搜索合同编号、名称"
            prefix={<IconSearch />}
          />
          <Select placeholder="合同状态" style={{ width: 160 }} allowClear>
            <Select.Option value="executing">履行中</Select.Option>
            <Select.Option value="completed">已完成</Select.Option>
            <Select.Option value="terminated">已终止</Select.Option>
          </Select>
          <Select placeholder="审批状态" style={{ width: 160 }} allowClear>
            <Select.Option value="pending">待审批</Select.Option>
            <Select.Option value="approved">已批准</Select.Option>
            <Select.Option value="rejected">已拒绝</Select.Option>
          </Select>
          <Button type="primary">搜索</Button>
        </div>

        <Table
          columns={columns}
          data={contracts}
          scroll={{ x: 1800 }}
          pagination={{
            total: 32,
            pageSize: 10,
            showTotal: true,
            showJumper: true,
          }}
        />
      </Card>

      <Modal
        title="新建合同"
        visible={visible}
        onOk={handleCreate}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        style={{ width: 720 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="合同名称"
            field="name"
            rules={[{ required: true, message: '请输入合同名称' }]}
          >
            <Input placeholder="请输入合同名称" />
          </Form.Item>

          <Form.Item
            label="关联客户"
            field="customer"
            rules={[{ required: true, message: '请选择关联客户' }]}
          >
            <Select placeholder="请选择客户" showSearch>
              <Select.Option value="1">北京科技有限公司</Select.Option>
              <Select.Option value="2">上海商贸公司</Select.Option>
              <Select.Option value="3">深圳电商公司</Select.Option>
              <Select.Option value="4">广州金融公司</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="关联线索"
            field="lead"
            rules={[{ required: true, message: '请选择关联线索' }]}
          >
            <Select placeholder="请选择线索" showSearch>
              <Select.Option value="1">APP开发需求</Select.Option>
              <Select.Option value="2">管理系统定制</Select.Option>
              <Select.Option value="3">小程序开发</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="合同金额（万元）"
            field="amount"
            rules={[{ required: true, message: '请输入合同金额' }]}
          >
            <InputNumber
              placeholder="请输入合同金额"
              style={{ width: '100%' }}
              min={0}
              precision={2}
            />
          </Form.Item>

          <Form.Item
            label="签订日期"
            field="signDate"
            rules={[{ required: true, message: '请选择签订日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="执行日期"
            field="executionDate"
            rules={[{ required: true, message: '请选择执行日期' }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="合同文件" field="file">
            <Upload
              drag
              tip="支持PDF、Word、图片格式，单个文件不超过10MB"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </Form.Item>

          <Form.Item label="交付类型" field="deliveryType" rules={[{ required: true, message: '请选择交付类型' }]}>
            <Select placeholder="请选择交付类型">
              {DELIVERY_TYPES.map((t) => <Select.Option key={t} value={t}>{t}</Select.Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="备注" field="remark">
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}