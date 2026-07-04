import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import {
  Card,
  Descriptions,
  Badge,
  Button,
  Timeline,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Message,
  Tabs,
  Grid,
  Tag,
  Divider,
  Upload,
  Alert,
} from '@arco-design/web-react';
import { useReminders } from '@/app/reminders/ReminderContext';
import {
  IconLeft,
  IconEdit,
  IconPhone,
  IconMessage,
  IconUser,
  IconUserAdd,
  IconSwap,
  IconPlus,
  IconSearch,
  IconUpload,
  IconDelete,
  IconReply,
  IconEye,
} from '@arco-design/web-react/icon';

const { Title, Text: ArcoText } = Typography;
const TabPane = Tabs.TabPane;
const { Row, Col } = Grid;
const FormItem = Form.Item;

export function normalizeLeadReminderId(id?: string) {
  if (!id) {
    return '';
  }
  return id.startsWith('lead-') ? id : `lead-${id}`;
}

export function LeadDetail() {
  const { id } = useParams();
  const leadReminderId = normalizeLeadReminderId(id);
  const { isLeadReminderActive } = useReminders();
  const hasLeadReminder = isLeadReminderActive(leadReminderId);
  const navigate = useNavigate();
  const location = useLocation();
  const from = ((location?.state as any)?.from) || 'my'; // 默认为我的线索
  const [followVisible, setFollowVisible] = useState(false);
  const [bindCustomerVisible, setBindCustomerVisible] = useState(false);
  const [editLeadVisible, setEditLeadVisible] = useState(false);
  const [customTagVisible, setCustomTagVisible] = useState(false);
  const [trashVisible, setTrashVisible] = useState(false);
  const [returnPublicVisible, setReturnPublicVisible] = useState(false);
  const [quotationEditVisible, setQuotationEditVisible] = useState(false);
  const [travelModalVisible, setTravelModalVisible] = useState(false);
  const [reimbursementModalVisible, setReimbursementModalVisible] = useState(false);
  const [paymentPeriodVisible, setPaymentPeriodVisible] = useState(false);
  const [paymentEditVisible, setPaymentEditVisible] = useState(false);
  const [invoiceEditVisible, setInvoiceEditVisible] = useState(false);
  const [paymentPeriods, setPaymentPeriods] = useState<number>(2);
  const [rightTabKey, setRightTabKey] = useState('follow');
  const [paymentRecords, setPaymentRecords] = useState([
    {
      id: '1',
      period: '一期',
      name: '首期款',
      expectedAmount: '204,000',
      expectedDate: '2026-04-15',
      actualDate: '2026-04-14',
      status: '已到账',
      overdueDays: 0,
      voucher: '回款凭证1.jpg',
      invoiceStatus: '已开票',
      taxRate: '6%',
      invoiceDate: '2026-04-16',
      taxAmount: '12,240',
      invoiceVoucher: '发票1.pdf',
      paymentMethod: '公对公',
    },
    {
      id: '2',
      period: '二期',
      name: '周期款',
      expectedAmount: '204,000',
      expectedDate: '2026-05-15',
      actualDate: '',
      status: '未到账',
      overdueDays: 0,
      voucher: '',
      invoiceStatus: '未开票',
      taxRate: '6%',
      invoiceDate: '',
      taxAmount: '12,240',
      invoiceVoucher: '',
      paymentMethod: '公对公',
    },
  ]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState(['APP', '小程序', '管理系统', '官网', '电商系统', 'CMS', 'OA系统']);
  const [form] = Form.useForm();
  const [bindCustomerForm] = Form.useForm();
  const [editLeadForm] = Form.useForm();
  const [customTagForm] = Form.useForm();
  const [quotationForm] = Form.useForm();
  const [travelForm] = Form.useForm();
  const [reimbursementForm] = Form.useForm();
  const [paymentPeriodForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [invoiceForm] = Form.useForm();
  const [trashForm] = Form.useForm();
  const [customerSearchKeyword, setCustomerSearchKeyword] = useState('');
  const [expenseItems, setExpenseItems] = useState([
    { id: 1, category: '', description: '', amount: '' },
  ]);

  const leadInfo = {
    name: '某科技公司APP开发需求',
    customer: '北京科技有限公司',
    contact: '张经理',
    phone: '13800138000',
    wechat: '13800138000',
    source: '百度推广',
    keyword: 'APP开发',
    level: '高',
    intention: '强烈',
    status: '需求调研',
    tags: ['APP', '移动应用'],
    requirement: '需要开发一款企业内部管理APP，支持iOS和Android双平台，包含考勤、审批、通知等功能模块。',
    createTime: '2026-03-25 10:30:00',
    updateTime: '2026-04-09 10:30:00',
    claimTime: '2026-03-25 11:20:00',
    lastFollowTime: '2026-04-09 10:30:00',
    owner: '张三',
    entity: '中科软艺',
    agent: '巴蜀文攻',
    followCount: 8,
    daysHeld: 15,
  };

  const followHistory = [
    {
      time: '2026-04-09',
      method: '电话',
      effect: '今天 17:42',
      content: '初步接定',
      operator: '张三',
      attachments: [
        { id: 'follow-1-1', name: '会议纪要.pdf', size: '1.2MB' },
        { id: 'follow-1-2', name: '需求截图.png', size: '456KB' },
      ],
    },
    {
      time: '2026-04-07',
      method: '电话',
      effect: '今天 17:42',
      content: '未接通',
      operator: '张三',
      attachments: [],
    },
    {
      time: '2026-04-05',
      method: '认领',
      effect: '未接通',
      content: '',
      operator: '张三',
      attachments: [],
    },
  ];

  const quotationHistory = [
    {
      id: '1',
      name: 'APP开发项目报价方案V2',
      status: '已报价',
      period: '3个月',
      operator: '张三',
      entity: '中科软艺',
      amount: '680,000',
      cost: '450,000',
      profit: '230,000',
      file: 'APP开发报价单V2.xlsx',
      flowStatus: '已审核',
      createTime: '2026-04-10 14:30',
      approvalFlow: [
        { step: '发起申请', approver: '张三', status: 'approved', time: '2026-04-10 14:30', comment: '' },
        { step: '商务初审', approver: '王经理 - 商务主管', status: 'approved', time: '2026-04-10 16:20', comment: '项目背景属实，支持该折扣' },
        { step: '财务审核', approver: '陈财务 - 财务总监', status: 'approved', time: '2026-04-11 09:15', comment: '毛利率符合标准，准予报价' },
      ],
    },
    {
      id: '2',
      name: 'APP开发项目初步报价',
      status: '未报价',
      period: '4个月',
      operator: '李四',
      entity: '软艺信息',
      amount: '750,000',
      cost: '500,000',
      profit: '250,000',
      file: 'APP开发初步报价.xlsx',
      flowStatus: '已审核',
      createTime: '2026-04-05 10:20',
      approvalFlow: [
        { step: '发起申请', approver: '李四', status: 'approved', time: '2026-04-05 10:20', comment: '' },
        { step: '商务初审', approver: '王经理 - 商务主管', status: 'approved', time: '2026-04-05 14:30', comment: '项目背景合理' },
        { step: '财务审核', approver: '陈财务 - 财务总监', status: 'rejected', time: '2026-04-05 16:00', comment: '该线索目前的运营成本已超支，且折扣已低于公司基准毛利（30%），请重新核算或申请特批。' },
        { step: '总经理特批', approver: '赵总 - 总经理', status: 'pending', time: '', comment: '' },
      ],
    },
  ];

  const travelApplications = [
    {
      id: '1',
      applicant: '张三',
      department: '销售部',
      destination: '北京',
      startDate: '2026-04-15',
      endDate: '2026-04-17',
      duration: '3天',
      estimatedCost: '3,500',
      purpose: '客户需求调研及方案沟通',
      approver: '李经理',
      status: '已审批',
      createTime: '2026-04-08 09:30',
      approvalFlow: [
        { step: '发起申请', approver: '张三', status: 'approved', time: '2026-04-08 09:30', comment: '' },
        { step: '初审', approver: '张三 - 部门经理', status: 'approved', time: '2026-04-08 15:20', comment: '同意出差' },
        { step: '终审', approver: '王五 - 财务审核', status: 'approved', time: '2026-04-09 10:15', comment: '费用合理，准予出差' },
      ],
    },
    {
      id: '2',
      applicant: '李四',
      department: '技术部',
      destination: '上海',
      startDate: '2026-04-20',
      endDate: '2026-04-22',
      duration: '3天',
      estimatedCost: '4,200',
      purpose: '技术交流与项目实施',
      approver: '王总监',
      status: '待审批',
      createTime: '2026-04-10 14:20',
      approvalFlow: [
        { step: '发起申请', approver: '李四', status: 'approved', time: '2026-04-10 14:20', comment: '' },
        { step: '初审', approver: '张三 - 部门经理', status: 'rejected', time: '2026-04-10 16:45', comment: '本次出差费用预算填报有误，招待费占比过高，请按照公司最新差旅标准核减后再报。' },
        { step: '终审', approver: '王五 - 财务审核', status: 'pending', time: '', comment: '' },
      ],
    },
  ];

  const reimbursementApplications = [
    {
      id: '1',
      applicant: '张三',
      department: '销售部',
      expenseType: '差旅费',
      invoiceAmount: '1,200',
      reimbursementAmount: '1,200',
      invoiceTitle: '北京科技有限公司',
      taxNumber: '91110000XXXXXXXXXX',
      invoiceType: '增值税专用发票',
      approver: '李经理',
      attachments: [
        { id: 'att-1-1', name: '发票.pdf', size: '856KB' },
        { id: 'att-1-2', name: '行程单.jpg', size: '1.2MB' },
      ],
      status: '已报销',
      createTime: '2026-04-12 16:20',
      approvalFlow: [
        { step: '发起申请', approver: '张三', status: 'approved', time: '2026-04-12 16:20', comment: '' },
        { step: '初审', approver: '张三 - 部门经理', status: 'approved', time: '2026-04-13 09:30', comment: '费用合理，同意报销' },
        { step: '终审', approver: '王五 - 财务审核', status: 'approved', time: '2026-04-13 14:20', comment: '发票真实有效，准予报销' },
      ],
    },
    {
      id: '2',
      applicant: '李四',
      department: '技术部',
      expenseType: '招待费',
      invoiceAmount: '3,500',
      reimbursementAmount: '3,200',
      invoiceTitle: '上海商贸公司',
      taxNumber: '91310000YYYYYYYYYY',
      invoiceType: '增值税普通发票',
      approver: '王总监',
      attachments: [
        { id: 'att-2-1', name: '餐饮发票.pdf', size: '652KB' },
      ],
      status: '审批中',
      createTime: '2026-04-10 11:15',
      approvalFlow: [
        { step: '发起申请', approver: '李四', status: 'approved', time: '2026-04-10 11:15', comment: '' },
        { step: '初审', approver: '张三 - 部门经理', status: 'pending', time: '', comment: '' },
        { step: '终审', approver: '王五 - 财务审核', status: 'pending', time: '', comment: '' },
      ],
    },
  ];

  const contractSummary = {
    totalAmount: '680,000',
    receivedAmount: '408,000',
    pendingAmount: '272,000',
    invoicedAmount: '680,000',
    rdCost: '280,000',
    businessCost: '45,000',
    otherCost: '15,000',
    outsourcingCost: '80,000',
  };

  const contracts = [
    {
      id: '1',
      name: 'APP开发项目合同',
      contractNo: 'ZKRY202604080001',
      startDate: '2026-04-08',
      contractEntity: '中科软艺',
      signingEntity: '北京科技有限公司',
      amount: '680,000',
      receivedAmount: '408,000',
      paymentMethod: '对公转账',
      totalCost: '420,000',
      signer: '张三',
      status: '执行中',
      createTime: '2026-04-08 10:30',
    },
  ];


  const customerList = [
    { id: '1', name: '北京科技有限公司', contact: '张经理', phone: '13800138000' },
    { id: '2', name: '上海商贸公司', contact: '李总', phone: '13900139000' },
    { id: '3', name: '深圳电商公司', contact: '王总', phone: '13600136000' },
    { id: '4', name: '广州金融公司', contact: '赵经理', phone: '13700137000' },
  ];

  const filteredCustomers = customerSearchKeyword
    ? customerList.filter(
        (customer) =>
          customer.name.includes(customerSearchKeyword) ||
          customer.contact.includes(customerSearchKeyword) ||
          customer.phone.includes(customerSearchKeyword)
      )
    : customerList;

  const handleFollow = () => {
    form.validate().then((values) => {
      console.log(values);
      Message.success('跟进记录已保存');
      setFollowVisible(false);
      form.resetFields();
    });
  };

  const handleBindCustomer = () => {
    bindCustomerForm.validate().then((values) => {
      console.log(values);
      Message.success('客户主体绑定成功');
      setBindCustomerVisible(false);
      bindCustomerForm.resetFields();
      setCustomerSearchKeyword('');
    });
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    customTagForm.validate().then((values) => {
      const newTag = values.tagName.trim();
      if (newTag && !availableTags.includes(newTag)) {
        setAvailableTags([...availableTags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
        Message.success('标签添加成功');
      } else if (availableTags.includes(newTag)) {
        Message.warning('标签已存在');
      }
      setCustomTagVisible(false);
      customTagForm.resetFields();
    });
  };

  const handleEditLead = () => {
    // 预填充当前线索数据
    setSelectedTags(leadInfo.tags);
    editLeadForm.setFieldsValue({
      name: leadInfo.name,
      contact: leadInfo.contact,
      phone: leadInfo.phone,
      wechat: leadInfo.wechat,
      source: leadInfo.source,
      keyword: leadInfo.keyword,
      level: leadInfo.level,
      entity: leadInfo.entity,
      status: leadInfo.status,
      requirement: leadInfo.requirement,
    });
    setEditLeadVisible(true);
  };

  const handleEditLeadSubmit = () => {
    editLeadForm.setFieldValue('tags', selectedTags);
    editLeadForm.validate().then((values) => {
      console.log(values);
      Message.success('线索更新成功');
      setEditLeadVisible(false);
      editLeadForm.resetFields();
      setSelectedTags([]);
    });
  };

  const handleClaim = () => {
    Message.success('线索认领成功');
  };

  const handleTransfer = () => {
    Message.info('转让功能开发中');
  };

  const handleAbandon = () => {
    Modal.confirm({
      title: '确认放弃线索?',
      content: '放弃后线索将回到公海线索',
      onOk: () => {
        Message.success('已放弃线索');
        navigate('/leads/public');
      },
    });
  };

  const handleMarkAsTrash = () => {
    setTrashVisible(true);
  };

  const handleTrashSubmit = () => {
    trashForm.validate().then(() => {
      Message.success('已标记为垃圾线索');
      setTrashVisible(false);
      trashForm.resetFields();
      navigate('/leads/trash');
    });
  };

  const handleReturnToPublic = () => {
    Modal.confirm({
      title: '确认扔回公海?',
      content: '线索将回到公海线索，其他人可以认领',
      onOk: () => {
        Message.success('已扔回公海线索');
        navigate('/leads/public');
      },
    });
  };

  const handleAddPaymentPeriod = () => {
    const periodNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const newPeriodNumber = paymentRecords.length + 1;
    const newPeriod = {
      id: String(newPeriodNumber),
      period: `${periodNames[newPeriodNumber - 1] || newPeriodNumber}期`,
      name: '周期款',
      expectedAmount: '204,000',
      expectedDate: '',
      actualDate: '',
      status: '未到账',
      overdueDays: 0,
      voucher: '',
      invoiceStatus: '未开票',
      taxRate: '6%',
      invoiceDate: '',
      taxAmount: '12,240',
      invoiceVoucher: '',
      paymentMethod: '公对公',
    };
    setPaymentRecords([...paymentRecords, newPeriod]);
    Message.success(`已添加${newPeriod.period}`);
  };

  const handleResetPaymentPeriods = () => {
    if (paymentPeriods > 0) {
      Modal.confirm({
        title: '确认重设回款期数?',
        content: '重设期数将清空所有现有的回款与发票记录，此操作不可撤销。确定要继续吗？',
        okText: '确定重设',
        cancelText: '取消',
        okButtonProps: {
          status: 'warning'
        },
        onOk: () => {
          setPaymentPeriodVisible(true);
        }
      });
    } else {
      setPaymentPeriodVisible(true);
    }
  };

  const handleInitializePaymentPeriods = () => {
    paymentPeriodForm.validate().then((values) => {
      const periodCount = values.periods === 'custom' ? parseInt(values.customPeriods) : parseInt(values.periods);
      const periodNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

      // 生成空白期数记录
      const newRecords = Array.from({ length: periodCount }, (_, index) => ({
        id: String(index + 1),
        period: `${periodNames[index] || (index + 1)}期`,
        name: index === 0 ? '首期款' : (index === periodCount - 1 ? '尾款' : '周期款'),
        expectedAmount: '',
        expectedDate: '',
        actualDate: '',
        status: '未到账',
        overdueDays: 0,
        voucher: '',
        invoiceStatus: '未开票',
        taxRate: '6%',
        invoiceDate: '',
        taxAmount: '',
        invoiceVoucher: '',
        paymentMethod: '公对公',
      }));

      setPaymentRecords(newRecords);
      setPaymentPeriods(periodCount);
      Message.success(`已${paymentPeriods > 0 ? '重设' : '初始化'}回款期数为${periodCount}期`);
      setPaymentPeriodVisible(false);
      paymentPeriodForm.resetFields();
    });
  };

  return (
    <div>
      <Row gutter={16}>
        {/* Left side - Main content */}
        <Col span={16}>
          <Card style={{ marginBottom: 16 }}>
            <Space style={{ marginBottom: 16 }}>
              <Button key="back" type="text" size="small" icon={<IconLeft />} onClick={() => navigate(-1)}>
                返回
              </Button>
              {from === 'public' && [
                <Button key="public-claim" type="primary" size="small" icon={<IconUserAdd />} onClick={handleClaim}>
                  认领
                </Button>,
                <Button key="public-edit" size="small" icon={<IconEdit />} onClick={handleEditLead}>
                  编辑
                </Button>,
                <Button key="public-transfer" size="small" icon={<IconSwap />} onClick={handleTransfer}>
                  转给他人
                </Button>,
                <Button key="public-trash" size="small" status="danger" icon={<IconDelete />} onClick={handleMarkAsTrash}>
                  标记为垃圾
                </Button>
              ]}
              {from === 'trash' && [
                <Button key="trash-edit" size="small" icon={<IconEdit />} onClick={handleEditLead}>
                  编辑
                </Button>,
                <Button key="trash-transfer" size="small" icon={<IconSwap />} onClick={handleTransfer}>
                  转给他人
                </Button>,
                <Button key="trash-return" size="small" type="primary" icon={<IconReply />} onClick={handleReturnToPublic}>
                  扔回公海
                </Button>
              ]}
              {from !== 'public' && from !== 'trash' && [
                <Button key="my-edit" size="small" icon={<IconEdit />} onClick={handleEditLead}>
                  编辑
                </Button>,
                <Button key="my-transfer" size="small" icon={<IconSwap />} onClick={handleTransfer}>
                  转移给他人
                </Button>,
                <Button key="my-return" size="small" icon={<IconReply />} onClick={handleReturnToPublic}>
                  扔回公海
                </Button>,
                <Button key="my-trash" size="small" status="danger" icon={<IconDelete />} onClick={handleMarkAsTrash}>
                  标记为垃圾
                </Button>
              ]}
            </Space>

            {hasLeadReminder ? (
              <Alert
                type="warning"
                closable={false}
                showIcon
                content="该线索已超过跟进时间且尚未填写新的跟进记录，请优先处理。"
              />
            ) : null}

            <div>
              <Title heading={5} style={{ marginBottom: 8 }}>基本信息</Title>
              <Descriptions
                column={2}
                labelStyle={{ width: 100 }}
                data={[
                  { label: '线索名称', value: leadInfo.name },
                  { label: '联系方式', value: leadInfo.phone },
                  { label: '联系人', value: leadInfo.contact },
                  { label: '微信', value: leadInfo.wechat },
                  { label: '创建时间', value: leadInfo.createTime },
                ]}
              />
            </div>
          </Card>

          <Card>
            <Tabs defaultActiveTab="basic">
              <TabPane key="basic" title="基础信息">
                <div style={{ padding: '16px 0' }}>
                  <Descriptions
                    column={2}
                    labelStyle={{ width: 120 }}
                    data={[
                      { label: '推广关键词', value: leadInfo.keyword },
                      { label: '客户来源', value: leadInfo.source },
                      { label: '所属人', value: from === 'public' ? '未认领' : leadInfo.owner },
                      { label: '客户意向', value: leadInfo.intention },
                      { label: '跟进状态', value: leadInfo.status },
                      { label: '最近一次跟进时间', value: leadInfo.lastFollowTime },
                      { label: '当前主体', value: leadInfo.entity },
                      {
                        label: '线索标签',
                        value: (
                          <Space>
                            {leadInfo.tags.map((tag, index) => (
                              <Tag key={index} color="arcoblue" size="small">
                                {tag}
                              </Tag>
                            ))}
                          </Space>
                        )
                      },
                      { label: '客户需求', value: leadInfo.requirement },
                    ]}
                  />

                  <Divider orientation="left" style={{ marginTop: 24 }}>附件列表</Divider>
                  <div style={{ padding: '8px 0' }}>
                    {(() => {
                      const attachments = [
                        { id: 'basic-att-1', name: '需求文档.pdf', size: '2.3MB', uploadTime: '2026-04-08 10:30' },
                        { id: 'basic-att-2', name: '参考案例.jpg', size: '856KB', uploadTime: '2026-04-08 10:32' },
                      ];

                      return attachments.length > 0 ? (
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {attachments.map((file) => (
                            <div
                              key={file.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: 'var(--color-fill-2)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-fill-3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--color-fill-2)';
                              }}
                            >
                              <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 500, marginBottom: 4 }}>{file.name}</div>
                                <div style={{ fontSize: '12px', color: 'var(--color-text-3)' }}>
                                  {file.size} · {file.uploadTime}
                                </div>
                              </div>
                              <Button
                                type="primary"
                                size="small"
                                onClick={() => Message.info(`下载文件: ${file.name}`)}
                              >
                                下载
                              </Button>
                            </div>
                          ))}
                        </Space>
                      ) : (
                        <div style={{ color: 'var(--color-text-3)' }}>暂无附件</div>
                      );
                    })()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 24 }}>
                    <Divider orientation="left" style={{ margin: 0, flex: 1 }}>客户主体信息</Divider>
                    <Button size="small" type="primary" onClick={() => setBindCustomerVisible(true)} style={{ marginLeft: 16 }}>
                      绑定客户主体
                    </Button>
                  </div>
                  <Descriptions
                    column={2}
                    labelStyle={{ width: 120 }}
                    style={{ marginTop: 16 }}
                    data={[
                      { label: '主体名称', value: '武汉某某' },
                      { label: '主体全称', value: '武汉某某科技有限公司' },
                      { label: '通讯地址', value: '湖北省武汉市洪山区光谷软件园D座 10-5' },
                      { label: '公司电话', value: '7801565768' },
                      { label: '电子邮箱', value: '7801565768@qq.com' },
                    ]}
                  />
                </div>
              </TabPane>

              <TabPane key="contracts" title={`合同记录 (${contracts.length})`}>
                <div style={{ padding: '16px 0' }}>
                  {/* 合同金额汇总 */}
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }}>合同金额汇总</div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(var(--primary-1), 0.3) 0%, rgba(var(--primary-2), 0.5) 100%)',
                      borderRadius: 8,
                      padding: '20px',
                      border: '1px solid var(--color-border-1)'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>合同总额</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>¥{contractSummary.totalAmount}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>到账金额</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--success-6))' }}>¥{contractSummary.receivedAmount}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>待收款金额</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contractSummary.pendingAmount}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>已开票金额</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--arcoblue-6))' }}>¥{contractSummary.invoicedAmount}</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 成本费用汇总 */}
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ marginBottom: 12, fontWeight: 600, fontSize: 15 }}>成本费用汇总</div>
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(var(--orange-1), 0.3) 0%, rgba(var(--orange-2), 0.5) 100%)',
                      borderRadius: 8,
                      padding: '20px',
                      border: '1px solid var(--color-border-1)'
                    }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>研发成本</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contractSummary.rdCost}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>商务成本</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contractSummary.businessCost}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>其他成本</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contractSummary.otherCost}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>外包成本</div>
                          <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contractSummary.outsourcingCost}</div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 合同详细信息 */}
                </div>
              </TabPane>

              <TabPane key="payments" title={`回款与发票 (${paymentRecords.length})`}>
                <div style={{ padding: '16px 0' }}>
                  {paymentPeriods === 0 ? (
                    <Card>
                      <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ marginBottom: 16, fontSize: 15, color: 'var(--color-text-2)' }}>
                          请先初始化回款期数
                        </div>
                        <Button type="primary" onClick={handleResetPaymentPeriods}>
                          初始化回款期数
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    <Space direction="vertical" style={{ width: '100%' }} size="medium">
                      {/* 财务汇总 */}
                      <Card>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '20px',
                          padding: '10px 0'
                        }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>合同总额</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--arcoblue-6))' }}>¥510,000</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>到账金额</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--success-6))' }}>¥204,000</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>待收款金额</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--warning-6))' }}>¥306,000</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginBottom: 8 }}>已开票金额</div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'rgb(var(--purple-6))' }}>¥216,240</div>
                          </div>
                        </div>
                      </Card>

                      {/* 回款时间轴 */}
                      <Card 
                        title="回款计划与实际"
                        extra={
                          <Space size="small">
                            <Button size="small" onClick={handleAddPaymentPeriod}>
                              添加期数
                            </Button>
                            <Button size="small" onClick={handleResetPaymentPeriods}>
                              重设期数
                            </Button>
                          </Space>
                        }
                      >
                        <Timeline>
                          {paymentRecords.map((payment) => (
                            <Timeline.Item
                              key={payment.id}
                              dot={
                                <div style={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: payment.status === '已到账' ? 'rgb(var(--success-6))' : 'rgb(var(--warning-6))',
                                  border: '2px solid white',
                                  boxShadow: '0 0 0 2px currentColor'
                                }} />
                              }
                            >
                              <div style={{ paddingBottom: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                  <span style={{ fontWeight: 600, fontSize: 15 }}>{payment.period} - {payment.name}</span>
                                  <Tag color={payment.status === '已到账' ? 'green' : 'orange'} size="small">
                                    {payment.status}
                                  </Tag>
                                  {payment.invoiceStatus && (
                                    <Tag color={payment.invoiceStatus === '已开票' ? 'arcoblue' : 'gray'} size="small">
                                      {payment.invoiceStatus}
                                    </Tag>
                                  )}
                                </div>

                                <div style={{
                                  background: 'var(--color-fill-2)',
                                  borderRadius: 6,
                                  padding: '12px 16px',
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(2, 1fr)',
                                  gap: '12px',
                                  fontSize: 13
                                }}>
                                  <div>
                                    <span style={{ color: 'var(--color-text-3)' }}>计划回款：</span>
                                    <span style={{ fontWeight: 600, color: 'rgb(var(--arcoblue-6))' }}>¥{payment.expectedAmount}</span>
                                    <span style={{ color: 'var(--color-text-3)', marginLeft: 8 }}>({payment.expectedDate})</span>
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--color-text-3)' }}>实际回款：</span>
                                    <span style={{ fontWeight: 600, color: 'rgb(var(--success-6))' }}>
                                      {payment.actualDate ? `¥${payment.expectedAmount}` : '-'}
                                    </span>
                                    {payment.actualDate && (
                                      <span style={{ color: 'var(--color-text-3)', marginLeft: 8 }}>({payment.actualDate})</span>
                                    )}
                                    {payment.overdueDays > 0 && (
                                      <Tag color="red" size="small" style={{ marginLeft: 8 }}>逾期{payment.overdueDays}天</Tag>
                                    )}
                                  </div>
                                  <div>
                                    <span style={{ color: 'var(--color-text-3)' }}>收款方式：</span>
                                    <span style={{ fontWeight: 500 }}>{payment.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      </Card>
                    </Space>
                  )}
                </div>
              </TabPane>

              <TabPane key="deprecated" title={`已废弃记录 (3)`}>
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-3)' }}>
                  暂无废弃记录
                </div>
              </TabPane>

              <TabPane key="documents" title={`项目文档 (4)`}>
                <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--color-text-3)' }}>
                  暂无项目文档
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </Col>

        {/* Right side - Follow-up records and related tabs */}
        <Col span={8}>
          <Tabs activeTab={rightTabKey} onChange={setRightTabKey} type="card-gutter">
            <TabPane key="follow" title={`跟进记录 (${followHistory.length})`}>
              <Card
                bordered={false}
                extra={
                  <Button type="primary" size="small" icon={<IconPlus />} onClick={() => setFollowVisible(true)}>
                    记录
                  </Button>
                }
              >
                <Timeline>
                  {followHistory.map((item, index) => (
                    <Timeline.Item
                      key={index}
                      dotColor={index === 0 ? 'rgb(var(--primary-6))' : 'var(--color-border-2)'}
                    >
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Space>
                            <Tag key={`tag-${index}`} color="blue" size="small">跟进方式: {item.method}</Tag>
                            <ArcoText key={`text-${index}`} type="secondary" style={{ fontSize: 12 }}>
                              {item.effect}
                            </ArcoText>
                          </Space>
                        </div>
                        {item.content && (
                          <div style={{ color: 'var(--color-text-1)', marginBottom: 4 }}>
                            {item.content}
                          </div>
                        )}
                        {item.attachments && item.attachments.length > 0 && (
                          <div style={{ marginTop: 8, marginBottom: 8 }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                              {item.attachments.map((file: any) => (
                                <div
                                  key={file.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '6px 10px',
                                    background: 'var(--color-fill-2)',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                  }}
                                >
                                  <div style={{ flex: 1 }}>
                                    <span style={{ fontWeight: 500 }}>{file.name}</span>
                                    <span style={{ marginLeft: 8, color: 'var(--color-text-3)', fontSize: '12px' }}>
                                      {file.size}
                                    </span>
                                  </div>
                                  <Button
                                    type="text"
                                    size="mini"
                                    onClick={() => Message.info(`下载文件: ${file.name}`)}
                                  >
                                    下载
                                  </Button>
                                </div>
                              ))}
                            </Space>
                          </div>
                        )}
                        <div style={{ color: 'var(--color-text-3)', fontSize: 12 }}>
                          操作人: {item.operator}
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </TabPane>

            <TabPane key="quotation" title={`报价 (${quotationHistory.length})`}>
              <Card
                bordered={false}
                extra={
                  <Button type="primary" size="small" icon={<IconPlus />} onClick={() => setQuotationEditVisible(true)}>
                    报价
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="medium">
                  {quotationHistory.map((item) => (
                    <div key={item.id} style={{
                      padding: '20px',
                      background: 'linear-gradient(135deg, var(--color-fill-1) 0%, var(--color-fill-2) 100%)',
                      borderRadius: 8,
                      border: '1px solid var(--color-border-2)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, color: 'var(--color-text-1)' }}>{item.name}</div>
                          <ArcoText type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>生成时间：{item.createTime}</ArcoText>
                          <Space size="small">
                            <Tag color={item.status === '已报价' ? 'green' : 'orange'}>{item.status}</Tag>
                            <Tag color={item.flowStatus === '已审核' ? 'green' : item.flowStatus === '已驳回' ? 'red' : 'orange'}>{item.flowStatus}</Tag>
                          </Space>
                        </div>
                        <Space size="small">
                          <Button type="text" size="small" icon={<IconEdit />} onClick={() => setQuotationEditVisible(true)} />
                          <Button type="text" size="small" icon={<IconDelete />} status="danger" onClick={() => Message.info('删除报价单')} />
                        </Space>
                      </div>

                      <div style={{
                        background: 'var(--color-bg-2)',
                        borderRadius: 6,
                        padding: '16px',
                        marginBottom: 16,
                        border: '1px solid var(--color-border-1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>报价金额</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>¥{item.amount}</div>
                          </div>
                          <div style={{ width: 1, height: 40, background: 'var(--color-border-2)' }}></div>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>预计成本</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-2)' }}>¥{item.cost}</div>
                          </div>
                          <div style={{ width: 1, height: 40, background: 'var(--color-border-2)' }}></div>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>预计利润</div>
                            <div style={{ fontSize: 18, fontWeight: 600, color: 'rgb(var(--success-6))' }}>¥{item.profit}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px 24px',
                        marginBottom: 12,
                        fontSize: 13
                      }}>
                        <div style={{ color: 'var(--color-text-2)' }}>
                          <span style={{ color: 'var(--color-text-3)' }}>报价主体：</span>
                          <span style={{ fontWeight: 500 }}>{item.entity}</span>
                        </div>
                        <div style={{ color: 'var(--color-text-2)' }}>
                          <span style={{ color: 'var(--color-text-3)' }}>报价人：</span>
                          <span style={{ fontWeight: 500 }}>{item.operator}</span>
                        </div>
                        <div style={{ color: 'var(--color-text-2)' }}>
                          <span style={{ color: 'var(--color-text-3)' }}>预计周期：</span>
                          <span style={{ fontWeight: 500 }}>{item.period}</span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 12,
                        borderTop: '1px solid var(--color-border-2)'
                      }}>
                        <div style={{ color: 'var(--color-text-2)', fontSize: 13 }}>
                          <span style={{ color: 'var(--color-text-3)' }}>报价文件：</span>
                          <span
                            style={{
                              fontWeight: 500,
                              color: 'var(--primary)',
                              cursor: 'pointer',
                              padding: '2px 4px',
                              borderRadius: 4,
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--color-fill-1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            onClick={() => Message.info(`下载文件: ${item.file}`)}
                          >
                            {item.file}
                          </span>
                        </div>
                      </div>

                      {/* 审批流程展示 */}
                      <div style={{ marginTop: 16 }}>
                        <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 8 }}>审批追踪</div>
                        <div style={{
                          background: 'var(--color-bg-2)',
                          borderRadius: 4,
                          padding: '12px',
                          border: '1px solid var(--color-border-1)'
                        }}>
                          {item.approvalFlow.map((node: any, index: number) => (
                            <div key={`quotation-${item.id}-${index}`} style={{ position: 'relative', paddingLeft: 24 }}>
                              {/* 连接线 */}
                              {index < item.approvalFlow.length - 1 && (
                                <div style={{
                                  position: 'absolute',
                                  left: 7,
                                  top: 20,
                                  bottom: -8,
                                  width: 2,
                                  background: node.status === 'approved' ? 'rgb(var(--green-6))' : 'var(--color-border-2)',
                                }}></div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < item.approvalFlow.length - 1 ? 12 : 0 }}>
                                {/* 状态灯 */}
                                <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                              node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                              node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                              'var(--color-border-3)',
                                  background: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                             node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                             node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                             'var(--color-bg-2)',
                                  animation: node.status === 'pending' ? 'pulse 2s infinite' : 'none',
                                }}></div>

                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
                                      {node.step}
                                    </span>
                                    <Tag
                                      color={node.status === 'approved' ? 'green' :
                                            node.status === 'pending' ? 'orange' :
                                            node.status === 'rejected' ? 'red' : 'default'}
                                      size="small"
                                    >
                                      {node.step === '发起申请' && node.status === 'approved' ? '已申请' :
                                       node.status === 'approved' ? '已通过' :
                                       node.status === 'pending' ? '待处理' :
                                       node.status === 'rejected' ? '已驳回' : '未到达'}
                                    </Tag>
                                  </div>

                                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 2 }}>
                                    {node.step === '发起申请' ? '申请人' : '审批人'}：{node.approver}
                                  </div>

                                  {node.time && (
                                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                                      操作时间：{node.time}
                                    </div>
                                  )}

                                  {/* 驳回理由高亮卡片 */}
                                  {node.status === 'rejected' && node.comment && (
                                    <div style={{
                                      marginTop: 6,
                                      padding: '8px 10px',
                                      background: 'rgb(var(--red-1))',
                                      border: '1px solid rgb(var(--red-3))',
                                      borderRadius: 4,
                                    }}>
                                      <div style={{ fontSize: 12, color: 'rgb(var(--red-7))', fontWeight: 600, marginBottom: 4 }}>
                                        ⚠️ 驳回理由
                                      </div>
                                      <div style={{ fontSize: 12, color: 'rgb(var(--red-6))' }}>
                                        {node.comment}
                                      </div>
                                    </div>
                                  )}

                                  {/* 普通审批意见 */}
                                  {node.status === 'approved' && node.comment && (
                                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', fontStyle: 'italic' }}>
                                      意见：{node.comment}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            </TabPane>

            <TabPane key="travel" title={`出差申请 (${travelApplications.length})`}>
              <Card
                bordered={false}
                extra={
                  <Button type="primary" size="small" icon={<IconPlus />} onClick={() => setTravelModalVisible(true)}>
                    出差
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="medium">
                  {travelApplications.map((item) => (
                    <div key={item.id} style={{
                      padding: '16px',
                      background: 'var(--color-fill-2)',
                      borderRadius: 6,
                      border: '1px solid var(--color-border-2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>目的地：{item.destination}</div>
                        <Space size="small">
                          <Tag color={item.status === '已审批' ? 'green' : 'orange'} size="small">{item.status}</Tag>
                          <Button type="text" size="mini" icon={<IconDelete />} status="danger" onClick={() => Message.info('删除出差申请')} />
                        </Space>
                      </div>
                      <div>
                        <div style={{
                          background: 'var(--color-bg-2)',
                          borderRadius: 6,
                          padding: '12px',
                          marginBottom: 12,
                          border: '1px solid var(--color-border-1)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                              <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>出差周期</div>
                              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>{item.duration}</div>
                            </div>
                            <div style={{ width: 1, height: 35, background: 'var(--color-border-2)' }}></div>
                            <div style={{ textAlign: 'center', flex: 1 }}>
                              <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>预估费用</div>
                              <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{item.estimatedCost}</div>
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px 16px',
                          marginBottom: 10,
                          fontSize: 13,
                          color: 'var(--color-text-2)'
                        }}>
                          <div>
                            <span style={{ color: 'var(--color-text-3)' }}>申请人：</span>
                            <span style={{ fontWeight: 500 }}>{item.applicant}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--color-text-3)' }}>申请部门：</span>
                            <span style={{ fontWeight: 500 }}>{item.department}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--color-text-3)' }}>开始时间：</span>
                            <span style={{ fontWeight: 500 }}>{item.startDate}</span>
                          </div>
                          <div>
                            <span style={{ color: 'var(--color-text-3)' }}>结束时间：</span>
                            <span style={{ fontWeight: 500 }}>{item.endDate}</span>
                          </div>
                          <div style={{ gridColumn: '1 / -1' }}>
                            <span style={{ color: 'var(--color-text-3)' }}>出差事由：</span>
                            <span style={{ fontWeight: 500 }}>{item.purpose}</span>
                          </div>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 6 }}>审批流程</div>
                          <div style={{
                            background: 'var(--color-bg-2)',
                            borderRadius: 4,
                            padding: '8px 12px',
                            border: '1px solid var(--color-border-1)'
                          }}>
{item.approvalFlow.map((node, index) => (
                              <div key={index} style={{ position: 'relative', paddingLeft: 24 }}>
                                {/* 连接线 */}
                                {index < item.approvalFlow.length - 1 && (
                                  <div style={{
                                    position: 'absolute',
                                    left: 7,
                                    top: 20,
                                    bottom: -8,
                                    width: 2,
                                    background: node.status === 'approved' ? 'rgb(var(--green-6))' : 'var(--color-border-2)',
                                  }}></div>
                                )}

                                <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < item.approvalFlow.length - 1 ? 12 : 0 }}>
                                  {/* 状态灯 */}
                                  <div style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    border: '2px solid',
                                    borderColor: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                                node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                                node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                                'var(--color-border-3)',
                                    background: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                               node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                               node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                               'var(--color-bg-2)',
                                    animation: node.status === 'pending' ? 'pulse 2s infinite' : 'none',
                                  }}></div>

                                  <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
                                        {node.step}
                                      </span>
                                      <Tag
                                        color={node.status === 'approved' ? 'green' :
                                              node.status === 'pending' ? 'orange' :
                                              node.status === 'rejected' ? 'red' : 'default'}
                                        size="small"
                                      >
                                        {node.step === '发起申请' && node.status === 'approved' ? '已申请' :
                                         node.status === 'approved' ? '已通过' :
                                         node.status === 'pending' ? '待处理' :
                                         node.status === 'rejected' ? '已驳回' : '未到达'}
                                      </Tag>
                                    </div>

                                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 2 }}>
                                      {node.step === '发起申请' ? '申请人' : '审批人'}：{node.approver}
                                    </div>

                                    {node.time && (
                                      <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                                        操作时间：{node.time}
                                      </div>
                                    )}

                                    {/* 驳回理由高亮卡片 */}
                                    {node.status === 'rejected' && node.comment && (
                                      <div style={{
                                        marginTop: 6,
                                        padding: '8px 10px',
                                        background: 'rgb(var(--red-1))',
                                        border: '1px solid rgb(var(--red-3))',
                                        borderRadius: 4,
                                      }}>
                                        <div style={{ fontSize: 12, color: 'rgb(var(--red-7))', fontWeight: 600, marginBottom: 4 }}>
                                          ⚠️ 驳回理由
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgb(var(--red-6))' }}>
                                          {node.comment}
                                        </div>
                                      </div>
                                    )}

                                    {/* 普通审批意见 */}
                                    {node.status === 'approved' && node.comment && (
                                      <div style={{ fontSize: 12, color: 'var(--color-text-3)', fontStyle: 'italic' }}>
                                        意见：{node.comment}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div style={{ paddingTop: 8, borderTop: '1px solid var(--color-border-2)' }}>
                        <ArcoText type="secondary" style={{ fontSize: 12 }}>申请时间：{item.createTime}</ArcoText>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            </TabPane>

            <TabPane key="reimbursement" title={`报销申请 (${reimbursementApplications.length})`}>
              <Card
                bordered={false}
                extra={
                  <Button type="primary" size="small" icon={<IconPlus />} onClick={() => setReimbursementModalVisible(true)}>
                    报销
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="medium">
                  {reimbursementApplications.map((item) => (
                    <div key={item.id} style={{
                      padding: '16px',
                      background: 'var(--color-fill-2)',
                      borderRadius: 6,
                      border: '1px solid var(--color-border-2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>费用类型：{item.expenseType}</div>
                        <Space size="small">
                          <Tag color={item.status === '已报销' ? 'green' : 'orange'} size="small">{item.status}</Tag>
                          <Button type="text" size="mini" icon={<IconEdit />} onClick={() => Message.info('编辑报销申请')} />
                          <Button type="text" size="mini" icon={<IconDelete />} status="danger" onClick={() => Message.info('删除报销申请')} />
                        </Space>
                      </div>

                      <div style={{
                        background: 'var(--color-bg-2)',
                        borderRadius: 6,
                        padding: '12px',
                        marginBottom: 12,
                        border: '1px solid var(--color-border-1)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>开票金额</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>¥{item.invoiceAmount}</div>
                          </div>
                          <div style={{ width: 1, height: 35, background: 'var(--color-border-2)' }}></div>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>报销金额</div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--success-6))' }}>¥{item.reimbursementAmount}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px 16px',
                        marginBottom: 10,
                        fontSize: 13,
                        color: 'var(--color-text-2)'
                      }}>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>申请人：</span>
                          <span style={{ fontWeight: 500 }}>{item.applicant}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>申请部门：</span>
                          <span style={{ fontWeight: 500 }}>{item.department}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>发票抬头：</span>
                          <span style={{ fontWeight: 500 }}>{item.invoiceTitle}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>税号：</span>
                          <span style={{ fontWeight: 500 }}>{item.taxNumber}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>发票类型：</span>
                          <span style={{ fontWeight: 500 }}>{item.invoiceType}</span>
                        </div>
                      </div>

                      {item.attachments && item.attachments.length > 0 && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 6 }}>附件列表：</div>
                          <Space size="small" wrap>
                            {item.attachments.map((file: any) => (
                              <span
                                key={file.id}
                                style={{
                                  color: 'var(--primary)',
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  padding: '2px 4px',
                                  borderRadius: 4,
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--color-fill-1)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                onClick={() => Message.info(`下载附件: ${file.name}`)}
                              >
                                {file.name} ({file.size})
                              </span>
                            ))}
                          </Space>
                        </div>
                      )}

                      <div style={{ marginTop: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 6 }}>审批流程</div>
                        <div style={{
                          background: 'var(--color-bg-2)',
                          borderRadius: 4,
                          padding: '12px',
                          border: '1px solid var(--color-border-1)'
                        }}>
                          {item.approvalFlow.map((node: any, index: number) => (
                            <div key={index} style={{ position: 'relative', paddingLeft: 24 }}>
                              {/* 连接线 */}
                              {index < item.approvalFlow.length - 1 && (
                                <div style={{
                                  position: 'absolute',
                                  left: 7,
                                  top: 20,
                                  bottom: -8,
                                  width: 2,
                                  background: node.status === 'approved' ? 'rgb(var(--green-6))' : 'var(--color-border-2)',
                                }}></div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: index < item.approvalFlow.length - 1 ? 12 : 0 }}>
                                {/* 状态灯 */}
                                <div style={{
                                  position: 'absolute',
                                  left: 0,
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  border: '2px solid',
                                  borderColor: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                              node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                              node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                              'var(--color-border-3)',
                                  background: node.status === 'approved' ? 'rgb(var(--green-6))' :
                                             node.status === 'pending' ? 'rgb(var(--orange-6))' :
                                             node.status === 'rejected' ? 'rgb(var(--red-6))' :
                                             'var(--color-bg-2)',
                                  animation: node.status === 'pending' ? 'pulse 2s infinite' : 'none',
                                }}></div>

                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
                                      {node.step}
                                    </span>
                                    <Tag
                                      color={node.status === 'approved' ? 'green' :
                                            node.status === 'pending' ? 'orange' :
                                            node.status === 'rejected' ? 'red' : 'default'}
                                      size="small"
                                    >
                                      {node.step === '发起申请' && node.status === 'approved' ? '已申请' :
                                       node.status === 'approved' ? '已通过' :
                                       node.status === 'pending' ? '待处理' :
                                       node.status === 'rejected' ? '已驳回' : '未到达'}
                                    </Tag>
                                  </div>

                                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 2 }}>
                                    {node.step === '发起申请' ? '申请人' : '审批人'}：{node.approver}
                                  </div>

                                  {node.time && (
                                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>
                                      操作时间：{node.time}
                                    </div>
                                  )}

                                  {/* 驳回理由高亮卡片 */}
                                  {node.status === 'rejected' && node.comment && (
                                    <div style={{
                                      marginTop: 6,
                                      padding: '8px 10px',
                                      background: 'rgb(var(--red-1))',
                                      border: '1px solid rgb(var(--red-3))',
                                      borderRadius: 4,
                                    }}>
                                      <div style={{ fontSize: 12, color: 'rgb(var(--red-7))', fontWeight: 600, marginBottom: 4 }}>
                                        ⚠️ 驳回理由
                                      </div>
                                      <div style={{ fontSize: 12, color: 'rgb(var(--red-6))' }}>
                                        {node.comment}
                                      </div>
                                    </div>
                                  )}

                                  {/* 普通审批意见 */}
                                  {node.status === 'approved' && node.comment && (
                                    <div style={{ fontSize: 12, color: 'var(--color-text-3)', fontStyle: 'italic' }}>
                                      意见：{node.comment}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ paddingTop: 8, borderTop: '1px solid var(--color-border-2)' }}>
                        <ArcoText type="secondary" style={{ fontSize: 12 }}>申请时间：{item.createTime}</ArcoText>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            </TabPane>

            <TabPane key="payments-invoice" title={`回款与发票 (${paymentRecords.length})`}>
              <Card
                bordered={false}
                extra={
                  paymentPeriods > 0 && (
                    <Button
                      type="primary"
                      size="small"
                      onClick={handleResetPaymentPeriods}
                    >
                      设置期数
                    </Button>
                  )
                }
              >
                {paymentPeriods === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ marginBottom: 12, fontSize: 14, color: 'var(--color-text-2)' }}>
                      请先初始化回款期数
                    </div>
                    <Button type="primary" onClick={handleResetPaymentPeriods}>
                      初始化回款期数
                    </Button>
                  </div>
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {paymentRecords.map((payment) => (
                      <div key={payment.id} style={{
                        background: 'var(--color-fill-2)',
                        borderRadius: 6,
                        padding: '12px',
                        border: '1px solid var(--color-border-2)'
                      }}>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>
                              {payment.period} - {payment.name}
                            </div>
                            <Tag color={payment.status === '已到账' ? 'green' : 'orange'} size="small">
                              {payment.status}
                            </Tag>
                          </div>

                          {/* 回款信息 */}
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(var(--success-1), 0.3) 0%, rgba(var(--success-2), 0.5) 100%)',
                            borderRadius: 6,
                            padding: '12px',
                            marginBottom: 10,
                            border: '1px solid var(--color-border-1)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>回款信息</div>
                              <Button size="mini" icon={<IconEdit />} onClick={() => setPaymentEditVisible(true)}>
                                编辑
                              </Button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: 10 }}>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 3 }}>应回款金额</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'rgb(var(--success-6))' }}>¥{payment.expectedAmount}</div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 3 }}>预计回款日期</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-1)' }}>
                                  {payment.expectedDate}
                                  {payment.overdueDays > 0 && (
                                    <Tag color="red" size="small" style={{ marginLeft: 6 }}>逾期{payment.overdueDays}天</Tag>
                                  )}
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 3 }}>实际回款金额</div>
                                <div style={{ fontSize: 16, fontWeight: 700, color: 'rgb(var(--success-6))' }}>
                                  {payment.actualDate ? `¥${payment.expectedAmount}` : '-'}
                                </div>
                              </div>
                            </div>
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border-2)', display: 'flex', gap: '20px', alignItems: 'center', fontSize: 12 }}>
                              <div style={{ color: 'var(--color-text-2)' }}>
                                <span style={{ color: 'var(--color-text-3)' }}>收款方式：</span>
                                <span style={{ fontWeight: 500 }}>{payment.paymentMethod || '-'}</span>
                              </div>
                              {payment.voucher && (
                                <div style={{ color: 'var(--color-text-2)' }}>
                                  <span style={{ color: 'var(--color-text-3)' }}>回款凭证：</span>
                                  <span
                                    style={{
                                      color: 'var(--primary)',
                                      cursor: 'pointer',
                                      padding: '2px 4px',
                                      borderRadius: 4,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-fill-1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => Message.info(`查看凭证: ${payment.voucher}`)}
                                  >
                                    {payment.voucher}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 发票信息 */}
                          <div style={{
                            background: 'linear-gradient(135deg, rgba(var(--arcoblue-1), 0.3) 0%, rgba(var(--arcoblue-2), 0.5) 100%)',
                            borderRadius: 6,
                            padding: '12px',
                            border: '1px solid var(--color-border-1)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>发票信息</div>
                              <Button size="mini" icon={<IconEdit />} onClick={() => setInvoiceEditVisible(true)}>
                                编辑
                              </Button>
                            </div>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(3, 1fr)',
                              gap: '10px',
                              fontSize: 12,
                              color: 'var(--color-text-2)',
                              textAlign: 'center'
                            }}>
                              <div>
                                <div style={{ color: 'var(--color-text-3)', marginBottom: 3 }}>开票状态</div>
                                <Tag color={payment.invoiceStatus === '已开票' ? 'arcoblue' : 'orange'} size="small">
                                  {payment.invoiceStatus}
                                </Tag>
                              </div>
                              <div>
                                <div style={{ color: 'var(--color-text-3)', marginBottom: 3 }}>开票税率</div>
                                <div style={{ fontWeight: 600, color: 'rgb(var(--arcoblue-6))', fontSize: 13 }}>{payment.taxRate}</div>
                              </div>
                              <div>
                                <div style={{ color: 'var(--color-text-3)', marginBottom: 3 }}>开票税额</div>
                                <div style={{ fontWeight: 700, color: 'rgb(var(--arcoblue-6))', fontSize: 13 }}>¥{payment.taxAmount}</div>
                              </div>
                            </div>
                            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border-2)', display: 'flex', gap: '20px', alignItems: 'center', fontSize: 12 }}>
                              <div style={{ color: 'var(--color-text-2)' }}>
                                <span style={{ color: 'var(--color-text-3)' }}>开票日期：</span>
                                <span style={{ fontWeight: 500 }}>{payment.invoiceDate || '-'}</span>
                              </div>
                              {payment.invoiceVoucher && (
                                <div style={{ color: 'var(--color-text-2)' }}>
                                  <span style={{ color: 'var(--color-text-3)' }}>发票凭证：</span>
                                  <span
                                    style={{
                                      color: 'var(--primary)',
                                      cursor: 'pointer',
                                      padding: '2px 4px',
                                      borderRadius: 4,
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-fill-1)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    onClick={() => Message.info(`查看发票: ${payment.invoiceVoucher}`)}
                                  >
                                    {payment.invoiceVoucher}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Space>
                )}
              </Card>
            </TabPane>

            <TabPane key="contracts-history" title={`合同记录 (${contracts.length})`}>
              <Card
                bordered={false}
                title="合同信息"
                extra={
                  <Button
                    type="primary"
                    icon={<IconPlus />}
                    size="small"
                    onClick={() => {
                      // 报价审批软提醒：找最近一份"已审批通过"的报价；没有就提示
                      const latestApproved = quotationHistory.find(
                        (q) => q.flowStatus === '已审核' && q.status === '已报价',
                      );
                      const baseUrl = `/contracts/new?leadId=${id ?? ''}`;
                      if (!latestApproved) {
                        Modal.confirm({
                          title: '尚无已审批通过的报价单',
                          content: '建议先完成报价审批后再建立合同，是否继续？',
                          onOk: () => navigate(baseUrl),
                        });
                      } else {
                        navigate(`${baseUrl}&quoteId=${latestApproved.id}`);
                      }
                    }}
                  >
                    新建合同
                  </Button>
                }
              >
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {contracts.map((contract) => (
                    <div key={contract.id} style={{
                      padding: '12px',
                      background: 'var(--color-fill-2)',
                      borderRadius: 6,
                      border: '1px solid var(--color-border-2)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>{contract.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-3)' }}>合同编号：{contract.contractNo}</div>
                        </div>
                        <Tag color={contract.status === '执行中' ? 'arcoblue' : 'orange'} size="small">{contract.status}</Tag>
                      </div>

                      <div style={{
                        background: 'var(--color-bg-2)',
                        borderRadius: 4,
                        padding: '10px',
                        marginBottom: 10,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-3)', marginBottom: 3 }}>合同金额</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>¥{contract.amount}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-3)', marginBottom: 3 }}>回款金额</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgb(var(--success-6))' }}>¥{contract.receivedAmount}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-3)', marginBottom: 3 }}>成本合计</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>¥{contract.totalCost}</div>
                        </div>
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gap: '6px',
                        fontSize: 12,
                        color: 'var(--color-text-2)'
                      }}>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>起始日：</span>
                          <span style={{ fontWeight: 500 }}>{contract.startDate}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>合同主体：</span>
                          <span style={{ fontWeight: 500 }}>{contract.contractEntity}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>签约主体：</span>
                          <span style={{ fontWeight: 500 }}>{contract.signingEntity}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>付款方式：</span>
                          <span style={{ fontWeight: 500 }}>{contract.paymentMethod}</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-3)' }}>签约人：</span>
                          <span style={{ fontWeight: 500 }}>{contract.signer}</span>
                        </div>
                      </div>

                      <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px solid var(--color-border-2)' }}>
                        <Space size="small">
                          <Button size="mini" type="primary">详情</Button>
                          <Button size="mini">编辑</Button>
                          <Button size="mini">审批</Button>
                          <Button size="mini" status="danger">终止</Button>
                        </Space>
                      </div>
                    </div>
                  ))}
                </Space>
              </Card>
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      <Modal
        title="添加跟进记录"
        visible={followVisible}
        onOk={handleFollow}
        onCancel={() => {
          setFollowVisible(false);
          form.resetFields();
        }}
        style={{ width: 680 }}
      >
        <Form form={form} layout="vertical">
          <FormItem
            label="跟进方式"
            field="type"
            rules={[{ required: true, message: '请选择跟进方式' }]}
          >
            <Radio.Group>
              <Radio value="phone">
                <IconPhone style={{ marginRight: 4 }} />
                电话沟通
              </Radio>
              <Radio value="wechat">
                <IconMessage style={{ marginRight: 4 }} />
                微信沟通
              </Radio>
              <Radio value="visit">
                <IconUser style={{ marginRight: 4 }} />
                上门拜访
              </Radio>
              <Radio value="other">其他</Radio>
            </Radio.Group>
          </FormItem>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="客户状态"
                field="status"
                rules={[{ required: true, message: '请选择客户状态' }]}
              >
                <Select placeholder="请选择客户当前状态">
                  <Select.Option key="followup-status-1" value="未联系">未联系</Select.Option>
                  <Select.Option key="followup-status-2" value="未接通">未接通</Select.Option>
                  <Select.Option key="followup-status-3" value="初步沟通">初步沟通</Select.Option>
                  <Select.Option key="followup-status-4" value="需求调研">需求调研</Select.Option>
                  <Select.Option key="followup-status-5" value="方案报价">方案报价</Select.Option>
                  <Select.Option key="followup-status-6" value="合同洽谈">合同洽谈</Select.Option>
                  <Select.Option key="followup-status-7" value="已签单">已签单</Select.Option>
                  <Select.Option key="followup-status-8" value="已终止">已终止</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="意向等级" field="level">
                <Radio.Group>
                  <Radio value="high">高</Radio>
                  <Radio value="medium">中</Radio>
                  <Radio value="low">低</Radio>
                </Radio.Group>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <FormItem
            label="跟进详情"
            field="content"
            rules={[{ required: true, message: '请输入跟进详情' }]}
          >
            <Input.TextArea
              placeholder="请详细记录本次沟通的内容、客户反馈、关键信息等"
              rows={6}
              maxLength={2000}
              showWordLimit
            />
          </FormItem>

          <FormItem label="附件上传" field="attachments">
            <Upload
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
              multiple
              drag
              tip="支持上传图片、PDF、Word、Excel等文件"
            >
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                  点击或拖拽文件到此处上传
                </div>
              </div>
            </Upload>
          </FormItem>

          <FormItem label="下次跟进提醒" field="nextFollow">
            <Select placeholder="请选择跟进提醒时间" defaultValue="3">
              <Select.Option key="follow-1" value="1">1天后（高频跟进）</Select.Option>
              <Select.Option key="follow-3" value="3">3天后（默认）</Select.Option>
              <Select.Option key="follow-7" value="7">7天后（中频跟进）</Select.Option>
              <Select.Option key="follow-10" value="10">10天后（低频跟进）</Select.Option>
              <Select.Option key="follow-15" value="15">15天后</Select.Option>
              <Select.Option key="follow-30" value="30">30天后</Select.Option>
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="绑定客户主体"
        visible={bindCustomerVisible}
        onOk={handleBindCustomer}
        onCancel={() => {
          setBindCustomerVisible(false);
          bindCustomerForm.resetFields();
          setCustomerSearchKeyword('');
        }}
        style={{ width: 600 }}
      >
        <Form form={bindCustomerForm} layout="vertical">
          <FormItem label="搜索客户">
            <Input
              placeholder="输入客户名称、联系人或电话搜索"
              prefix={<IconSearch />}
              value={customerSearchKeyword}
              onChange={(value) => setCustomerSearchKeyword(value)}
              allowClear
            />
          </FormItem>
          <FormItem
            label="选择客户"
            field="customerId"
            rules={[{ required: true, message: '请选择客户' }]}
          >
            <Select placeholder="请选择客户主体">
              {filteredCustomers.map((customer) => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.contact} - {customer.phone}
                </Select.Option>
              ))}
            </Select>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="编辑线索"
        visible={editLeadVisible}
        onOk={handleEditLeadSubmit}
        onCancel={() => {
          setEditLeadVisible(false);
          editLeadForm.resetFields();
          setSelectedTags([]);
        }}
        style={{ width: 800 }}
      >
        <Form form={editLeadForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={24}>
              <FormItem label="线索名称" field="name" rules={[{ required: true, message: '请输入线索名称' }]}>
                <Input placeholder="请输入线索名称" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={8}>
              <FormItem label="联系人" field="contact" rules={[{ required: true, message: '请输入联系人' }]}>
                <Input placeholder="请输入联系人姓名" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="联系电话" field="phone" rules={[{ required: true, message: '请输入联系电话' }]}>
                <Input placeholder="请输入手机号" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="联系人微信" field="wechat">
                <Input placeholder="请输入微信号" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={8}>
              <FormItem label="线索来源" field="source" rules={[{ required: true, message: '请选择线索来源' }]}>
                <Select placeholder="请选择">
                  <Select.Option key="baidu" value="百度推广">百度推广</Select.Option>
                  <Select.Option key="douyin" value="抖音">抖音</Select.Option>
                  <Select.Option key="xiaohongshu" value="小红书">小红书</Select.Option>
                  <Select.Option key="wechat" value="微信推广">微信推广</Select.Option>
                  <Select.Option key="other" value="其他">其他</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="推广关键词" field="keyword">
                <Input placeholder="请输入推广关键词" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="客户主体" field="customerId">
                <Select
                  placeholder="请输入客户名称搜索"
                  showSearch
                  allowClear
                  filterOption={(inputValue, option) => {
                    const customer = customerList.find(c => c.id === option.props?.value);
                    if (!customer) return false;
                    const searchText = `${customer.name} ${customer.contact} ${customer.phone}`.toLowerCase();
                    return searchText.indexOf(inputValue.toLowerCase()) >= 0;
                  }}
                >
                  {customerList.map((customer) => (
                    <Select.Option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.contact} - {customer.phone}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={8}>
              <FormItem label="意向等级" field="level" rules={[{ required: true, message: '请选择意向等级' }]}>
                <Select placeholder="请选择">
                  <Select.Option key="high" value="高">高</Select.Option>
                  <Select.Option key="medium" value="中">中</Select.Option>
                  <Select.Option key="low" value="低">低</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="对接主体" field="entity" rules={[{ required: true, message: '请选择对接主体' }]}>
                <Select placeholder="请选择">
                  <Select.Option key="zkry" value="中科软艺">中科软艺</Select.Option>
                  <Select.Option key="ryxx" value="软艺信息">软艺信息</Select.Option>
                  <Select.Option key="zkjt" value="中科集团">中科集团</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="客户状态" field="status" rules={[{ required: true, message: '请选择客户状态' }]}>
                <Select placeholder="请选择">
                  <Select.Option key="newlead-status-1" value="未联系">未联系</Select.Option>
                  <Select.Option key="newlead-status-2" value="未接通">未接通</Select.Option>
                  <Select.Option key="newlead-status-3" value="初步沟通">初步沟通</Select.Option>
                  <Select.Option key="newlead-status-4" value="需求调研">需求调研</Select.Option>
                  <Select.Option key="newlead-status-5" value="方案报价">方案报价</Select.Option>
                  <Select.Option key="newlead-status-6" value="合同洽谈">合同洽谈</Select.Option>
                  <Select.Option key="newlead-status-7" value="已签单">已签单</Select.Option>
                  <Select.Option key="newlead-status-8" value="已终止">已终止</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={24}>
              <FormItem label="意向标签" field="tags">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {availableTags.map((tag) => (
                    <Tag
                      key={tag}
                      checkable
                      checked={selectedTags.includes(tag)}
                      onClick={() => handleTagClick(tag)}
                      style={{ cursor: 'pointer' }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  <Button
                    size="small"
                    type="dashed"
                    icon={<IconPlus />}
                    onClick={() => setCustomTagVisible(true)}
                  >
                    新增标签
                  </Button>
                </div>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={24}>
              <FormItem label="客户需求梗概" field="requirement">
                <Input.TextArea
                  placeholder="请输入客户需求描述"
                  rows={6}
                  maxLength={1000}
                  showWordLimit
                />
              </FormItem>
              <FormItem label="附件上传" field="attachments">
                <Upload
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  drag
                  tip="支持上传图片、PDF、Word、Excel等文件"
                >
                  <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                    <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                      点击或拖拽文件到此处上传
                    </div>
                  </div>
                </Upload>
              </FormItem>
            </Grid.Col>
          </Grid.Row>
        </Form>
      </Modal>

      <Modal
        title="新增标签"
        visible={customTagVisible}
        onOk={handleAddCustomTag}
        onCancel={() => {
          setCustomTagVisible(false);
          customTagForm.resetFields();
        }}
        style={{ width: 400 }}
      >
        <Form form={customTagForm} layout="vertical">
          <FormItem
            label="标签名称"
            field="tagName"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称，如：物联网、区块链等" maxLength={10} />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="标记为垃圾线索"
        visible={trashVisible}
        onOk={handleTrashSubmit}
        onCancel={() => {
          setTrashVisible(false);
          trashForm.resetFields();
        }}
        style={{ width: 480 }}
      >
        <Form form={trashForm} layout="vertical">
          <FormItem
            label="丢弃原因"
            field="reason"
            rules={[{ required: true, message: '请填写丢弃原因' }]}
          >
            <Input.TextArea
              placeholder="请详细说明该线索为垃圾线索的原因，如：重复线索、虚假信息、无效联系方式等"
              rows={4}
            />
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="编辑报价单"
        visible={quotationEditVisible}
        onOk={() => {
          quotationForm.validate().then(() => {
            Message.success('报价单更新成功');
            setQuotationEditVisible(false);
            quotationForm.resetFields();
          }).catch(() => {
            // 验证失败，不做处理，表单会自动显示错误信息
          });
        }}
        onCancel={() => {
          setQuotationEditVisible(false);
          quotationForm.resetFields();
        }}
        style={{ width: 680 }}
      >
        <Form form={quotationForm} layout="vertical">
          

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="报价状态"
                field="status"
                rules={[{ required: true, message: '请选择报价状态' }]}
              >
                <Select placeholder="请选择">
                  <Select.Option value="已报价">已报价</Select.Option>
                  <Select.Option value="未报价">未报价</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="预计周期" field="period">
                <Input placeholder="例如：3个月" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="报价人" field="operator">
                <Select placeholder="请选择报价人">
                  <Select.Option value="张三">张三</Select.Option>
                  <Select.Option value="李四">李四</Select.Option>
                  <Select.Option value="王五">王五</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="报价主体" field="entity">
                <Select placeholder="请选择报价主体">
                  <Select.Option value="中科软艺">中科软艺</Select.Option>
                  <Select.Option value="软艺信息">软艺信息</Select.Option>
                  <Select.Option value="中科集团">中科集团</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={8}>
              <FormItem label="报价金额" field="amount">
                <Input placeholder="单位：元" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="预计成本" field="cost">
                <Input placeholder="单位：元" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={8}>
              <FormItem label="预计利润" field="profit">
                <Input placeholder="单位：元" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>审批流程</div>
            <div style={{
              background: 'var(--color-fill-2)',
              borderRadius: 6,
              padding: '12px 16px',
              border: '1px solid var(--color-border-2)'
            }}>
              <Space split={<span style={{ color: 'var(--color-text-4)' }}>→</span>}>
                <span key="quotation-step-1" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>发起申请</span>
                <span key="quotation-step-2" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>初审（张三 - 部门经理）</span>
                <span key="quotation-step-3" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>终审（王五 - 财务审核）</span>
              </Space>
            </div>
          </div>

          <FormItem label="报价单文件" field="file">
            <Upload
              accept=".xlsx,.xls,.csv"
              drag
            >
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>
                  <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                </div>
                <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                  点击或拖拽文件到此处上传
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-3)' }}>
                  支持 Excel 文件（.xlsx, .xls, .csv）
                </div>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="新增出差申请"
        visible={travelModalVisible}
        onOk={() => {
          travelForm.validate().then(() => {
            Message.success('出差申请提交成功');
            setTravelModalVisible(false);
            travelForm.resetFields();
          }).catch(() => {
            // 验证失败，不做处理，表单会自动显示错误信息
          });
        }}
        onCancel={() => {
          setTravelModalVisible(false);
          travelForm.resetFields();
        }}
        style={{ width: 680 }}
      >
        <Form form={travelForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="申请人"
                field="applicant"
                rules={[{ required: true, message: '请选择申请人' }]}
              >
                <Select placeholder="请选择申请人">
                  <Select.Option value="张三">张三</Select.Option>
                  <Select.Option value="李四">李四</Select.Option>
                  <Select.Option value="王五">王五</Select.Option>
                  <Select.Option value="赵六">赵六</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="申请部门"
                field="department"
                rules={[{ required: true, message: '请输入申请部门' }]}
              >
                <Input placeholder="请输入申请部门" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <FormItem
            label="目的地"
            field="destination"
            rules={[{ required: true, message: '请输入目的地' }]}
          >
            <Input placeholder="请输入目的地城市" />
          </FormItem>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="开始时间"
                field="startDate"
                rules={[{ required: true, message: '请选择开始时间' }]}
              >
                <Input type="date" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="结束时间"
                field="endDate"
                rules={[{ required: true, message: '请选择结束时间' }]}
              >
                <Input type="date" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="出差周期"
                field="duration"
                rules={[{ required: true, message: '请输入出差周期' }]}
              >
                <Input placeholder="例如：3天 或 2天8小时" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="预估费用"
                field="estimatedCost"
                rules={[{ required: true, message: '请输入预估费用' }]}
              >
                <Input placeholder="请输入预估费用（单位：元）" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <FormItem
            label="出差事由"
            field="purpose"
            rules={[{ required: true, message: '请输入出差事由' }]}
          >
            <Input.TextArea placeholder="请详细说明出差事由" rows={4} />
          </FormItem>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>审批流程</div>
            <div style={{
              background: 'var(--color-fill-2)',
              borderRadius: 6,
              padding: '12px 16px',
              border: '1px solid var(--color-border-2)'
            }}>
              <Space split={<span style={{ color: 'var(--color-text-4)' }}>→</span>}>
                <span key="travel-step-1" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>发起申请</span>
                <span key="travel-step-2" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>初审（张三 - 部门经理）</span>
                <span key="travel-step-3" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>终审（王五 - 财务审核）</span>
              </Space>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        title="新增报销申请"
        visible={reimbursementModalVisible}
        onOk={() => {
          reimbursementForm.validate().then(() => {
            Message.success('报销申请提交成功');
            setReimbursementModalVisible(false);
            reimbursementForm.resetFields();
          }).catch(() => {
            // 验证失败，不做处理，表单会自动显示错误信息
          });
        }}
        onCancel={() => {
          setReimbursementModalVisible(false);
          reimbursementForm.resetFields();
        }}
        style={{ width: 720 }}
      >
        <Form form={reimbursementForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="申请人"
                field="applicant"
                rules={[{ required: true, message: '请选择申请人' }]}
              >
                <Select placeholder="请选择申请人">
                  <Select.Option value="张三">张三</Select.Option>
                  <Select.Option value="李四">李四</Select.Option>
                  <Select.Option value="王五">王五</Select.Option>
                  <Select.Option value="赵六">赵六</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="申请部门"
                field="department"
                rules={[{ required: true, message: '请输入申请部门' }]}
              >
                <Input placeholder="请输入申请部门" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="费用类型"
                field="expenseType"
                rules={[{ required: true, message: '请选择费用类型' }]}
              >
                <Select placeholder="请选择费用类型">
                  <Select.Option value="差旅费">差旅费</Select.Option>
                  <Select.Option value="招待费">招待费</Select.Option>
                  <Select.Option value="办公费">办公费</Select.Option>
                  <Select.Option value="通讯费">通讯费</Select.Option>
                  <Select.Option value="其他">其他</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="发票类型"
                field="invoiceType"
                rules={[{ required: true, message: '请选择发票类型' }]}
              >
                <Select placeholder="请选择发票类型">
                  <Select.Option value="增值税专用发票">增值税专用发票</Select.Option>
                  <Select.Option value="增值税普通发票">增值税普通发票</Select.Option>
                  <Select.Option value="电子发票">电子发票</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="开票金额"
                field="invoiceAmount"
                rules={[{ required: true, message: '请输入开票金额' }]}
              >
                <Input placeholder="请输入开票金额（单位：元）" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="报销金额"
                field="reimbursementAmount"
                rules={[{ required: true, message: '请输入报销金额' }]}
              >
                <Input placeholder="请输入报销金额（单位：元）" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="发票抬头"
                field="invoiceTitle"
                rules={[{ required: true, message: '请输入发票抬头' }]}
              >
                <Input placeholder="请输入发票抬头" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="税号"
                field="taxNumber"
                rules={[{ required: true, message: '请输入税号' }]}
              >
                <Input placeholder="请输入纳税人识别号" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          {/* 费用明细区域 */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>费用明细</div>
              <Button
                type="primary"
                size="small"
                icon={<IconPlus />}
                onClick={() => {
                  const newId = Math.max(...expenseItems.map(item => item.id)) + 1;
                  setExpenseItems([...expenseItems, { id: newId, category: '', description: '', amount: '' }]);
                }}
              >
                新增一条费用明细
              </Button>
            </div>

            <div style={{
              background: 'var(--color-fill-2)',
              borderRadius: 6,
              padding: '16px',
              border: '1px solid var(--color-border-2)'
            }}>
              {expenseItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--color-bg-2)',
                    borderRadius: 4,
                    padding: '12px',
                    marginBottom: index < expenseItems.length - 1 ? 12 : 0,
                    border: '1px solid var(--color-border-1)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-3)', minWidth: 60 }}>
                      序号 {index + 1}
                    </div>
                    {expenseItems.length > 1 && (
                      <Button
                        type="text"
                        size="mini"
                        status="danger"
                        icon={<IconDelete />}
                        onClick={() => {
                          setExpenseItems(expenseItems.filter(expItem => expItem.id !== item.id));
                        }}
                      >
                        删除
                      </Button>
                    )}
                  </div>

                  <Grid.Row gutter={12}>
                    <Grid.Col span={8}>
                      <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-3)' }}>费用类型 *</div>
                      <Select
                        placeholder="请选择费用类型"
                        value={item.category}
                        onChange={(value) => {
                          const newItems = [...expenseItems];
                          newItems[index].category = value;
                          setExpenseItems(newItems);
                        }}
                        style={{ width: '100%' }}
                      >
                        <Select.Option value="差旅费-交通">差旅费-交通</Select.Option>
                        <Select.Option value="差旅费-住宿">差旅费-住宿</Select.Option>
                        <Select.Option value="差旅费-餐饮">差旅费-餐饮</Select.Option>
                        <Select.Option value="商务成本-招待">商务成本-招待</Select.Option>
                        <Select.Option value="商务成本-礼品">商务成本-礼品</Select.Option>
                        <Select.Option value="办公费用-设备">办公费用-设备</Select.Option>
                        <Select.Option value="办公费用-耗材">办公费用-耗材</Select.Option>
                        <Select.Option value="通讯费">通讯费</Select.Option>
                        <Select.Option value="其他">其他</Select.Option>
                      </Select>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-3)' }}>金额（元）*</div>
                      <Input
                        placeholder="0.00"
                        value={item.amount}
                        onChange={(value) => {
                          const newItems = [...expenseItems];
                          newItems[index].amount = value;
                          setExpenseItems(newItems);
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--color-text-3)' }}>费用说明 *</div>
                      <Input
                        placeholder="请输入费用用途"
                        value={item.description}
                        onChange={(value) => {
                          const newItems = [...expenseItems];
                          newItems[index].description = value;
                          setExpenseItems(newItems);
                        }}
                      />
                    </Grid.Col>
                  </Grid.Row>
                </div>
              ))}

              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid var(--color-border-2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: 13, color: 'var(--color-text-3)' }}>
                  共 {expenseItems.length} 笔费用
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'rgb(var(--red-6))' }}>
                  费用合计：¥{expenseItems.reduce((sum, item) => {
                    const amount = parseFloat(item.amount) || 0;
                    return sum + amount;
                  }, 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 500 }}>审批流程</div>
            <div style={{
              background: 'var(--color-fill-2)',
              borderRadius: 6,
              padding: '12px 16px',
              border: '1px solid var(--color-border-2)'
            }}>
              <Space split={<span style={{ color: 'var(--color-text-4)' }}>→</span>}>
                <span key="reimbursement-step-1" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>发起申请</span>
                <span key="reimbursement-step-2" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>初审（张三 - 部门经理）</span>
                <span key="reimbursement-step-3" style={{ fontSize: 13, color: 'var(--color-text-2)' }}>终审（王五 - 财务审核）</span>
              </Space>
            </div>
          </div>

          <FormItem label="附件上传" field="attachments">
            <Upload
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              multiple
              drag
            >
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>
                  <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                </div>
                <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                  点击或拖拽文件到此处上传
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-3)' }}>
                  支持发票、收据等文件（.pdf, .jpg, .png, .doc, .docx）
                </div>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title={paymentPeriods > 0 ? "重设回款期数" : "初始化回款期数"}
        visible={paymentPeriodVisible}
        onOk={handleInitializePaymentPeriods}
        onCancel={() => {
          setPaymentPeriodVisible(false);
          paymentPeriodForm.resetFields();
        }}
        style={{ width: 480 }}
      >
        <Form form={paymentPeriodForm} layout="vertical">
          {paymentPeriods > 0 && (
            <div style={{
              padding: '12px',
              background: 'rgba(var(--warning-2), 0.5)',
              border: '1px solid rgb(var(--warning-3))',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px',
              color: 'var(--color-text-1)'
            }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>⚠️ 重设提醒</div>
              <div style={{ fontSize: '13px', color: 'var(--color-text-2)' }}>
                重设期数将清空所有现有的回款与发票记录，包括已录入的金额、日期、凭证等信息。请谨慎操作。
              </div>
            </div>
          )}
          <FormItem
            label="回款期数"
            field="periods"
            rules={[{ required: true, message: '请选择回款期数' }]}
          >
            <Select placeholder="请选择回款期数">
              <Select.Option value="1">一期</Select.Option>
              <Select.Option value="2">二期</Select.Option>
              <Select.Option value="3">三期</Select.Option>
              <Select.Option value="4">四期</Select.Option>
              <Select.Option value="custom">自定义</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            noStyle
            shouldUpdate={(prev, current) => prev.periods !== current.periods}
          >
            {(values) => {
              return values.periods === 'custom' ? (
                <FormItem
                  label="自定义期数"
                  field="customPeriods"
                  rules={[{ required: true, message: '请输入自定义期数' }]}
                >
                  <Input placeholder="请输入期数" type="number" />
                </FormItem>
              ) : null;
            }}
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="编辑回款信息"
        visible={paymentEditVisible}
        onOk={() => {
          paymentForm.validate().then(() => {
            Message.success('回款信息更新成功');
            setPaymentEditVisible(false);
            paymentForm.resetFields();
          }).catch(() => {
            // 验证失败，不做处理，表单会自动显示错误信息
          });
        }}
        onCancel={() => {
          setPaymentEditVisible(false);
          paymentForm.resetFields();
        }}
        style={{ width: 680 }}
      >
        <Form form={paymentForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="回款名称"
                field="name"
                rules={[{ required: true, message: '请选择回款名称' }]}
              >
                <Select placeholder="请选择">
                  <Select.Option value="首期款">首期款</Select.Option>
                  <Select.Option value="周期款">周期款</Select.Option>
                  <Select.Option value="尾款">尾款</Select.Option>
                  <Select.Option value="附加款">附加款</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="应回款金额"
                field="expectedAmount"
                rules={[{ required: true, message: '请输入应回款金额' }]}
              >
                <Input placeholder="请输入金额（单位：元）" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="预计回款日期"
                field="expectedDate"
                rules={[{ required: true, message: '请选择预计回款日期' }]}
              >
                <Input type="date" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem label="实际回款日期" field="actualDate">
                <Input type="date" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <FormItem
            label="到账状态"
            field="status"
            rules={[{ required: true, message: '请选择到账状态' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="已到账">已到账</Select.Option>
              <Select.Option value="未到账">未到账</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="回款凭证" field="voucher">
            <Upload accept=".jpg,.jpeg,.png,.pdf" drag>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>
                  <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                </div>
                <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                  点击或拖拽文件到此处上传
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-3)' }}>
                  支持图片和PDF文件
                </div>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

      <Modal
        title="编辑发票信息"
        visible={invoiceEditVisible}
        onOk={() => {
          invoiceForm.validate().then(() => {
            Message.success('发票信息更新成功');
            setInvoiceEditVisible(false);
            invoiceForm.resetFields();
          }).catch(() => {
            // 验证失败，不做处理，表单会自动显示错误信息
          });
        }}
        onCancel={() => {
          setInvoiceEditVisible(false);
          invoiceForm.resetFields();
        }}
        style={{ width: 680 }}
      >
        <Form form={invoiceForm} layout="vertical">
          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem
                label="开票状态"
                field="invoiceStatus"
                rules={[{ required: true, message: '请选择开票状态' }]}
              >
                <Select placeholder="请选择">
                  <Select.Option value="已开票">已开票</Select.Option>
                  <Select.Option value="未开票">未开票</Select.Option>
                </Select>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="开票税率"
                field="taxRate"
                rules={[{ required: true, message: '请输入开票税率' }]}
              >
                <Input placeholder="例如：6%" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <Grid.Row gutter={16}>
            <Grid.Col span={12}>
              <FormItem label="开票日期" field="invoiceDate">
                <Input type="date" />
              </FormItem>
            </Grid.Col>
            <Grid.Col span={12}>
              <FormItem
                label="开票税额"
                field="taxAmount"
                rules={[{ required: true, message: '请输入开票税额' }]}
              >
                <Input placeholder="请输入税额（单位：元）" />
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          <FormItem
            label="收款方式"
            field="paymentMethod"
            rules={[{ required: true, message: '请选择收款方式' }]}
          >
            <Select placeholder="请选择">
              <Select.Option value="公对公">公对公</Select.Option>
              <Select.Option value="支付宝">支付宝</Select.Option>
              <Select.Option value="微信">微信</Select.Option>
              <Select.Option value="其他">其他</Select.Option>
            </Select>
          </FormItem>

          <FormItem label="发票凭证" field="invoiceVoucher">
            <Upload accept=".jpg,.jpeg,.png,.pdf" drag>
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div>
                  <IconUpload style={{ fontSize: 32, color: 'var(--color-text-3)' }} />
                </div>
                <div style={{ marginTop: 8, color: 'var(--color-text-2)' }}>
                  点击或拖拽文件到此处上传
                </div>
                <div style={{ marginTop: 4, fontSize: 12, color: 'var(--color-text-3)' }}>
                  支持发票截图和PDF文件
                </div>
              </div>
            </Upload>
          </FormItem>
        </Form>
      </Modal>

    </div>
  );
}
