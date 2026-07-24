import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardAction } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ScrollArea } from '../../components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Info } from 'lucide-react';
import { useContracts } from './ContractsContext';
import { findQuotation, parseQuoteAmount } from './leadContextMock';
import { contractTemplates, renderTemplate } from './templates';
import { CONTRACT_STATUS_LABEL, convertAmountToChinese } from './utils';
import { QuoteMismatchAlert } from './components/QuoteMismatchAlert';
import type { ContractFormData, PaymentPlanItem } from './types';

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
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-2">合同不存在</h2>
        <p className="text-muted-foreground mb-4">该合同可能已被删除，或链接有误。</p>
        <Button onClick={() => navigate('/contracts')}>
          返回合同列表
        </Button>
      </div>
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
    toast.success('草稿已保存');
  };

  const onSaveAsVersion = () => {
    setVersionLabelInput('');
    setVersionLabelModal(true);
  };

  const onConfirmVersionLabel = () => {
    if (!versionLabelInput.trim()) {
      toast.error('请填写版本说明');
      return;
    }
    saveAsVersion(contract.id, formData, versionLabelInput.trim());
    toast.success('已保存为新版本');
    setVersionLabelModal(false);
  };

  const onSubmitApproval = () => {
    if (!formData.contractName) {
      toast.error('请先填写合同名称');
      return;
    }
    if (!formData.totalAmount || formData.totalAmount <= 0) {
      toast.error('请先填写合同总额');
      return;
    }
    submitForApproval(contract.id, formData);
    toast.success('已提交审批');
    navigate(`/contracts/${contract.id}`);
  };

  const onWithdraw = () => {
    withdrawApproval(contract.id);
    toast.success('已撤回审批');
  };

  const onVoid = () => {
    if (!voidReason.trim()) {
      toast.error('请填写作废原因');
      return;
    }
    voidContract(contract.id, voidReason.trim());
    toast.success('合同已作废');
    setVoidModalVisible(false);
    navigate(`/contracts/${contract.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate(`/contracts/${contract.id}`)}>
            <ArrowLeft className="size-4" />
            返回详情
          </Button>
          <h4 className="text-xl font-semibold m-0">
            {formData.contractName || '（未命名合同）'}
          </h4>
          <Badge variant="secondary">{contract.contractNo}</Badge>
          <Badge>{CONTRACT_STATUS_LABEL[contract.status]}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {contract.status === 'draft' && (
            <>
              <Button variant="outline" onClick={onSaveDraft}>保存草稿</Button>
              <Button variant="outline" onClick={onSaveAsVersion}>保存为新版本</Button>
              <Button onClick={onSubmitApproval}>提交审批</Button>
              <Button variant="destructive" onClick={() => setVoidModalVisible(true)}>作废</Button>
            </>
          )}
          {contract.status === 'approving' && (
            <>
              <Button variant="outline" onClick={onWithdraw}>撤回审批</Button>
              <Button onClick={() => navigate(`/contracts/${contract.id}`)}>查看审批进度</Button>
            </>
          )}
          {isReadonly && (
            <Button onClick={() => navigate(`/contracts/${contract.id}`)}>查看合同详情</Button>
          )}
        </div>
      </div>

      <QuoteMismatchAlert
        contractAmount={formData.totalAmount}
        quoteAmount={quoteAmount}
        quoteName={linkedQuote?.name}
      />

      {isReadonly && (
        <Alert className="mb-4">
          <Info className="size-4" />
          <AlertDescription>
            当前合同已进入流转阶段，仅可查看。如需修改请作废后重建。
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-[14fr_10fr] gap-4">
        {/* 左侧表单 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>合同信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="合同编号">
                    <Input disabled value={contract.contractNo} />
                  </FormField>
                  <FormField label="合同名称" required>
                    <Input
                      value={formData.contractName}
                      onChange={(e) => updateField('contractName', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="产品类别">
                    <Select
                      value={formData.productCategory}
                      onValueChange={(v) => updateField('productCategory', v)}
                      disabled={isReadonly}
                    >
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
                  <FormField label="我方签约主体">
                    <Input
                      value={formData.signingEntity}
                      onChange={(e) => updateField('signingEntity', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <FormField label="关联线索 / 报价单">
                  <Input
                    disabled
                    value={
                      contract.leadId
                        ? `线索 ${contract.leadId}${contract.quoteId ? ` · 报价单 ${contract.quoteId}` : ''}`
                        : '（未关联线索）'
                    }
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>甲方（客户）信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="公司名称" required>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => updateField('customerName', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                  <FormField label="联系人">
                    <Input
                      value={formData.customerContact}
                      onChange={(e) => updateField('customerContact', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="联系电话">
                    <Input
                      value={formData.customerPhone}
                      onChange={(e) => updateField('customerPhone', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                  <FormField label="电子邮件">
                    <Input
                      value={formData.customerEmail}
                      onChange={(e) => updateField('customerEmail', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <FormField label="通讯地址">
                  <Textarea
                    rows={2}
                    value={formData.customerAddress}
                    onChange={(e) => updateField('customerAddress', e.target.value)}
                    disabled={isReadonly}
                  />
                </FormField>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="税务登记号">
                    <Input
                      value={formData.customerTaxNo}
                      onChange={(e) => updateField('customerTaxNo', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                  <FormField label="开户银行 &middot; 账号">
                    <div className="flex gap-2">
                      <Input
                        className="flex-1"
                        value={formData.bankName}
                        onChange={(e) => updateField('bankName', e.target.value)}
                        disabled={isReadonly}
                        placeholder="开户银行"
                      />
                      <Input
                        className="flex-1"
                        value={formData.bankAccount}
                        onChange={(e) => updateField('bankAccount', e.target.value)}
                        disabled={isReadonly}
                        placeholder="银行账号"
                      />
                    </div>
                  </FormField>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>合同条款</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField label="合同主要内容">
                  <Textarea
                    rows={4}
                    value={formData.contractContent}
                    onChange={(e) => updateField('contractContent', e.target.value)}
                    disabled={isReadonly}
                  />
                </FormField>
                <div className="grid grid-cols-3 gap-4">
                  <FormField label="签约日期">
                    <Input
                      type="date"
                      value={formData.signDate}
                      onChange={(e) => updateField('signDate', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                  <FormField label="生效日期">
                    <Input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => updateField('effectiveDate', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                  <FormField label="终止日期">
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => updateField('endDate', e.target.value)}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="付款方式">
                    <Select
                      value={formData.paymentMethod}
                      onValueChange={(v) => updateField('paymentMethod', v)}
                      disabled={isReadonly}
                    >
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
                  <FormField label="合同总额（元）">
                    <Input
                      type="number"
                      value={formData.totalAmount}
                      onChange={(e) => handleTotalAmountChange(Number(e.target.value) || 0)}
                      min={0}
                      step={0.01}
                      disabled={isReadonly}
                    />
                  </FormField>
                </div>
                <div className="p-2 bg-muted rounded text-muted-foreground text-sm">
                  大写：{convertAmountToChinese(formData.totalAmount)}
                </div>
              </div>

              <div className="mt-4">
                <div className="font-semibold mb-2 text-sm">回款计划</div>
                {formData.paymentPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className="grid items-center mb-2 p-2 bg-muted/50 rounded"
                    style={{ gridTemplateColumns: '60px 1.4fr 1fr 1fr', gap: 12 }}
                  >
                    <div className="font-semibold text-sm">第 {plan.period} 期</div>
                    <Input
                      type="date"
                      value={plan.expectedDate}
                      onChange={(e) => handlePeriodChange(idx, 'expectedDate', e.target.value)}
                      disabled={isReadonly}
                    />
                    <Input
                      type="number"
                      value={plan.percentage}
                      onChange={(e) => handlePeriodChange(idx, 'percentage', Number(e.target.value) || 0)}
                      min={0}
                      max={100}
                      step={0.01}
                      disabled={isReadonly}
                    />
                    <div className="font-semibold text-primary text-sm">
                      &yen;{plan.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧实时预览 */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>模板预览</CardTitle>
              <CardAction>
                <Select
                  value={formData.templateId}
                  onValueChange={(v) => updateField('templateId', v)}
                  disabled={isReadonly}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contractTemplates.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardAction>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[calc(100vh-220px)]">
                <div
                  className="p-4 text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={versionLabelModal} onOpenChange={setVersionLabelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存为新版本</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>版本说明 <span className="text-destructive">*</span></Label>
            <Input
              placeholder="例如：客户砍价后调整金额和付款节奏"
              value={versionLabelInput}
              onChange={(e) => setVersionLabelInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVersionLabelModal(false)}>取消</Button>
            <Button onClick={onConfirmVersionLabel}>确认保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={voidModalVisible} onOpenChange={setVoidModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>作废合同</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>作废原因 <span className="text-destructive">*</span></Label>
            <Textarea
              rows={3}
              value={voidReason}
              onChange={(e) => setVoidReason(e.target.value)}
              placeholder="请填写作废原因，作废后无法恢复"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoidModalVisible(false)}>取消</Button>
            <Button variant="destructive" onClick={onVoid}>确认作废</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
