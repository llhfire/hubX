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
} from '@arco-design/web-react';
import {
  IconLeft,
  IconCheckCircleFill,
  IconCloseCircleFill,
  IconClockCircle,
} from '@arco-design/web-react/icon';
import { useContracts } from './contracts/ContractsContext';
import { ContractStatusBadge } from './contracts/components/ContractStatusBadge';
import { ContractActionBar } from './contracts/components/ContractActionBar';
import { VersionTimeline } from './contracts/components/VersionTimeline';
import { ScanFileList } from './contracts/components/ScanFileList';
import { ContractFlowProgress } from './contracts/components/ContractFlowProgress';
import { CONTRACT_STATUS_LABEL } from './contracts/utils';

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
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--primary-6))' }}>
                    ¥{totalAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>已回款</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--success-6))' }}>
                    ¥{receivedAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>待回款</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'rgb(var(--orange-6))' }}>
                    ¥{receivableAmount.toLocaleString()}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: 12, color: 'var(--color-text-3)', marginBottom: 4 }}>到账率</div>
                  <Progress
                    percent={receivedRate}
                    color={receivedRate >= 80 ? '#00b42a' : '#f77234'}
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
        </Col>

        {/* 右侧动态侧边栏 30% */}
        <Col span={7}>
          {/* 流转进度（形成期）/ 项目里程碑（履行期，本次只占位） */}
          {contract.status !== 'archived' && (
            <ContractFlowProgress status={contract.status} />
          )}
          {contract.status === 'archived' && (
            <Card title="项目里程碑" style={{ marginBottom: 16 }}>
              <div style={{ color: 'var(--color-text-3)', padding: 8 }}>
                合同已归档，项目里程碑由项目模块接管展示。
                <Space style={{ marginTop: 12 }}>
                  <Button type="text" size="small" onClick={() => navigate('/projects')}>
                    去项目管理
                  </Button>
                </Space>
              </div>
            </Card>
          )}

          <div style={{ marginTop: 16 }}>
            <VersionTimeline
              contract={contract}
              selectedVersionNo={selectedVersionNo}
              onSelectVersion={setSelectedVersionNo}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}
