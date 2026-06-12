export type CompanyFileType = 'pdf' | 'pptx';

export interface CompanyEntityFile {
  id: string;
  name: string;
  type: CompanyFileType;
  size: string;
  updatedAt: string;
  description: string;
}

export interface CompanyEntityRecord {
  id: string;
  name: string;
  shortName: string;
  taxNumber: string;
  legalPerson: string;
  registeredCapital: string;
  address: string;
  contactPhone: string;
  status: '启用' | '禁用';
  createTime: string;
  invoiceTitle: string;
  invoiceTaxNumber: string;
  invoiceBankName: string;
  invoiceBankAccount: string;
  invoiceAddress: string;
  invoicePhone: string;
  files: CompanyEntityFile[];
}

export interface CompanyEntityPermissions {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  files: boolean;
}

export const companyEntityPermissions: CompanyEntityPermissions = {
  view: true,
  create: true,
  edit: true,
  delete: true,
  files: true,
};

export const mockCompanyEntities: CompanyEntityRecord[] = [
  {
    id: '1',
    name: '中科软艺科技有限公司',
    shortName: '中科软艺',
    taxNumber: '91110000123456789A',
    legalPerson: '张三',
    registeredCapital: '1000万元',
    address: '北京市海淀区中关村大街1号',
    contactPhone: '010-88888888',
    status: '启用',
    createTime: '2020-01-01',
    invoiceTitle: '中科软艺科技有限公司',
    invoiceTaxNumber: '91110000123456789A',
    invoiceBankName: '中国工商银行北京海淀支行',
    invoiceBankAccount: '0200001234567890123',
    invoiceAddress: '北京市海淀区中关村大街1号',
    invoicePhone: '010-88888888',
    files: [
      {
        id: 'pdf-1',
        name: '中科软艺公司介绍.pdf',
        type: 'pdf',
        size: '2.4MB',
        updatedAt: '2026-05-01',
        description: '用于方案附件的不可编辑公司介绍资料',
      },
      {
        id: 'pptx-1',
        name: '中科软艺方案模板.pptx',
        type: 'pptx',
        size: '6.8MB',
        updatedAt: '2026-05-06',
        description: '用于方案和报价的可编辑模板',
      },
    ],
  },
  {
    id: '2',
    name: '软艺信息技术有限公司',
    shortName: '软艺信息',
    taxNumber: '91110000234567890B',
    legalPerson: '李四',
    registeredCapital: '500万元',
    address: '北京市朝阳区建国路2号',
    contactPhone: '010-99999999',
    status: '启用',
    createTime: '2021-06-15',
    invoiceTitle: '软艺信息技术有限公司',
    invoiceTaxNumber: '91110000234567890B',
    invoiceBankName: '中国建设银行北京朝阳支行',
    invoiceBankAccount: '0200002345678901234',
    invoiceAddress: '北京市朝阳区建国路2号',
    invoicePhone: '010-99999999',
    files: [
      {
        id: 'pdf-2',
        name: '软艺信息资质文件.pdf',
        type: 'pdf',
        size: '1.9MB',
        updatedAt: '2026-04-22',
        description: '用于报价附件的不可编辑资质资料',
      },
      {
        id: 'pptx-2',
        name: '软艺信息报价模板.pptx',
        type: 'pptx',
        size: '5.2MB',
        updatedAt: '2026-04-28',
        description: '用于报价和方案的可编辑模板',
      },
    ],
  },
  {
    id: '3',
    name: '中科集团有限公司',
    shortName: '中科集团',
    taxNumber: '91110000345678901C',
    legalPerson: '王五',
    registeredCapital: '5000万元',
    address: '北京市西城区金融街3号',
    contactPhone: '010-77777777',
    status: '启用',
    createTime: '2019-03-20',
    invoiceTitle: '中科集团有限公司',
    invoiceTaxNumber: '91110000345678901C',
    invoiceBankName: '中国银行北京西城支行',
    invoiceBankAccount: '0200003456789012345',
    invoiceAddress: '北京市西城区金融街3号',
    invoicePhone: '010-77777777',
    files: [
      {
        id: 'pdf-3',
        name: '中科集团公司资料.pdf',
        type: 'pdf',
        size: '3.1MB',
        updatedAt: '2026-04-18',
        description: '用于方案和报价的不可编辑公司资料',
      },
      {
        id: 'pptx-3',
        name: '中科集团通用方案模板.pptx',
        type: 'pptx',
        size: '7.4MB',
        updatedAt: '2026-05-03',
        description: '用于方案和报价的可编辑模板',
      },
    ],
  },
];

export function findCompanyEntityByName(name: string) {
  return mockCompanyEntities.find((item) => item.shortName === name || item.name === name);
}
