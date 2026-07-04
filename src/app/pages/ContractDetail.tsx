import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Card,
  Descriptions,
  Tabs,
  Timeline,
  Table,
  Progress,
  Space,
  Divider,
  Grid,
  Result,
  Button,
  Select,
  Tag,
  Modal,
  Form,
  Input,
  Message,
} from '@arco-design/web-react';
import {
  IconLeft,
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconClockCircle,
  IconPlus,
} from '@arco-design/web-react/icon';
import { useContracts } from './contracts/ContractsContext';
import { ContractStatusBadge } from './contracts/components/ContractStatusBadge';
import { ContractActionBar } from './contracts/components/ContractActionBar';
import { VersionTimeline } from './contracts/components/VersionTimeline';
import { ScanFileList } from './contracts/components/ScanFileList';
import { ContractFlowProgress } from './contracts/components/ContractFlowProgress';
import { CONTRACT_STATUS_LABEL } from './contracts/utils';
import type { Contract, ContractStatus } from './contracts/types';

const FormItem = Form.Item;

interface FollowUpRecord {
  id: string;
  type: 'requirement_change' | 'ui_confirm' | 'dunning' | 'other';
  title: string;
  content: string;
  author: string;
  date: string;
}

const FOLLOW_UP_TYPES: Record<FollowUpRecord['type'], { label: string; color: string; icon: string }> = {
  requirement_change: { label: '需求变更', color: 'orange', icon: '📝' },
  ui_confirm:         { label: 'UI/原型确认', color: 'cyan', icon: '✅' },
  dunning:            { label: '催款记录', color: 'red', icon: '💰' },
  other:              { label: '其他', color: 'gray', icon: '📌' },
};

const mockFollowUps: FollowUpRecord[] = [
  { id: 'fu-1', type: 'requirement_change', title: '新增报表功能需求', content: '客户希望增加月度统计报表功能，预计增加工作量 3 人天，费用增加 ¥15,000。', author: '张三', date: '2026-06-28' },
  { id: 'fu-2', type: 'ui_confirm', title: 'CRM 首页设计确认', content: '客户已确认 CRM 首页设计稿 V2，无修改意见，可以进入开发阶段。', author: '陈明', date: '2026-06-25' },
  { id: 'fu-3', type: 'dunning', title: '第二期款项催款', content: '已电话联系联系客户财务，对方确认本周内支付第二期款项 ¥360,000。', author: '张三', date: '2026-06-22' },
  { id: 'fu-4', type: 'requirement_change', title: '登录方式调整', content: '客户要求增加微信扫码登录，原有手机验证码登录保留。已评估技术可行性，无额外成本。', author: '李四', date: '2026-06-18' },
  { id: 'fu-5', type: 'ui_confirm', title: '移动端原型确认', content: '客户已签字确认移动端 APP 原型设计，包含 12 个核心页面流程图。', author: '陈明', date: '2026-06-15' },
  { id: 'fu-6', type: 'dunning', title: '首期款项到账确认', content: '已收到客户首期款项 ¥480,000，银行回单已归档。', author: '张三', date: '2026-06-10' },
];

const { Row, Col } = Grid;
const TabPane = Tabs.TabPane;

export function ContractDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getById, uploadScan, setPrimaryScan } = useContracts();

  const contract = getById(id);

  // 版本切换：默认显示审批通过的版本，没有就显示最新一个版本
  const defaultVersionNo = useMemo(() => {
    if (!contract) return null;
    return (
      contract.approvedVersionNo ??
      contract.versionHistory[contract.versionHistory.length - 1]?.versionNo ??
      null
    );
  }, [contract]);

  const [selectedVersionNo, setSelectedVersionNo] = useState<string | null>(defaultVersionNo);
  // 当 contract 变化（创建新版本等）时，自动跟到 default
  if (contract && selectedVersionNo === null && defaultVersionNo) {
    setSelectedVersionNo(defaultVersionNo);
  }

  const [activeTab, setActiveTab] = useState('document');
  const [activeRightTab, setActiveRightTab] = useState('followup');

  if (!contract) {
    return (
      <Result
        status="404"
        title="合同不存在"
        subTitle="该合同可能已被删除，或链接有误。"
        extra={
          <Button type="primary" onClick={() => navigate('/contracts')}>
            返回合同列表
          </Button>
        }
      />
    );
  }

  const selectedVersion =
    contract.versionHistory.find((v) => v.versionNo === selectedVersionNo) ??
    contract.versionHistory[contract.versionHistory.length - 1];

  // 是否展示审批 Timeline：仅当所选版本是审批所基于的版本时
  const showApprovalForSelected = selectedVersionNo === contract.approvedVersionNo
    || (contract.status === 'approving' &&
      selectedVersionNo === contract.versionHistory[contract.versionHistory.length - 1]?.versionNo);

  const cd = contract.current;

  const paymentColumns = [
    { title: '期数', dataIndex: 'period', width: 80, render: (n: number) => `第 ${n} 期` },
    { title: '预计回款日期', dataIndex: 'expectedDate', width: 130 },
    {
      title: '比例',
      dataIndex: 'percentage',
      width: 80,
      render: (val: number) => `${val.toFixed(2)}%`,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 120,
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
  ];

  const totalAmount = cd.totalAmount;
  const receivedAmount = contract.receivedAmount ?? 0;
  const receivableAmount = (contract.receivableAmount ?? totalAmount - receivedAmount);
  const receivedRate = totalAmount > 0 ? Math.round((receivedAmount / totalAmount) * 100) : 0;

  // 上传扫描件回调
  const uploadEnabled = contract.status === 'pending_return' || contract.status === 'archived';
  const uploadIntent: 'first' | 'supplemental' | null = contract.status === 'pending_return'
    ? 'first'
    : contract.status === 'archived'
      ? 'supplemental'
      : null;

  // 跟进记录
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(mockFollowUps);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [followUpForm] = Form.useForm();

  const handleAddFollowUp = () => {
    followUpForm.validate().then(values => {
      const newRecord: FollowUpRecord = {
        id: `fu-${Date.now()}`,
        ...values,
        author: '当前用户',
        date: '2026-07-02',
      };
      setFollowUps(prev => [newRecord, ...prev]);
      setFollowUpModalVisible(false);
      Message.success('跟进记录已添加');
    });
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{cd.contractName}</span>
                <ContractStatusBadge status={contract.status} />
                {contract.executionStatus && (
                  <Tag color="purple">履行：{contract.executionStatus}</Tag>
                )}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-3)', marginTop: 4 }}>
                合同编号：{contract.contractNo}
                <span style={{ marginLeft: 16 }}>
                  当前查看版本：
                  <Select
                    size="mini"
                    value={selectedVersionNo ?? undefined}
                    onChange={setSelectedVersionNo}
                    style={{ width: 200, marginLeft: 4 }}
                  >
                    {contract.versionHistory.map((v) => (
                      <Select.Option key={v.versionNo} value={v.versionNo}>
                        {v.versionNo} · {v.label}
                        {v.versionNo === contract.approvedVersionNo ? ' ✅' : ''}
                      </Select.Option>
                    ))}
                  </Select>
                </span>
              </div>
            </div>
          </div>
          <ContractActionBar contract={contract} />
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
                { label: '签约主体', value: cd.signingEntity },
                { label: '产品类别', value: cd.productCategory },
                { label: '合同总额', value: `¥${cd.totalAmount.toLocaleString()}` },
                { label: '付款方式', value: cd.paymentMethod },
                { label: '签约日期', value: cd.signDate },
                { label: '生效日期', value: cd.effectiveDate },
                { label: '终止日期', value: cd.endDate },
                { label: '创建人', value: contract.createdBy },
              ]}
            />

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ fontWeight: 600, marginBottom: 12 }}>甲方画像</div>
            <Descriptions
              column={4}
              data={[
                { label: '公司名称', value: cd.customerName },
                { label: '联系人', value: cd.customerContact },
                { label: '联系电话', value: cd.customerPhone },
                { label: '税务登记号', value: cd.customerTaxNo || '—' },
              ]}
            />
          </Card>

          {/* 款项与回款计划 */}
          <Card title="款项与回款计划" style={{ marginBottom: 16 }}>
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
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>合同总额</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary)' }}>
                    ¥{totalAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>已回款</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--success-500)' }}>
                    ¥{receivedAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>待回款</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning-500)' }}>
                    ¥{receivableAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>到账率</div>
                  <Progress
                    percent={receivedRate}
                    color={receivedRate >= 80 ? 'var(--success-500)' : 'var(--warning-500)'}
                    style={{ marginTop: 8 }}
                  />
                </Col>
              </Row>
            </div>
            <Table
              columns={paymentColumns}
              data={cd.paymentPlans}
              pagination={false}
              rowKey="period"
            />
          </Card>

          {/* 合同正文 / 扫描件归档 */}
          <Card title="合同文件" style={{ marginBottom: 16 }}>
            <Tabs activeTab={activeTab} onChange={setActiveTab}>
              <TabPane key="document" title="合同正文">
                {selectedVersion ? (
                  <div
                    style={{
                      background: '#f7f8fa',
                      padding: 16,
                      borderRadius: 6,
                      maxHeight: 600,
                      overflow: 'auto',
                    }}
                    dangerouslySetInnerHTML={{ __html: selectedVersion.renderedHtml }}
                  />
                ) : (
                  <Result status="info" title="该版本无可用预览" />
                )}
              </TabPane>
              <TabPane
                key="scan"
                title={`扫描件归档${contract.archivedScans.length > 0 ? ` (${contract.archivedScans.length})` : ''}`}
              >
                <ScanFileList
                  entries={contract.archivedScans}
                  uploadEnabled={uploadEnabled}
                  uploadIntent={uploadIntent}
                  onUpload={(files) => uploadScan(contract.id, files)}
                  onSetPrimary={(entryId) => setPrimaryScan(contract.id, entryId)}
                />
                {!uploadEnabled && contract.archivedScans.length === 0 && (
                  <Result
                    status="info"
                    title="尚未到归档阶段"
                    subTitle={`合同需进入「待回寄」状态后方可上传扫描件。当前状态：${CONTRACT_STATUS_LABEL[contract.status]}`}
                  />
                )}
              </TabPane>
            </Tabs>
          </Card>

          {/* 审批记录 */}
          <Card title="审批记录" style={{ marginBottom: 16 }}>
            {showApprovalForSelected ? (
              <Timeline>
                {contract.approvalFlow.map((node, index) => (
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
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{node.step}</span>
                      {node.time && (
                        <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--color-text-3)' }}>
                          {node.time}
                        </span>
                      )}
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
                        }}
                      >
                        {node.comment}
                      </div>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline>
            ) : (
              <Result
                status="info"
                title="该版本未提交审批"
                subTitle="切换到 ✅ 标记的版本可查看审批记录。"
              />
            )}
          </Card>

        </Col>

        {/* 右侧动态侧边栏 30% */}
        <Col span={7}>
          {/* 流转进度（形成期）/ 项目里程碑（履行期，本次只占位） */}
          {contract.status !== 'archived' && (
            <ContractFlowProgress status={contract.status} />
          )}

          {/* 右侧 Tab：跟进记录 / 版本历史 */}
          <Tabs activeTab={activeRightTab} onChange={setActiveRightTab} style={{ marginTop: 16 }}>
            <TabPane key="followup" title={<span>📋 跟进</span>}>
              <Card
                size="small"
                style={{ borderRadius: 8 }}
                extra={<Button type="text" icon={<IconPlus />} size="small" onClick={() => setFollowUpModalVisible(true)} />}
              >
                <Timeline>
                  {followUps.map(fu => {
                    const typeMeta = FOLLOW_UP_TYPES[fu.type];
                    return (
                      <Timeline.Item key={fu.id} dot={<span style={{ fontSize: 14 }}>{typeMeta.icon}</span>}>
                        <div style={{ marginBottom: 2 }}>
                          <Tag color={typeMeta.color} style={{ color: '#fff' }} size="small">{typeMeta.label}</Tag>
                          <span style={{ fontWeight: 600, fontSize: 13, marginLeft: 4 }}>{fu.title}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>{fu.date} · {fu.author}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-2)', padding: '4px 8px', background: 'var(--color-fill-1)', borderRadius: 4 }}>
                          {fu.content}
                        </div>
                      </Timeline.Item>
                    );
                  })}
                </Timeline>
              </Card>
            </TabPane>
            <TabPane key="versions" title={<span>📜 版本</span>}>
              <VersionTimeline
                contract={contract}
                selectedVersionNo={selectedVersionNo}
                onSelectVersion={setSelectedVersionNo}
              />
            </TabPane>
          </Tabs>
        </Col>
      </Row>

      {/* 添加跟进记录弹窗 */}
      <Modal
        title="添加跟进记录"
        visible={followUpModalVisible}
        onOk={handleAddFollowUp}
        onCancel={() => setFollowUpModalVisible(false)}
        autoFocus={false}
        focusLock={true}
        style={{ width: 520 }}
      >
        <Form form={followUpForm} layout="vertical">
          <FormItem label="跟进类型" field="type" rules={[{ required: true, message: '请选择类型' }]}>
            <Select placeholder="选择跟进类型">
              {Object.entries(FOLLOW_UP_TYPES).map(([k, m]) => (
                <Select.Option key={k} value={k}>{m.icon} {m.label}</Select.Option>
              ))}
            </Select>
          </FormItem>
          <FormItem label="标题" field="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="简要描述" />
          </FormItem>
          <FormItem label="详细内容" field="content" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea placeholder="详细描述跟进内容..." autoSize={{ minRows: 3, maxRows: 6 }} />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
