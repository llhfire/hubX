import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react';
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
        toast.error('请补全客户信息（公司名称 / 联系人 / 联系电话）');
        return;
      }
    }
    if (step === 1) {
      if (!formData.totalAmount || formData.totalAmount <= 0) {
        toast.error('请填写有效的合同总额');
        return;
      }
    }
    if (step === 2) {
      if (!formData.signDate || !formData.effectiveDate || !formData.endDate) {
        toast.error('请补全合同周期日期');
        return;
      }
    }
    setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const finish = () => {
    if (Math.abs(totalPercentage - 100) > 0.01) {
      toast.error(`回款计划总比例应为 100%，当前为 ${totalPercentage.toFixed(2)}%`);
      return;
    }
    const created = createFromWizard({
      leadId: leadId ?? undefined,
      quoteId: selectedQuoteId ?? undefined,
      formData,
    });
    toast.success(`合同 ${created.contractNo} 已创建草稿，进入编辑页`);
    navigate(`/contracts/${created.id}/edit`);
  };

  const cancel = () => {
    navigate(-1);
  };

  // ====== 渲染 ======

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={cancel}>
            <ArrowLeft className="size-4" />
            返回
          </Button>
          <h4 className="text-xl font-semibold m-0">新建合同</h4>
          {lead && (
            <Badge>来自线索：{lead.leadName}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={cancel}>取消</Button>
          {step > 0 && <Button variant="outline" onClick={goPrev}>上一步</Button>}
          {step < STEP_TITLES.length - 1 ? (
            <Button onClick={goNext}>下一步</Button>
          ) : (
            <Button onClick={finish}>进入合同编辑</Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {/* Steps indicator */}
          <div className="flex items-center mb-6">
            {STEP_TITLES.map((t, idx) => (
              <div key={t} className="flex items-center">
                <div className={`flex items-center justify-center size-8 rounded-full text-sm font-medium ${
                  idx <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {idx + 1}
                </div>
                <span className={`ml-2 text-sm ${idx <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {t}
                </span>
                {idx < STEP_TITLES.length - 1 && (
                  <div className={`mx-3 h-0.5 w-12 ${idx < step ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>

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
        </CardContent>
      </Card>
    </div>
  );
}

// ====== 各步骤的子组件 ======

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}

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
      <Alert className="mb-4">
        <Info className="size-4" />
        <AlertDescription>
          {lead
            ? `已自动从线索"${lead.leadName}"和客户主体"${lead.customerEntity}"带入客户信息，本步骤可调整。`
            : '未指定关联线索，请手动填写客户信息。'}
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="公司名称" required>
            <Input
              value={formData.customerName}
              onChange={(e) => updateField('customerName', e.target.value)}
              placeholder="客户公司全称"
            />
          </FormField>
          <FormField label="联系人" required>
            <Input
              value={formData.customerContact}
              onChange={(e) => updateField('customerContact', e.target.value)}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="联系电话" required>
            <Input
              value={formData.customerPhone}
              onChange={(e) => updateField('customerPhone', e.target.value)}
            />
          </FormField>
          <FormField label="电子邮件">
            <Input
              value={formData.customerEmail}
              onChange={(e) => updateField('customerEmail', e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="通讯地址">
          <Textarea
            rows={2}
            value={formData.customerAddress}
            onChange={(e) => updateField('customerAddress', e.target.value)}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="税务登记号">
            <Input
              value={formData.customerTaxNo}
              onChange={(e) => updateField('customerTaxNo', e.target.value)}
            />
          </FormField>
          <FormField label="开户银行">
            <Input
              value={formData.bankName}
              onChange={(e) => updateField('bankName', e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="银行账号">
          <Input
            value={formData.bankAccount}
            onChange={(e) => updateField('bankAccount', e.target.value)}
          />
        </FormField>
      </div>
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
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            该线索下尚未发现已审批通过的报价单。建议先完成报价审批；继续建合同时，请仔细核对金额。
          </AlertDescription>
        </Alert>
      )}

      {lead && lead.quotations.length > 0 && (
        <FormField label="关联报价单">
          <Select value={selectedQuoteId ?? undefined} onValueChange={(v) => setSelectedQuoteId(v)}>
            <SelectTrigger>
              <SelectValue placeholder="选择报价单" />
            </SelectTrigger>
            <SelectContent>
              {lead.quotations.map((q) => (
                <SelectItem key={q.id} value={q.id}>
                  {q.name}
                  {q.flowStatus === '已审核' && q.status === '已报价' ? '（已审批）' : '（未审批）'}
                  {q.amount ? ` · ¥${q.amount}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      )}

      {selectedQuote && (
        <Card className="mb-4 bg-muted/50">
          <CardContent className="pt-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-muted-foreground text-sm">报价主体</div>
                <div className="font-semibold">{selectedQuote.entity ?? '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">报价金额</div>
                <div className="font-semibold">&yen;{selectedQuote.amount ?? '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">预计工期</div>
                <div className="font-semibold">{selectedQuote.period ?? '—'}</div>
              </div>
              <div>
                <div className="text-muted-foreground text-sm">审批状态</div>
                <div className="font-semibold">
                  {selectedQuote.flowStatus === '已审核' && selectedQuote.status === '已报价'
                    ? '已审批通过'
                    : '未通过审批'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="合同名称" required>
            <Input
              value={formData.contractName}
              onChange={(e) => updateField('contractName', e.target.value)}
              placeholder="例如：A公司CRM系统开发合同"
            />
          </FormField>
          <FormField label="产品类别" required>
            <Select value={formData.productCategory} onValueChange={(v) => updateField('productCategory', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="软件开发">软件开发</SelectItem>
                <SelectItem value="系统集成">系统集成</SelectItem>
                <SelectItem value="技术服务">技术服务</SelectItem>
                <SelectItem value="云服务">云服务</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="我方签约主体">
            <Input
              value={formData.signingEntity}
              onChange={(e) => updateField('signingEntity', e.target.value)}
            />
          </FormField>
          <FormField label="合同总额（元）" required>
            <Input
              type="number"
              value={formData.totalAmount}
              onChange={(e) => handleTotalAmountChange(Number(e.target.value) || 0)}
              min={0}
              step={0.01}
            />
          </FormField>
        </div>
        {mismatch && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="size-4" />
            <AlertDescription>
              合同总额（&yen;{formData.totalAmount.toLocaleString()}）与报价单金额（&yen;{quoteAmount.toLocaleString()}）不一致，请确认是否谈判调整。
            </AlertDescription>
          </Alert>
        )}
        <FormField label="合同主要内容">
          <Textarea
            value={formData.contractContent}
            onChange={(e) => updateField('contractContent', e.target.value)}
            rows={4}
          />
        </FormField>
      </div>
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
      <Alert className="mb-4">
        <Info className="size-4" />
        <AlertDescription>
          生效日期、终止日期默认按报价工期推算；可手动调整。
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <FormField label="签约日期" required>
            <Input
              type="date"
              value={formData.signDate}
              onChange={(e) => updateField('signDate', e.target.value)}
            />
          </FormField>
          <FormField label="生效日期" required>
            <Input
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => updateField('effectiveDate', e.target.value)}
            />
          </FormField>
          <FormField label="终止日期" required>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
          </FormField>
        </div>
      </div>
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
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="付款方式" required>
            <Select value={formData.paymentMethod} onValueChange={(v) => updateField('paymentMethod', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="公对公">公对公</SelectItem>
                <SelectItem value="私对公">私对公</SelectItem>
                <SelectItem value="分期付款">分期付款</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="期数（1-10）">
            <Input
              type="number"
              value={periodCount}
              onChange={(e) => handlePeriodCountChange(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
              min={1}
              max={10}
            />
          </FormField>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm">回款计划</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid text-xs text-muted-foreground pb-2 px-2"
              style={{ gridTemplateColumns: '60px 1.4fr 1.2fr 1fr', gap: 12 }}
            >
              <div>期数</div>
              <div>预计回款日期</div>
              <div>占比 (%)</div>
              <div>金额（自动计算）</div>
            </div>
            {formData.paymentPlans.map((plan, idx) => (
              <div
                key={idx}
                className="grid items-center mb-2 p-2 bg-background rounded"
                style={{ gridTemplateColumns: '60px 1.4fr 1.2fr 1fr', gap: 12 }}
              >
                <div className="font-semibold text-sm">第 {plan.period} 期</div>
                <Input
                  type="date"
                  value={plan.expectedDate}
                  onChange={(e) => handlePeriodDateChange(idx, e.target.value)}
                />
                <Input
                  type="number"
                  value={plan.percentage}
                  onChange={(e) => handlePeriodPercentageChange(idx, Number(e.target.value) || 0)}
                  min={0}
                  max={100}
                  step={0.01}
                />
                <div className="font-semibold text-primary">
                  &yen;{plan.amount.toLocaleString()}
                </div>
              </div>
            ))}
            <div
              className={`mt-3 p-2 rounded flex justify-between text-sm ${
                pctOk
                  ? 'bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800'
                  : 'bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
              }`}
            >
              <span>合计占比：{totalPercentage.toFixed(2)}%（应为 100%）</span>
              <span>合计金额：&yen;{totalAmountSum.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <FormField label="返点金额（元，可选）">
          <Input
            type="number"
            value={formData.rebateAmount}
            onChange={(e) => updateField('rebateAmount', Number(e.target.value) || 0)}
            min={0}
            step={0.01}
          />
        </FormField>

        <FormField label="合同模板（影响后续编辑页的正文模板）">
          <Select value={formData.templateId} onValueChange={(v) => updateField('templateId', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getTemplatesByCategory(formData.productCategory).map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
              {contractTemplates
                .filter((t) => !getTemplatesByCategory(formData.productCategory).some((m) => m.id === t.id))
                .map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}（其他）
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
    </div>
  );
}
