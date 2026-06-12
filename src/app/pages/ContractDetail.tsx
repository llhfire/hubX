import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  Card,
  Button,
  Descriptions,
  Tag,
  Timeline,
  Table,
  Progress,
  Space,
  Tabs,
  Avatar,
  Divider,
  Grid,
  Message,
} from '@arco-design/web-react';
import {
  IconLeft,
  IconEdit,
  IconDownload,
  IconUpload,
  IconLink,
  IconFile,
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconClockCircle,
} from '@arco-design/web-react/icon';

const { Row, Col } = Grid;
const TabPane = Tabs.TabPane;

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('electronic');

  // 模拟合同数据
  const contractData = {
    id: '1',
    contractNo: 'CT20260320001',
    contractName: '某科技公司年度框架协议',
    status: '履行中',
    signingEntity: '北京科技有限公司',
    salesPerson: '张三',
    department: '销售部',
    productCategory: '软件开发',
    signDate: '2026-03-20',
    effectiveDate: '2026-04-01',
    endDate: '2026-09-30',
    customerName: '某科技有限公司',
    customerContact: '李经理',
    customerPhone: '13800138000',
    customerTaxNo: '91110000MA01ABCD1E',
    totalAmount: 500000,
    receivedAmount: 300000,
    receivableAmount: 200000,
    receivedRate: 60,
    approvalFlow: [
      {
        step: '发起申请',
        approver: '张三 - 销售',
        status: 'approved',
        time: '2026-03-18 14:30',
        comment: '提交合同审批',
        duration: '0小时',
      },
      {
        step: '商务审核',
        approver: '王经理 - 商务主管',
        status: 'approved',
        time: '2026-03-18 16:20',
        comment: '合同条款符合规范，同意',
        duration: '1.8小时',
      },
      {
        step: '财务审核',
        approver: '陈财务 - 财务总监',
        status: 'approved',
        time: '2026-03-19 09:15',
        comment: '款项计划合理，批准',
        duration: '16.9小时',
      },
      {
        step: '法务审核',
        approver: '赵律师 - 法务部',
        status: 'approved',
        time: '2026-03-19 14:30',
        comment: '法律风险可控，通过',
        duration: '5.3小时',
      },
    ],
    paymentPlan: [
      {
        period: '第1期',
        expectedDate: '2026-04-15',
        percentage: 40,
        expectedAmount: 200000,
        actualDate: '2026-04-14',
        actualAmount: 200000,
        status: '已到账',
        overdue: false,
      },
      {
        period: '第2期',
        expectedDate: '2026-06-15',
        percentage: 30,
        expectedAmount: 150000,
        actualDate: '2026-06-16',
        actualAmount: 100000,
        status: '部分到账',
        overdue: true,
      },
      {
        period: '第3期',
        expectedDate: '2026-09-30',
        percentage: 30,
        expectedAmount: 150000,
        actualDate: '',
        actualAmount: 0,
        status: '未到账',
        overdue: false,
      },
    ],
    projectMilestones: [
      { name: '项目立项', completed: true, date: '2026-04-01' },
      { name: '需求调研', completed: true, date: '2026-04-15' },
      { name: '设计开发', completed: true, date: '2026-06-20' },
      { name: '测试验收', completed: false, date: '' },
      { name: '项目交付', completed: false, date: '' },
    ],
    recentLogs: [
      {
        id: '1',
        time: '2026-05-12 15:30',
        user: '财务部-王会计',
        action: '确认第二期回款到账',
        type: 'finance',
      },
      {
        id: '2',
        time: '2026-05-10 10:20',
        user: '项目经理-李工',
        action: '项目通过初验',
        type: 'project',
      },
      {
        id: '3',
        time: '2026-05-08 14:00',
        user: '张三',
        action: '上传了验收报告',
        type: 'document',
      },
      {
        id: '4',
        time: '2026-04-25 16:45',
        user: '张三',
        action: '修改了合同关联的报价明细',
        type: 'edit',
      },
    ],
    relatedDocs: [
      { id: '1', name: '报价单-QT20260315001.pdf', size: '1.2MB', type: 'quotation' },
      { id: '2', name: '验收报告.docx', size: '856KB', type: 'acceptance' },
      { id: '3', name: '发票存根-001.jpg', size: '2.1MB', type: 'invoice' },
    ],
  };

  const paymentColumns = [
    {
      title: '期数',
      dataIndex: 'period',
      width: 100,
    },
    {
      title: '预计回款日期',
      dataIndex: 'expectedDate',
      width: 130,
    },
    {
      title: '比例',
      dataIndex: 'percentage',
      width: 80,
      render: (val: number) => `${val}%`,
    },
    {
      title: '预计金额',
      dataIndex: 'expectedAmount',
      width: 120,
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: '实际回款日期',
      dataIndex: 'actualDate',
      width: 130,
      render: (val: string) => val || '-',
    },
    {
      title: '实际金额',
      dataIndex: 'actualAmount',
      width: 120,
      render: (val: number) => (val > 0 ? `¥${val.toLocaleString()}` : '-'),
    },
    {
      title: '核销状态',
      dataIndex: 'status',
      width: 120,
      render: (status: string, record: any) => {
        const colorMap: Record<string, string> = {
          已到账: 'green',
          部分到账: 'orange',
          未到账: 'gray',
        };
        return (
          <Space>
            <Tag color={colorMap[status]}>{status}</Tag>
            {record.overdue && <Tag color="red">超期</Tag>}
          </Space>
        );
      },
    },
  ];

  const getAvatarColor = (name: string) => {
    const colors = ['#165DFF', '#14C9C9', '#F7BA1E', '#F53F3F', '#722ED1'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div>
      {/* 顶部操作栏 */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button icon={<IconLeft />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{contractData.contractName}</span>
                <Tag
                  color={
                    contractData.status === '履行中'
                      ? 'arcoblue'
                      : contractData.status === '已结案'
                      ? 'green'
                      : 'red'
                  }
                  size="large"
                >
                  {contractData.status}
                </Tag>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 4 }}>
                合同编号：{contractData.contractNo}
              </div>
            </div>
          </div>
          <Space>
            <Button icon={<IconEdit />}>编辑</Button>
            <Button icon={<IconDownload />}>下载电子版</Button>
            <Button icon={<IconUpload />}>上传扫描件</Button>
            <Button type="primary" icon={<IconLink />}>
              关联项目
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={16}>
        {/* 左侧核心区 70% */}
        <Col span={17}>
          {/* 基础信息卡片 */}
          <Card title="基础信息" style={{ marginBottom: 16 }}>
            <Descriptions
              column={4}
              data={[
                { label: '签约主体', value: contractData.signingEntity },
                { label: '业务员', value: contractData.salesPerson },
                { label: '所属部门', value: contractData.department },
                { label: '产品类别', value: contractData.productCategory },
                { label: '签约日期', value: contractData.signDate },
                { label: '生效日期', value: contractData.effectiveDate },
                { label: '终止日期', value: contractData.endDate },
                { label: '', value: '' },
              ]}
            />

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ fontWeight: 600, marginBottom: 12 }}>甲方画像</div>
            <Descriptions
              column={4}
              data={[
                { label: '公司名称', value: contractData.customerName },
                { label: '联系人', value: contractData.customerContact },
                { label: '联系电话', value: contractData.customerPhone },
                { label: '税务登记号', value: contractData.customerTaxNo },
              ]}
            />
          </Card>

          {/* 合同文本查看器 */}
          <Card title="合同文本" style={{ marginBottom: 16 }}>
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <TabPane key="electronic" title="电子版合同">
                <div
                  style={{
                    background: '#f7f8fa',
                    padding: 40,
                    minHeight: 400,
                    borderRadius: 6,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <IconFile style={{ fontSize: 64, color: 'var(--color-text-3)' }} />
                  <div style={{ marginTop: 16, fontSize: 14, color: 'var(--color-text-2)' }}>
                    PDF 预览区域
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-3)' }}>
                    嵌入式 PDF 预览器，展示系统生成的带水印/签章版本
                  </div>
                </div>
              </TabPane>
              <TabPane key="scan" title="纸质扫描件">
                <div
                  style={{
                    background: '#f7f8fa',
                    padding: 40,
                    minHeight: 400,
                    borderRadius: 6,
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <IconUpload style={{ fontSize: 64, color: 'var(--color-text-3)' }} />
                  <div style={{ marginTop: 16, fontSize: 14, color: 'var(--color-text-2)' }}>
                    暂无扫描件
                  </div>
                  <Button type="primary" style={{ marginTop: 16 }} icon={<IconUpload />}>
                    上传盖章回传件
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Card>

          {/* 审批记录 */}
          <Card title="审批记录" style={{ marginBottom: 16 }}>
            <Timeline>
              {contractData.approvalFlow.map((node, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    node.status === 'approved' ? (
                      <IconCheckCircleFill style={{ fontSize: 16, color: 'rgb(var(--green-6))' }} />
                    ) : node.status === 'rejected' ? (
                      <IconCloseCircleFill style={{ fontSize: 16, color: 'rgb(var(--red-6))' }} />
                    ) : (
                      <IconClockCircle style={{ fontSize: 16, color: 'rgb(var(--orange-6))' }} />
                    )
                  }
                >
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{node.step}</span>
                    <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--color-text-3)' }}>
                      {node.time}
                    </span>
                    <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--color-text-3)' }}>
                      耗时: {node.duration}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-2)', marginBottom: 4 }}>
                    审批人：{node.approver}
                  </div>
                  {node.comment && (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--color-text-2)',
                        padding: '6px 10px',
                        background: 'var(--color-fill-2)',
                        borderRadius: 4,
                        marginTop: 4,
                      }}
                    >
                      {node.comment}
                    </div>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>

          {/* 合同款项与回款计划 */}
          <Card title="款项与回款计划" style={{ marginBottom: 16 }}>
            {/* 数据汇总 */}
            <div
              style={{
                background: 'var(--color-fill-2)',
                padding: 16,
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                    合同总额
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>
                    ¥{contractData.totalAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                    已回款金额
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--success-6))' }}>
                    ¥{contractData.receivedAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                    待回款金额
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>
                    ¥{contractData.receivableAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                    到账率
                  </div>
                  <Progress
                    percent={contractData.receivedRate}
                    color={contractData.receivedRate >= 80 ? '#00b42a' : '#f77234'}
                    style={{ marginTop: 8 }}
                  />
                </Col>
              </Row>
            </div>

            {/* 明细表格 */}
            <Table
              columns={paymentColumns}
              data={contractData.paymentPlan}
              pagination={false}
              rowKey="period"
            />
          </Card>
        </Col>

        {/* 右侧动态侧边栏 30% */}
        <Col span={7}>
          {/* 项目关键里程碑 */}
          <Card title="项目里程碑" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              {contractData.projectMilestones.map((milestone, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom:
                      index < contractData.projectMilestones.length - 1
                        ? '1px solid var(--color-border-2)'
                        : 'none',
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: milestone.completed
                        ? 'rgb(var(--green-6))'
                        : 'var(--color-border-3)',
                      marginRight: 12,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: milestone.completed
                          ? 'var(--color-text-1)'
                          : 'var(--color-text-3)',
                      }}
                    >
                      {milestone.name}
                    </div>
                    {milestone.date && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 2 }}>
                        {milestone.date}
                      </div>
                    )}
                  </div>
                  {milestone.completed && (
                    <IconCheckCircleFill
                      style={{ fontSize: 16, color: 'rgb(var(--green-6))' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 13,
                color: '#003a8c',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>最近动态</div>
              <div>• 2026-05-10 项目通过初验</div>
              <div>• 2026-05-12 上传了《验收报告》</div>
            </div>
          </Card>

          {/* 重点日志 */}
          <Card title="重点日志" style={{ marginBottom: 16 }}>
            <div>
              {contractData.recentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: '1px solid var(--color-border-2)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <Avatar
                      size={24}
                      style={{
                        background: getAvatarColor(log.user),
                        fontSize: 12,
                        marginRight: 8,
                      }}
                    >
                      {log.user.slice(0, 1)}
                    </Avatar>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{log.user}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-2)', marginLeft: 32 }}>
                    {log.action}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--color-text-3)',
                      marginTop: 2,
                      marginLeft: 32,
                    }}
                  >
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 关联文档 */}
          <Card title="关联文档">
            <div>
              {contractData.relatedDocs.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'var(--color-fill-2)',
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <IconFile style={{ fontSize: 16, color: 'rgb(var(--primary-6))', marginRight: 8 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--color-text-1)' }}>{doc.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{doc.size}</div>
                    </div>
                  </div>
                  <Button
                    type="text"
                    size="mini"
                    icon={<IconDownload />}
                    onClick={() => Message.info(`下载：${doc.name}`)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
