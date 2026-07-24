import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../components/ui/select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Upload, Download, Trash2 } from 'lucide-react';
import type { CompanyEntityPermissions, CompanyEntityRecord } from './companyEntityData';

export type CompanyEntityModalMode = 'view' | 'edit';
export type CompanyEntityModalTab = 'basic' | 'invoice' | 'files';

interface CompanyEntityInfoModalProps {
  visible: boolean;
  mode: CompanyEntityModalMode;
  defaultTab?: CompanyEntityModalTab;
  record?: CompanyEntityRecord | null;
  permissions: CompanyEntityPermissions;
  showGoManage?: boolean;
  onOk?: (values: Partial<CompanyEntityRecord>) => void;
  onCancel: () => void;
  onGoManage?: () => void;
}

const emptyRecord: CompanyEntityRecord = {
  id: '',
  name: '',
  shortName: '',
  taxNumber: '',
  legalPerson: '',
  registeredCapital: '',
  address: '',
  contactPhone: '',
  status: '启用',
  createTime: '',
  invoiceTitle: '',
  invoiceTaxNumber: '',
  invoiceBankName: '',
  invoiceBankAccount: '',
  invoiceAddress: '',
  invoicePhone: '',
  files: [],
};

export function CompanyEntityInfoModal({
  visible,
  mode,
  defaultTab = 'basic',
  record,
  permissions,
  showGoManage = false,
  onOk,
  onCancel,
  onGoManage,
}: CompanyEntityInfoModalProps) {
  const [activeTab, setActiveTab] = useState<CompanyEntityModalTab>(defaultTab);
  const [uploadVisible, setUploadVisible] = useState(false);
  const currentRecord = record || emptyRecord;
  const readonly = mode === 'view';

  // Form state for basic info + invoice info
  const [formState, setFormState] = useState<Partial<CompanyEntityRecord>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Upload form state
  const [uploadName, setUploadName] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setActiveTab(defaultTab);
    setFormState({
      name: currentRecord.name,
      shortName: currentRecord.shortName,
      taxNumber: currentRecord.taxNumber,
      legalPerson: currentRecord.legalPerson,
      registeredCapital: currentRecord.registeredCapital,
      address: currentRecord.address,
      contactPhone: currentRecord.contactPhone,
      status: currentRecord.status,
      invoiceTitle: currentRecord.invoiceTitle,
      invoiceTaxNumber: currentRecord.invoiceTaxNumber,
      invoiceBankName: currentRecord.invoiceBankName,
      invoiceBankAccount: currentRecord.invoiceBankAccount,
      invoiceAddress: currentRecord.invoiceAddress,
      invoicePhone: currentRecord.invoicePhone,
    });
    setFormErrors({});
  }, [currentRecord, defaultTab, visible]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formState.name?.trim()) errors.name = '请输入公司名称';
    if (!formState.shortName?.trim()) errors.shortName = '请输入公司简称';
    if (!formState.taxNumber?.trim()) errors.taxNumber = '请输入统一社会信用代码';
    if (!formState.invoiceTitle?.trim()) errors.invoiceTitle = '请输入开票抬头';
    if (!formState.invoiceTaxNumber?.trim()) errors.invoiceTaxNumber = '请输入纳税人识别号';
    if (!formState.invoiceBankName?.trim()) errors.invoiceBankName = '请输入开户银行';
    if (!formState.invoiceBankAccount?.trim()) errors.invoiceBankAccount = '请输入银行账号';
    if (!formState.invoiceAddress?.trim()) errors.invoiceAddress = '请输入开票地址';
    if (!formState.invoicePhone?.trim()) errors.invoicePhone = '请输入开票电话';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOk = () => {
    if (readonly) {
      onCancel();
      return;
    }

    if (validateForm()) {
      onOk?.(formState);
    }
  };

  const handleUploadSubmit = () => {
    const errors: Record<string, string> = {};
    if (!uploadName.trim()) errors.name = '请输入资料名称';
    if (!uploadFile) errors.file = '请选择文件';
    setUploadErrors(errors);
    if (Object.keys(errors).length > 0) return;

    toast.success('资料上传成功');
    setUploadVisible(false);
    setUploadName('');
    setUploadDescription('');
    setUploadFile(null);
    setUploadErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadFile(file);
    if (file) {
      setUploadErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const basicFields = [
    { label: '公司名称', value: 'name' as const },
    { label: '公司简称', value: 'shortName' as const },
    { label: '统一社会信用代码', value: 'taxNumber' as const },
    { label: '法定代表人', value: 'legalPerson' as const },
    { label: '注册资本', value: 'registeredCapital' as const },
    { label: '注册地址', value: 'address' as const },
    { label: '联系电话', value: 'contactPhone' as const },
    { label: '状态', value: 'status' as const },
  ];

  const invoiceFields = [
    { label: '开票抬头', value: 'invoiceTitle' as const },
    { label: '纳税人识别号', value: 'invoiceTaxNumber' as const },
    { label: '开户银行', value: 'invoiceBankName' as const },
    { label: '银行账号', value: 'invoiceBankAccount' as const },
    { label: '开票地址', value: 'invoiceAddress' as const },
    { label: '开票电话', value: 'invoicePhone' as const },
  ];

  const renderDescriptions = (fields: Array<{ label: string; value: keyof CompanyEntityRecord }>) => (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((f) => (
        <div key={f.value}>
          <div className="text-sm text-muted-foreground">{f.label}</div>
          <div className="font-medium">
            {f.value === 'status' ? (
              <Badge className={currentRecord.status === '启用' ? 'bg-green-500 text-white' : ''} variant={currentRecord.status === '启用' ? 'default' : 'destructive'}>
                {currentRecord.status}
              </Badge>
            ) : (
              String(currentRecord[f.value] || '-')
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderForm = (fields: Array<{ label: string; field: keyof CompanyEntityRecord; placeholder: string; required?: boolean }>) => (
    <form className="grid grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
      {fields.map((f) => (
        <div key={f.field} className={f.field === 'address' ? 'col-span-2' : undefined}>
          <Label>{f.label}{f.required && <span className="text-destructive ml-1">*</span>}</Label>
          {f.field === 'status' ? (
            <Select value={formState.status || '启用'} onValueChange={(val) => setFormState((prev) => ({ ...prev, status: val as CompanyEntityRecord['status'] }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="启用">启用</SelectItem>
                <SelectItem value="禁用">禁用</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              className="mt-1"
              placeholder={f.placeholder}
              value={String(formState[f.field] || '')}
              onChange={(e) => {
                setFormState((prev) => ({ ...prev, [f.field]: e.target.value }));
                if (formErrors[f.field]) {
                  setFormErrors((prev) => ({ ...prev, [f.field]: '' }));
                }
              }}
            />
          )}
          {formErrors[f.field] && <p className="text-sm text-destructive mt-1">{formErrors[f.field]}</p>}
        </div>
      ))}
    </form>
  );

  const basicFormFields = [
    { label: '公司名称', field: 'name' as const, placeholder: '请输入公司全称', required: true },
    { label: '公司简称', field: 'shortName' as const, placeholder: '请输入公司简称', required: true },
    { label: '统一社会信用代码', field: 'taxNumber' as const, placeholder: '请输入统一社会信用代码', required: true },
    { label: '法定代表人', field: 'legalPerson' as const, placeholder: '请输入法定代表人' },
    { label: '注册资本', field: 'registeredCapital' as const, placeholder: '如：1000万元' },
    { label: '联系电话', field: 'contactPhone' as const, placeholder: '请输入联系电话' },
    { label: '注册地址', field: 'address' as const, placeholder: '请输入注册地址' },
    { label: '状态', field: 'status' as const, placeholder: '' },
  ];

  const invoiceFormFields = [
    { label: '开票抬头', field: 'invoiceTitle' as const, placeholder: '请输入开票抬头', required: true },
    { label: '纳税人识别号', field: 'invoiceTaxNumber' as const, placeholder: '请输入纳税人识别号', required: true },
    { label: '开户银行', field: 'invoiceBankName' as const, placeholder: '请输入开户银行', required: true },
    { label: '银行账号', field: 'invoiceBankAccount' as const, placeholder: '请输入银行账号', required: true },
    { label: '开票地址', field: 'invoiceAddress' as const, placeholder: '请输入开票地址', required: true },
    { label: '开票电话', field: 'invoicePhone' as const, placeholder: '请输入开票电话', required: true },
  ];

  const footer = readonly ? (
    <div className="flex gap-2">
      {showGoManage && permissions.edit && (
        <Button onClick={onGoManage}>
          去公司主体管理维护
        </Button>
      )}
      <Button variant="outline" onClick={onCancel}>关闭</Button>
    </div>
  ) : undefined;

  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-[860px]">
        <DialogHeader>
          <DialogTitle>{readonly ? '公司主体详情' : record ? '编辑公司主体' : '新建公司主体'}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(key) => setActiveTab(key as CompanyEntityModalTab)}>
          <TabsList>
            <TabsTrigger value="basic">基础信息</TabsTrigger>
            <TabsTrigger value="invoice">开票信息</TabsTrigger>
            <TabsTrigger value="files">公司资料</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            {readonly ? (
              renderDescriptions(basicFields)
            ) : (
              renderForm(basicFormFields)
            )}
          </TabsContent>

          <TabsContent value="invoice">
            {readonly ? (
              renderDescriptions(invoiceFields)
            ) : (
              renderForm(invoiceFormFields)
            )}
          </TabsContent>

          <TabsContent value="files">
            {currentRecord.files.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>暂无公司资料</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>资料名称</TableHead>
                    <TableHead className="w-[100px]">类型</TableHead>
                    <TableHead className="w-[100px]">大小</TableHead>
                    <TableHead className="w-[120px]">更新时间</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead className="w-[140px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentRecord.files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>
                        <Badge variant={file.type === 'pdf' ? 'destructive' : 'default'}>
                          {file.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{file.size}</TableCell>
                      <TableCell>{file.updatedAt}</TableCell>
                      <TableCell>{file.description}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => toast.info(`下载资料：${file.name}`)}>
                            <Download className="h-4 w-4 mr-1" />
                            下载
                          </Button>
                          {permissions.files && !readonly && (
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.info(`删除资料：${file.name}`)}>
                              <Trash2 className="h-4 w-4 mr-1" />
                              删除
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {permissions.files && !readonly && (
              <Button className="mt-4" onClick={() => setUploadVisible(true)}>
                <Upload className="h-4 w-4 mr-2" />
                上传资料
              </Button>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {readonly ? (
            footer
          ) : (
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={onCancel}>取消</Button>
              <Button onClick={handleOk}>确定</Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>

      {/* Upload sub-dialog */}
      <Dialog open={uploadVisible} onOpenChange={(open) => {
        if (!open) {
          setUploadVisible(false);
          setUploadName('');
          setUploadDescription('');
          setUploadFile(null);
          setUploadErrors({});
        }
      }}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle>上传资料</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUploadSubmit(); }}>
            <div>
              <Label>资料名称<span className="text-destructive ml-1">*</span></Label>
              <Input
                className="mt-1"
                placeholder="请输入资料名称"
                value={uploadName}
                onChange={(e) => {
                  setUploadName(e.target.value);
                  if (uploadErrors.name) setUploadErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
              {uploadErrors.name && <p className="text-sm text-destructive mt-1">{uploadErrors.name}</p>}
            </div>
            <div>
              <Label>说明</Label>
              <Textarea
                className="mt-1"
                placeholder="请输入资料说明"
                rows={3}
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
            <div>
              <Label>选择文件<span className="text-destructive ml-1">*</span></Label>
              <Input
                type="file"
                accept=".pdf,.ppt,.pptx"
                className="mt-1"
                onChange={handleFileChange}
              />
              {uploadErrors.file && <p className="text-sm text-destructive mt-1">{uploadErrors.file}</p>}
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setUploadVisible(false);
              setUploadName('');
              setUploadDescription('');
              setUploadFile(null);
              setUploadErrors({});
            }}>取消</Button>
            <Button onClick={handleUploadSubmit}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
