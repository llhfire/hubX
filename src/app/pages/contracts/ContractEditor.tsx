import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Grid,
  Input,
  InputNumber,
  Message,
  Modal,
  Result,
  Select,
  Space,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { useContracts } from './ContractsContext';
import { findQuotation, parseQuoteAmount } from './leadContextMock';
import { contractTemplates, renderTemplate } from './templates';
import { CONTRACT_STATUS_COLOR, CONTRACT_STATUS_LABEL, convertAmountToChinese } from './utils';
import { QuoteMismatchAlert } from './components/QuoteMismatchAlert';
import type { ContractFormData, PaymentPlanItem } from './types';

const Title = Typography.Title;

export function ContractEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    getById,
    saveDraft,
    saveAsVersion,
    submitForApproval,
    voidContract,
    withdrawApproval,
  } = useContracts();

  const contract = getById(id);
  const [formData, setFormData] = useState<ContractFormData | null>(
    contract ? contract.current : null,
  );
  const [versionLabelModal, setVersionLabelModal] = useState(false);
  const [versionLabelInput, setVersionLabelInput] = useState('');
  const [voidModalVisible, setVoidModalVisible] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  // 当合同对象更新（其他页面操作）但当前未脏时，把 current 同步进编辑表单
  const lastSeenContractRef = useRef(contract);
  useEffect(() => {
    if (contract && contract !== lastSeenContractRef.current) {
      // 简单策略：合同 status 变了或 current 引用变了就重置
      if (lastSeenContractRef.current?.current !== contract.current) {
        setFormData(contract.current);
      }
      lastSeenContractRef.current = contract;
    }
  }, [contract]);

  // 实时模板渲染（以表单当前内容）
  const renderedHtml = useMemo(
    () => (formData ? renderTemplate(formData.templateId, formData) : ''),
    [formData],
  );

  // 关联报价（用于不一致提醒）
  const linkedQuote = useMemo(() => {
    if (!contract) return null;
    return findQuotation(contract.leadId, contract.quoteId);
  }, [contract]);
  const quoteAmount = linkedQuote ? parseQuoteAmount(linkedQuote.amount) : 0;

  if (!contract || !formData) {
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

  const isReadonly =
    contract.status !== 'draft' && contract.status !== 'approving';

  const updateField = <K extends keyof ContractFormData>(key: K, value: ContractFormData[K]) => {
    setFormData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleTotalAmountChange = (value: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            totalAmount: value,
            paymentPlans: prev.paymentPlans.map((p) => ({
              ...p,
              amount: Math.round((value * p.percentage) / 100),
            })),
          }
        : prev,
    );
  };

  const handlePeriodChange = (idx: number, key: keyof PaymentPlanItem, value: number | string) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        paymentPlans: prev.paymentPlans.map((p, i) => {
          if (i !== idx) return p;
          if (key === 'percentage') {
            const pct = Number(value) || 0;
            return { ...p, percentage: pct, amount: Math.round((prev.totalAmount * pct) / 100) };
          }
          return { ...p, [key]: value } as PaymentPlanItem;
        }),
      };
    });
  };

  const onSaveDraft = () => {
    saveDraft(contract.id, formData);
    Message.success('草稿已保存');
  };

  const onSaveAsVersion = () => {
    setVersionLabelInput('');
    setVersionLabelModal(true);
  };

  const onConfirmVersionLabel = () => {
    if (!versionLabelInput.trim()) {
      Message.error('请填写版本说明');
      return;
    }
    saveAsVersion(contract.id, formData, versionLabelInput.trim());
    Message.success('已保存为新版本');
    setVersionLabelModal(false);
  };

  const onSubmitApproval = () => {
    if (!formData.contractName) {
      Message.error('请先填写合同名称');
      return;
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      Message.error('请先填写合同总额');
      return;
    }
    submitForApproval(contract.id, formData);
    Message.success('已提交审批');
    navigate(`/contracts/${contract.id}`);
  };

  const onWithdraw = () => {
    withdrawApproval(contract.id);
    Message.success('已撤回审批');
  };

  const onVoid = () => {
    if (!voidReason.trim()) {
      Message.error('请填写作废原因');
      return;
    }
    voidContract(contract.id, voidReason.trim());
    Message.success('合同已作废');
    setVoidModalVisible(false);
    navigate(`/contracts/${contract.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="text" icon={<IconLeft />} onClick={() => navigate(`/contracts/${contract.id}`)}>
            返回详情
          </Button>
          <Title heading={4} style={{ margin: 0 }}>
            {formData.contractName || '（未命名合同）'}
          </Title>
          <Tag color="gray">{contract.contractNo}</Tag>
          <Tag color={CONTRACT_STATUS_COLOR[contract.status]}>
            {CONTRACT_STATUS_LABEL[contract.status]}
          </Tag>
        </Space>
        <Space>
          {contract.status === 'draft' && (
            <>
              <Button onClick={onSaveDraft}>保存草稿</Button>
              <Button onClick={onSaveAsVersion}>保存为新版本</Button>
              <Button type="primary" onClick={onSubmitApproval}>
                提交审批
              </Button>
              <Button status="danger" onClick={() => setVoidModalVisible(true)}>
                作废
              </Button>
            </>
          )}
          {contract.status === 'approving' && (
            <>
              <Button onClick={onWithdraw}>撤回审批</Button>
              <Button type="primary" onClick={() => navigate(`/contracts/${contract.id}`)}>
                查看审批进度
              </Button>
            </>
          )}
          {isReadonly && (
            <Button type="primary" onClick={() => navigate(`/contracts/${contract.id}`)}>
              查看合同详情
            </Button>
          )}
        </Space>
      </div>

      <QuoteMismatchAlert
        contractAmount={formData.totalAmount}
        quoteAmount={quoteAmount}
        quoteName={linkedQuote?.name}
      />

      {isReadonly && (
        <Alert
          type="info"
          content="当前合同已进入流转阶段，仅可查看。如需修改请作废后重建。"
          style={{ marginBottom: 16 }}
        />
      )}

      <Grid.Row gutter={16}>
        {/* 左侧表单 */}
        <Grid.Col span={14}>
          <Card title="合同信息">
            <Form layout="vertical">
              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="合同编号">
                    <Input disabled value={contract.contractNo} />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="合同名称" required>
                    <Input
                      value={formData.contractName}
                      onChange={(v) => updateField('contractName', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>

              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="产品类别">
                    <Select
                      value={formData.productCategory}
                      onChange={(v) => updateField('productCategory', v)}
                      disabled={isReadonly}
                    >
                      <Select.Option value="软件开发">软件开发</Select.Option>
                      <Select.Option value="系统集成">系统集成</Select.Option>
                      <Select.Option value="技术服务">技术服务</Select.Option>
                      <Select.Option value="云服务">云服务</Select.Option>
                    </Select>
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="我方签约主体">
                    <Input
                      value={formData.signingEntity}
                      onChange={(v) => updateField('signingEntity', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>

              <Form.Item label="关联线索 / 报价单">
                <Input
                  disabled
                  value={
                    contract.leadId
                      ? `线索 ${contract.leadId}${contract.quoteId ? ` · 报价单 ${contract.quoteId}` : ''}`
                      : '（未关联线索）'
                  }
                />
              </Form.Item>
            </Form>
          </Card>

          <Card title="甲方（客户）信息" style={{ marginTop: 16 }}>
            <Form layout="vertical">
              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="公司名称" required>
                    <Input
                      value={formData.customerName}
                      onChange={(v) => updateField('customerName', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="联系人">
                    <Input
                      value={formData.customerContact}
                      onChange={(v) => updateField('customerContact', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="联系电话">
                    <Input
                      value={formData.customerPhone}
                      onChange={(v) => updateField('customerPhone', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="电子邮件">
                    <Input
                      value={formData.customerEmail}
                      onChange={(v) => updateField('customerEmail', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <Form.Item label="通讯地址">
                <Input.TextArea
                  rows={2}
                  value={formData.customerAddress}
                  onChange={(v) => updateField('customerAddress', v)}
                  disabled={isReadonly}
                />
              </Form.Item>
              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="税务登记号">
                    <Input
                      value={formData.customerTaxNo}
                      onChange={(v) => updateField('customerTaxNo', v)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="开户银行 · 账号">
                    <Input.Group compact>
                      <Input
                        style={{ width: '50%' }}
                        value={formData.bankName}
                        onChange={(v) => updateField('bankName', v)}
                        disabled={isReadonly}
                      />
                      <Input
                        style={{ width: '50%' }}
                        value={formData.bankAccount}
                        onChange={(v) => updateField('bankAccount', v)}
                        disabled={isReadonly}
                      />
                    </Input.Group>
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
            </Form>
          </Card>

          <Card title="合同条款" style={{ marginTop: 16 }}>
            <Form layout="vertical">
              <Form.Item label="合同主要内容">
                <Input.TextArea
                  rows={4}
                  value={formData.contractContent}
                  onChange={(v) => updateField('contractContent', v)}
                  disabled={isReadonly}
                />
              </Form.Item>
              <Grid.Row gutter={16}>
                <Grid.Col span={8}>
                  <Form.Item label="签约日期">
                    <DatePicker
                      style={{ width: '100%' }}
                      value={formData.signDate}
                      onChange={(v) => updateField('signDate', v as string)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Form.Item label="生效日期">
                    <DatePicker
                      style={{ width: '100%' }}
                      value={formData.effectiveDate}
                      onChange={(v) => updateField('effectiveDate', v as string)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={8}>
                  <Form.Item label="终止日期">
                    <DatePicker
                      style={{ width: '100%' }}
                      value={formData.endDate}
                      onChange={(v) => updateField('endDate', v as string)}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row gutter={16}>
                <Grid.Col span={12}>
                  <Form.Item label="付款方式">
                    <Select
                      value={formData.paymentMethod}
                      onChange={(v) => updateField('paymentMethod', v)}
                      disabled={isReadonly}
                    >
                      <Select.Option value="公对公">公对公</Select.Option>
                      <Select.Option value="私对公">私对公</Select.Option>
                      <Select.Option value="分期付款">分期付款</Select.Option>
                    </Select>
                  </Form.Item>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Form.Item label="合同总额（元）">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={formData.totalAmount}
                      onChange={(v) => handleTotalAmountChange(Number(v) || 0)}
                      min={0}
                      precision={2}
                      disabled={isReadonly}
                    />
                  </Form.Item>
                </Grid.Col>
              </Grid.Row>
              <div
                style={{
                  padding: '8px 12px',
                  background: 'var(--color-fill-2)',
                  borderRadius: 4,
                  marginBottom: 16,
                  color: 'var(--color-text-2)',
                }}
              >
                大写：{convertAmountToChinese(formData.totalAmount)}
              </div>
            </Form>

            <div style={{ fontWeight: 600, marginBottom: 8 }}>回款计划</div>
            {formData.paymentPlans.map((plan, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1.4fr 1fr 1fr',
                  gap: 12,
                  alignItems: 'center',
                  marginBottom: 8,
                  padding: 8,
                  background: 'var(--color-fill-1)',
                  borderRadius: 4,
                }}
              >
                <div style={{ fontWeight: 600 }}>第 {plan.period} 期</div>
                <DatePicker
                  style={{ width: '100%' }}
                  value={plan.expectedDate}
                  onChange={(v) => handlePeriodChange(idx, 'expectedDate', (v as string) || '')}
                  disabled={isReadonly}
                />
                <InputNumber
                  style={{ width: '100%' }}
                  value={plan.percentage}
                  onChange={(v) => handlePeriodChange(idx, 'percentage', Number(v) || 0)}
                  min={0}
                  max={100}
                  precision={2}
                  suffix="%"
                  disabled={isReadonly}
                />
                <div style={{ fontWeight: 600, color: 'rgb(var(--primary-6))' }}>
                  ¥{plan.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </Card>
        </Grid.Col>

        {/* 右侧实时预览 */}
        <Grid.Col span={10}>
          <Card
            title="模板预览"
            extra={
              <Select
                value={formData.templateId}
                onChange={(v) => updateField('templateId', v)}
                style={{ width: 200 }}
                disabled={isReadonly}
              >
                {contractTemplates.map((t) => (
                  <Select.Option key={t.id} value={t.id}>
                    {t.name}
                  </Select.Option>
                ))}
              </Select>
            }
            style={{ position: 'sticky', top: 16 }}
            bodyStyle={{ maxHeight: 'calc(100vh - 180px)', overflow: 'auto', padding: 16 }}
          >
            <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          </Card>
        </Grid.Col>
      </Grid.Row>

      <Modal
        title="保存为新版本"
        visible={versionLabelModal}
        onOk={onConfirmVersionLabel}
        onCancel={() => setVersionLabelModal(false)}
      >
        <Form.Item label="版本说明" required>
          <Input
            placeholder="例如：客户砍价后调整金额和付款节奏"
            value={versionLabelInput}
            onChange={setVersionLabelInput}
          />
        </Form.Item>
      </Modal>

      <Modal
        title="作废合同"
        visible={voidModalVisible}
        onOk={onVoid}
        onCancel={() => setVoidModalVisible(false)}
        okButtonProps={{ status: 'danger' }}
      >
        <Form.Item label="作废原因" required>
          <Input.TextArea
            rows={3}
            value={voidReason}
            onChange={setVoidReason}
            placeholder="请填写作废原因，作废后无法恢复"
          />
        </Form.Item>
      </Modal>
    </div>
  );
}

// （Alert 已在顶部的统一 import 中导入）
