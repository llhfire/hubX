import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
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
  Select,
  Space,
  Steps,
  Tag,
  Typography,
} from '@arco-design/web-react';
import { IconLeft } from '@arco-design/web-react/icon';
import { useContracts } from './ContractsContext';
import {
  findLeadContext,
  findQuotation,
  parseQuoteAmount,
  type LeadContext,
} from './leadContextMock';
import { findCompanyEntityByName } from '../company-entity/companyEntityData';
import { contractTemplates, getTemplatesByCategory } from './templates';
import { findLatestApprovedQuote } from './utils';
import type { ContractFormData, PaymentPlanItem, QuotationRecord } from './types';

const Title = Typography.Title;
const Step = Steps.Step;

const STEP_TITLES = ['客户信息', '报价信息', '合同周期', '付款方式与回款计划'];

// 默认付款比例（2 期 50/50）
function makeDefaultPaymentPlans(total: number): PaymentPlanItem[] {
  return [
    { period: 1, expectedDate: '', amount: Math.round(total * 0.5), percentage: 50 },
    { period: 2, expectedDate: '', amount: Math.round(total * 0.5), percentage: 50 },
  ];
}

function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDaysStr(base: string, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 把 "3个月" 这种工期字面量转成天数；解析失败返回 90 作为兜底。
function periodToDays(period: string | undefined): number {
  if (!period) return 90;
  const m = period.match(/(\d+)\s*个?\s*月/);
  if (m) return Number(m[1]) * 30;
  const d = period.match(/(\d+)\s*天/);
  if (d) return Number(d[1]);
  return 90;
}

// 根据线索 + 报价初始化 Wizard 表单数据。
function initFormDataFromContext(
  lead: LeadContext | null,
  quote: QuotationRecord | null,
): ContractFormData {
  const entity = lead ? findCompanyEntityByName(lead.customerEntity) : undefined;
  const totalAmount = quote ? parseQuoteAmount(quote.amount) : 0;
  const today = todayStr();
  const effective = addDaysStr(today, 1);
  const end = addDaysStr(effective, periodToDays(quote?.period ?? lead?.estimatedDuration));
  return {
    contractName: lead ? `${lead.customerName}${lead.productCategory}合同` : '',
    productCategory: lead?.productCategory ?? '软件开发',
    signingEntity: entity?.shortName ?? quote?.entity ?? '中科软艺',
    customerName: lead?.customerName ?? '',
    customerContact: lead?.contactPerson ?? '',
    customerPhone: lead?.contactPhone ?? '',
    customerEmail: lead?.contactEmail ?? '',
    customerAddress: entity?.address ?? '',
    customerTaxNo: entity?.invoiceTaxNumber ?? '',
    bankName: entity?.invoiceBankName ?? '',
    bankAccount: entity?.invoiceBankAccount ?? '',
    contractContent:
      '乙方按甲方需求规格说明书完成系统设计、开发、测试、部署及培训，提供 12 个月免费质保。',
    signDate: today,
    effectiveDate: effective,
    endDate: end,
    paymentMethod: '公对公',
    totalAmount,
    rebateAmount: 0,
    paymentPlans: makeDefaultPaymentPlans(totalAmount),
    templateId: 'software_sales',
  };
}

export function ContractWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createFromWizard } = useContracts();

  const leadId = searchParams.get('leadId');
  const quoteId = searchParams.get('quoteId');

  const lead = useMemo(() => findLeadContext(leadId), [leadId]);

  // 优先用 URL 上的 quoteId；没有则取最新已审批报价；都没就 null。
  const initialQuote = useMemo<QuotationRecord | null>(() => {
    if (quoteId) {
      const q = findQuotation(leadId, quoteId);
      if (q) return q;
    }
    if (lead) {
      return findLatestApprovedQuote(lead.quotations);
    }
    return null;
  }, [leadId, quoteId, lead]);

  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(initialQuote?.id ?? null);
  const selectedQuote = useMemo(
    () =>
      lead && selectedQuoteId
        ? lead.quotations.find((q) => q.id === selectedQuoteId) ?? null
        : null,
    [lead, selectedQuoteId],
  );

  const [formData, setFormData] = useState<ContractFormData>(() =>
    initFormDataFromContext(lead, initialQuote),
  );
  const [step, setStep] = useState(0);

  // 当前步骤校验通过才能进入下一步。校验分散在每步 onNext 里。
  const updateField = <K extends keyof ContractFormData>(key: K, value: ContractFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // 报价金额变化时，按比例重算每期金额
  const handleTotalAmountChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      totalAmount: value,
      paymentPlans: prev.paymentPlans.map((p) => ({
        ...p,
        amount: Math.round((value * p.percentage) / 100),
      })),
    }));
  };

  // 期数变化：保留已填的期，新增期默认 0%
  const handlePeriodCountChange = (count: number) => {
    setFormData((prev) => {
      const next: PaymentPlanItem[] = Array.from({ length: count }).map((_, idx) => {
        const existing = prev.paymentPlans[idx];
        return (
          existing ?? {
            period: idx + 1,
            expectedDate: '',
            amount: 0,
            percentage: 0,
          }
        );
      });
      // 重写 period 序号
      return { ...prev, paymentPlans: next.map((p, i) => ({ ...p, period: i + 1 })) };
    });
  };

  const handlePeriodPercentageChange = (idx: number, percentage: number) => {
    setFormData((prev) => {
      const next = prev.paymentPlans.map((p, i) =>
        i === idx
          ? { ...p, percentage, amount: Math.round((prev.totalAmount * percentage) / 100) }
          : p,
      );
      return { ...prev, paymentPlans: next };
    });
  };

  const handlePeriodDateChange = (idx: number, date: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentPlans: prev.paymentPlans.map((p, i) => (i === idx ? { ...p, expectedDate: date } : p)),
    }));
  };

  const totalPercentage = formData.paymentPlans.reduce((sum, p) => sum + (p.percentage ?? 0), 0);

  const goNext = () => {
    // 简单的每步校验
    if (step === 0) {
      if (!formData.customerName || !formData.customerContact || !formData.customerPhone) {
        Message.error('请补全客户信息（公司名称 / 联系人 / 联系电话）');
        return;
      }
    }
    if (step === 1) {
      if (!formData.totalAmount || formData.totalAmount <= 0) {
        Message.error('请填写有效的合同总额');
        return;
      }
    }
    if (step === 2) {
      if (!formData.signDate || !formData.effectiveDate || !formData.endDate) {
        Message.error('请补全合同周期日期');
        return;
      }
    }
    setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    if (Math.abs(totalPercentage - 100) > 0.01) {
      Message.error(`回款计划总比例应为 100%，当前为 ${totalPercentage.toFixed(2)}%`);
      return;
    }
    const created = createFromWizard({
      leadId: leadId ?? undefined,
      quoteId: selectedQuoteId ?? undefined,
      formData,
    });
    Message.success(`合同 ${created.contractNo} 已创建草稿，进入编辑页`);
    navigate(`/contracts/${created.id}/edit`);
  };

  const cancel = () => {
    navigate(-1);
  };

  // ====== 渲染 ======

  return (
    <div>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <Space>
          <Button type="text" icon={<IconLeft />} onClick={cancel}>
            返回
          </Button>
          <Title heading={4} style={{ margin: 0 }}>
            新建合同
          </Title>
          {lead && (
            <Tag color="arcoblue">
              来自线索：{lead.leadName}
            </Tag>
          )}
        </Space>
        <Space>
          <Button onClick={cancel}>取消</Button>
          {step > 0 && <Button onClick={goPrev}>上一步</Button>}
          {step < STEP_TITLES.length - 1 ? (
            <Button type="primary" onClick={goNext}>
              下一步
            </Button>
          ) : (
            <Button type="primary" onClick={finish}>
              进入合同编辑
            </Button>
          )}
        </Space>
      </div>

      <Card>
        <Steps current={step} style={{ marginBottom: 24 }}>
          {STEP_TITLES.map((t) => (
            <Step key={t} title={t} />
          ))}
        </Steps>

        {step === 0 && (
          <StepCustomer formData={formData} updateField={updateField} lead={lead} />
        )}
        {step === 1 && (
          <StepQuote
            formData={formData}
            updateField={updateField}
            handleTotalAmountChange={handleTotalAmountChange}
            lead={lead}
            selectedQuoteId={selectedQuoteId}
            setSelectedQuoteId={setSelectedQuoteId}
            selectedQuote={selectedQuote}
          />
        )}
        {step === 2 && <StepPeriod formData={formData} updateField={updateField} />}
        {step === 3 && (
          <StepPayment
            formData={formData}
            updateField={updateField}
            handlePeriodCountChange={handlePeriodCountChange}
            handlePeriodPercentageChange={handlePeriodPercentageChange}
            handlePeriodDateChange={handlePeriodDateChange}
            totalPercentage={totalPercentage}
          />
        )}
      </Card>
    </div>
  );
}

// ====== 各步骤的子组件 ======

function StepCustomer({
  formData,
  updateField,
  lead,
}: {
  formData: ContractFormData;
  updateField: <K extends keyof ContractFormData>(k: K, v: ContractFormData[K]) => void;
  lead: LeadContext | null;
}) {
  return (
    <div>
      <Alert
        type="info"
        content={
          lead
            ? `已自动从线索"${lead.leadName}"和客户主体"${lead.customerEntity}"带入客户信息，本步骤可调整。`
            : '未指定关联线索，请手动填写客户信息。'
        }
        style={{ marginBottom: 16 }}
      />
      <Form layout="vertical">
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="公司名称" required>
              <Input
                value={formData.customerName}
                onChange={(v) => updateField('customerName', v)}
                placeholder="客户公司全称"
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="联系人" required>
              <Input
                value={formData.customerContact}
                onChange={(v) => updateField('customerContact', v)}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="联系电话" required>
              <Input
                value={formData.customerPhone}
                onChange={(v) => updateField('customerPhone', v)}
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="电子邮件">
              <Input
                value={formData.customerEmail}
                onChange={(v) => updateField('customerEmail', v)}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Form.Item label="通讯地址">
          <Input.TextArea
            rows={2}
            value={formData.customerAddress}
            onChange={(v) => updateField('customerAddress', v)}
          />
        </Form.Item>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="税务登记号">
              <Input
                value={formData.customerTaxNo}
                onChange={(v) => updateField('customerTaxNo', v)}
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="开户银行">
              <Input
                value={formData.bankName}
                onChange={(v) => updateField('bankName', v)}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Form.Item label="银行账号">
          <Input
            value={formData.bankAccount}
            onChange={(v) => updateField('bankAccount', v)}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

function StepQuote({
  formData,
  updateField,
  handleTotalAmountChange,
  lead,
  selectedQuoteId,
  setSelectedQuoteId,
  selectedQuote,
}: {
  formData: ContractFormData;
  updateField: <K extends keyof ContractFormData>(k: K, v: ContractFormData[K]) => void;
  handleTotalAmountChange: (v: number) => void;
  lead: LeadContext | null;
  selectedQuoteId: string | null;
  setSelectedQuoteId: (id: string | null) => void;
  selectedQuote: QuotationRecord | null;
}) {
  const quoteAmount = selectedQuote ? parseQuoteAmount(selectedQuote.amount) : 0;
  const mismatch = quoteAmount > 0 && Math.abs(quoteAmount - formData.totalAmount) > 0.01;
  const noApproved = lead && !lead.quotations.some((q) => q.flowStatus === '已审核' && q.status === '已报价');

  return (
    <div>
      {noApproved && (
        <Alert
          type="warning"
          content="该线索下尚未发现已审批通过的报价单。建议先完成报价审批；继续建合同时，请仔细核对金额。"
          style={{ marginBottom: 16 }}
        />
      )}

      {lead && lead.quotations.length > 0 && (
        <Form.Item label="关联报价单">
          <Select
            value={selectedQuoteId ?? undefined}
            placeholder="选择报价单"
            onChange={(v) => setSelectedQuoteId(v)}
            allowClear
          >
            {lead.quotations.map((q) => (
              <Select.Option key={q.id} value={q.id}>
                {q.name}
                {q.flowStatus === '已审核' && q.status === '已报价' ? '（已审批）' : '（未审批）'}
                {q.amount ? ` · ¥${q.amount}` : ''}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

      {selectedQuote && (
        <Card style={{ background: 'var(--color-fill-2)', marginBottom: 16 }} bordered={false}>
          <Grid.Row gutter={16}>
            <Grid.Col span={6}>
              <div style={{ color: 'var(--color-text-3)' }}>报价主体</div>
              <div style={{ fontWeight: 600 }}>{selectedQuote.entity ?? '—'}</div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div style={{ color: 'var(--color-text-3)' }}>报价金额</div>
              <div style={{ fontWeight: 600 }}>¥{selectedQuote.amount ?? '—'}</div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div style={{ color: 'var(--color-text-3)' }}>预计工期</div>
              <div style={{ fontWeight: 600 }}>{selectedQuote.period ?? '—'}</div>
            </Grid.Col>
            <Grid.Col span={6}>
              <div style={{ color: 'var(--color-text-3)' }}>审批状态</div>
              <div style={{ fontWeight: 600 }}>
                {selectedQuote.flowStatus === '已审核' && selectedQuote.status === '已报价'
                  ? '✅ 已审批通过'
                  : '⏳ 未通过审批'}
              </div>
            </Grid.Col>
          </Grid.Row>
        </Card>
      )}

      <Form layout="vertical">
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="合同名称" required>
              <Input
                value={formData.contractName}
                onChange={(v) => updateField('contractName', v)}
                placeholder="例如：A公司CRM系统开发合同"
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="产品类别" required>
              <Select
                value={formData.productCategory}
                onChange={(v) => updateField('productCategory', v)}
              >
                <Select.Option value="软件开发">软件开发</Select.Option>
                <Select.Option value="系统集成">系统集成</Select.Option>
                <Select.Option value="技术服务">技术服务</Select.Option>
                <Select.Option value="云服务">云服务</Select.Option>
              </Select>
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="我方签约主体">
              <Input
                value={formData.signingEntity}
                onChange={(v) => updateField('signingEntity', v)}
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="合同总额（元）" required>
              <InputNumber
                value={formData.totalAmount}
                onChange={(v) => handleTotalAmountChange(Number(v) || 0)}
                style={{ width: '100%' }}
                min={0}
                precision={2}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
        {mismatch && (
          <Alert
            type="warning"
            content={`合同总额（¥${formData.totalAmount.toLocaleString()}）与报价单金额（¥${quoteAmount.toLocaleString()}）不一致，请确认是否谈判调整。`}
            style={{ marginBottom: 16 }}
          />
        )}
        <Form.Item label="合同主要内容">
          <Input.TextArea
            value={formData.contractContent}
            onChange={(v) => updateField('contractContent', v)}
            rows={4}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

function StepPeriod({
  formData,
  updateField,
}: {
  formData: ContractFormData;
  updateField: <K extends keyof ContractFormData>(k: K, v: ContractFormData[K]) => void;
}) {
  return (
    <div>
      <Alert
        type="info"
        content="生效日期、终止日期默认按报价工期推算；可手动调整。"
        style={{ marginBottom: 16 }}
      />
      <Form layout="vertical">
        <Grid.Row gutter={16}>
          <Grid.Col span={8}>
            <Form.Item label="签约日期" required>
              <DatePicker
                style={{ width: '100%' }}
                value={formData.signDate}
                onChange={(value) => updateField('signDate', value as string)}
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={8}>
            <Form.Item label="生效日期" required>
              <DatePicker
                style={{ width: '100%' }}
                value={formData.effectiveDate}
                onChange={(value) => updateField('effectiveDate', value as string)}
              />
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={8}>
            <Form.Item label="终止日期" required>
              <DatePicker
                style={{ width: '100%' }}
                value={formData.endDate}
                onChange={(value) => updateField('endDate', value as string)}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>
      </Form>
    </div>
  );
}

function StepPayment({
  formData,
  updateField,
  handlePeriodCountChange,
  handlePeriodPercentageChange,
  handlePeriodDateChange,
  totalPercentage,
}: {
  formData: ContractFormData;
  updateField: <K extends keyof ContractFormData>(k: K, v: ContractFormData[K]) => void;
  handlePeriodCountChange: (count: number) => void;
  handlePeriodPercentageChange: (idx: number, pct: number) => void;
  handlePeriodDateChange: (idx: number, date: string) => void;
  totalPercentage: number;
}) {
  const totalAmountSum = formData.paymentPlans.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const periodCount = formData.paymentPlans.length;
  const pctOk = Math.abs(totalPercentage - 100) < 0.01;

  return (
    <div>
      <Form layout="vertical">
        <Grid.Row gutter={16}>
          <Grid.Col span={12}>
            <Form.Item label="付款方式" required>
              <Select
                value={formData.paymentMethod}
                onChange={(v) => updateField('paymentMethod', v)}
              >
                <Select.Option value="公对公">公对公</Select.Option>
                <Select.Option value="私对公">私对公</Select.Option>
                <Select.Option value="分期付款">分期付款</Select.Option>
              </Select>
            </Form.Item>
          </Grid.Col>
          <Grid.Col span={12}>
            <Form.Item label="期数（1-10）">
              <InputNumber
                value={periodCount}
                onChange={(v) => handlePeriodCountChange(Math.max(1, Math.min(10, Number(v) || 1)))}
                style={{ width: '100%' }}
                min={1}
                max={10}
              />
            </Form.Item>
          </Grid.Col>
        </Grid.Row>

        <Card title="回款计划" bordered={false} style={{ background: 'var(--color-fill-2)' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1.4fr 1.2fr 1fr',
              gap: 12,
              fontSize: 12,
              color: 'var(--color-text-3)',
              padding: '0 8px 8px',
            }}
          >
            <div>期数</div>
            <div>预计回款日期</div>
            <div>占比 (%)</div>
            <div>金额（自动计算）</div>
          </div>
          {formData.paymentPlans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 1.4fr 1.2fr 1fr',
                gap: 12,
                alignItems: 'center',
                marginBottom: 8,
                padding: 8,
                background: 'var(--color-bg-2)',
                borderRadius: 4,
              }}
            >
              <div style={{ fontWeight: 600 }}>第 {plan.period} 期</div>
              <DatePicker
                style={{ width: '100%' }}
                value={plan.expectedDate}
                onChange={(value) => handlePeriodDateChange(idx, (value as string) || '')}
              />
              <InputNumber
                value={plan.percentage}
                onChange={(v) => handlePeriodPercentageChange(idx, Number(v) || 0)}
                style={{ width: '100%' }}
                min={0}
                max={100}
                precision={2}
              />
              <div style={{ fontWeight: 600, color: 'rgb(var(--primary-6))' }}>
                ¥{plan.amount.toLocaleString()}
              </div>
            </div>
          ))}
          <div
            style={{
              marginTop: 12,
              padding: '8px 12px',
              background: pctOk ? '#e6f7ff' : '#fff7e6',
              border: `1px solid ${pctOk ? '#91d5ff' : '#ffd591'}`,
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>合计占比：{totalPercentage.toFixed(2)}%（应为 100%）</span>
            <span>合计金额：¥{totalAmountSum.toLocaleString()}</span>
          </div>
        </Card>

        <Form.Item label="返点金额（元，可选）" style={{ marginTop: 16 }}>
          <InputNumber
            value={formData.rebateAmount}
            onChange={(v) => updateField('rebateAmount', Number(v) || 0)}
            style={{ width: '100%' }}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item label="合同模板（影响后续编辑页的正文模板）">
          <Select
            value={formData.templateId}
            onChange={(v) => updateField('templateId', v)}
          >
            {getTemplatesByCategory(formData.productCategory).map((t) => (
              <Select.Option key={t.id} value={t.id}>
                {t.name}
              </Select.Option>
            ))}
            {/* 兜底：如果产品类别下过滤出来的不包含全部，列出所有备用 */}
            {contractTemplates
              .filter((t) => !getTemplatesByCategory(formData.productCategory).some((m) => m.id === t.id))
              .map((t) => (
                <Select.Option key={t.id} value={t.id}>
                  {t.name}（其他）
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
}
