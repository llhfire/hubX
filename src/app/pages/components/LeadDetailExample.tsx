import { useState } from 'react';
import {
  Search, ChevronDown, ChevronRight, Plus, X, Check, AlertCircle, Info,
  Bell, Mail, Calendar, Clock, FileText, Download, Upload, Trash2, Edit,
  Eye, Filter, RefreshCw, ExternalLink, Copy, Share2, Star, Heart, Bookmark,
  Flag, Home, Settings, User, Loader2, MoreHorizontal, ArrowRight, CheckCircle2,
  AlertTriangle, XCircle, LayoutDashboard, BarChart3, Phone, MessageCircle,
  MapPin, Paperclip, ArrowLeft
} from 'lucide-react';

// 模拟线索数据
const leadData = {
  id: 'LD-2024-001',
  name: '张三',
  company: '腾讯科技有限公司',
  phone: '138****8888',
  email: 'zhangsan@tencent.com',
  wechat: 'zhangsan_wx',
  contactName: '张经理',
  source: '官网表单',
  stage: '需求确认',
  intentLevel: '意向高',
  ownerName: '李销售',
  lastFollowTime: '2024-01-15 14:30',
  nextFollowTime: '2024-01-18 10:00',
  createTime: '2024-01-10 09:00',
  remark: '客户对产品功能感兴趣，希望了解更多细节，预算充足，需要在一个月内完成开发',
  customerType: '企业客户',
  budget: '50-100万',
  keyword: '软件开发,定制开发',
  entity: '深圳总部',
  preSaleGroupName: '腾讯售前支持群',
};

// 模拟跟进记录
const followRecords = [
  {
    id: 1,
    type: 'phone',
    content: '客户对产品功能感兴趣，希望了解更多细节，询问了价格和交付周期',
    time: '2024-01-15 14:30',
    operator: '李销售',
    nextPlan: '发送产品手册和报价单',
    duration: 25,
    stage: '需求确认',
    intent: '意向高',
  },
  {
    id: 2,
    type: 'visit',
    content: '上门拜访，演示产品原型，客户反馈良好，表示需要内部讨论',
    time: '2024-01-12 10:00',
    operator: '李销售',
    nextPlan: '安排技术对接会议',
    duration: 120,
    stage: '方案报价',
    intent: '意向高',
  },
  {
    id: 3,
    type: 'wechat',
    content: '微信沟通确认需求，客户预算充足，决策人是技术总监',
    time: '2024-01-10 16:45',
    operator: '李销售',
    nextPlan: '电话跟进确认意向',
    duration: 15,
    stage: '初步建联',
    intent: '意向中',
  },
];

// 模拟附件数据
const attachments = [
  { id: 1, name: '产品手册.pdf', size: '2.4 MB', type: 'pdf' },
  { id: 2, name: '报价单.xlsx', size: '156 KB', type: 'excel' },
  { id: 3, name: '需求文档.docx', size: '890 KB', type: 'word' },
];

// 模拟报价数据
const quotations = [
  { id: 'QT-001', name: '标准版报价', amount: '¥120,000', status: '待确认', createTime: '2024-01-12', items: ['基础功能', '技术支持', '1年维护'] },
  { id: 'QT-002', name: '高级版报价', amount: '¥280,000', status: '已发送', createTime: '2024-01-10', items: ['全部功能', '优先支持', '2年维护', '定制开发'] },
];

// 模拟合同数据
const contracts = [
  { id: 'CT-2024-001', name: '腾讯科技定制开发合同', amount: '¥280,000', status: '履行中', signDate: '2024-01-18', startDate: '2024-01-20', endDate: '2024-06-30' },
];

// 模拟出差数据
const travels = [
  { id: 'TR-001', destination: '深圳', purpose: '客户拜访', startDate: '2024-01-12', endDate: '2024-01-13', days: 2, amount: '¥3,200', status: '已完成' },
  { id: 'TR-002', destination: '北京', purpose: '技术对接', startDate: '2024-01-25', endDate: '2024-01-27', days: 3, amount: '¥5,800', status: '审批中' },
];

// 模拟报销数据
const reimbursements = [
  { id: 'RB-001', type: '差旅报销', amount: '¥2,850', status: '已报销', submitDate: '2024-01-15', items: ['机票 ¥1,200', '住宿 ¥800', '餐饮 ¥450', '交通 ¥400'] },
  { id: 'RB-002', type: '招待报销', amount: '¥1,200', status: '审批中', submitDate: '2024-01-18', items: ['商务宴请 ¥1,200'] },
];

// 模拟收款数据
const payments = [
  { id: 'PAY-001', name: '首期款项', amount: '¥140,000', status: '已收款', dueDate: '2024-01-25', receivedDate: '2024-01-24', method: '银行转账' },
  { id: 'PAY-002', name: '二期款项', amount: '¥84,000', status: '待收款', dueDate: '2024-03-20', receivedDate: '-', method: '-' },
  { id: 'PAY-003', name: '尾款', amount: '¥56,000', status: '未到期', dueDate: '2024-06-30', receivedDate: '-', method: '-' },
];

// 线索信息组件
function LeadInfoCard() {
  return (
    <div className="space-y-4">
      {/* 主信息卡片 - 合并属性、跟进状态、客户信息 */}
      <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
        <div className="bg-white rounded-[13px] p-5">
          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-[15px] font-semibold text-gray-900">属性</h4>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff1c9] rounded-xl text-[13px] font-bold text-[#ad5528]">
              <AlertCircle className="w-4 h-4" />
              待跟进
            </span>
          </div>

          {/* 紧凑布局 - 两列 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">负责人</span>
              <div className="flex items-center gap-2">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Karlo"
                  alt=""
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="text-[13px] font-medium text-gray-900">{leadData.ownerName}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">创建时间</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.createTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">最后更新</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.lastFollowTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">当前阶段</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-full">
                {leadData.stage}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">意向等级</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-600 text-[12px] font-medium rounded-full">
                {leadData.intentLevel}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">下次跟进</span>
              <span className="text-[13px] font-medium text-orange-600">{leadData.nextFollowTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 客户信息卡片 */}
      <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
        <div className="bg-white rounded-[13px] p-5">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-4">客户信息</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">线索名称</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">联系方式</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">联系人</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.contactName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">微信</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.wechat}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">邮箱</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">公司</span>
              <span className="text-[13px] font-medium text-gray-900 truncate">{leadData.company}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">客户类型</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.customerType}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">客户预算</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.budget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 业务信息卡片 */}
      <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
        <div className="bg-white rounded-[13px] p-5">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-4">业务信息</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">客户来源</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.source}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">所属人</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.ownerName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">当前主体</span>
              <span className="text-[13px] font-medium text-gray-900">{leadData.entity}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gray-500 w-20">售前群</span>
              <span className="text-[13px] font-medium text-gray-900 truncate">{leadData.preSaleGroupName}</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-start gap-3">
              <span className="text-[13px] text-gray-500 w-20 shrink-0">关键词</span>
              <div className="flex flex-wrap gap-2">
                {leadData.keyword.split(',').map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[12px] font-medium rounded-full">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 客户需求 */}
      {leadData.remark && (
        <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
          <div className="bg-white rounded-[13px] p-5">
            <h4 className="text-[15px] font-semibold text-gray-900 mb-3">客户需求</h4>
            <p className="text-[13px] text-gray-700 leading-relaxed">{leadData.remark}</p>
          </div>
        </div>
      )}

      {/* 附件列表 */}
      <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
        <div className="bg-white rounded-[13px] p-5">
          <h4 className="text-[15px] font-semibold text-gray-900 mb-4">附件</h4>
          <div className="space-y-2.5">
            {attachments.map(file => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">
                      {file.type === 'pdf' ? 'PDF' : file.type === 'excel' ? 'XLS' : 'DOC'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{file.name}</p>
                    <p className="text-[12px] text-gray-500">{file.size}</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 跟进记录组件
function FollowRecordCard() {
  const [activeTab, setActiveTab] = useState('follow');

  const tabs = [
    { id: 'follow', label: '跟进记录', count: followRecords.length },
    { id: 'quotation', label: '报价', count: quotations.length },
    { id: 'contract', label: '合同', count: contracts.length },
    { id: 'travel', label: '出差', count: travels.length },
    { id: 'reimbursement', label: '报销', count: reimbursements.length },
    { id: 'payment', label: '收款', count: payments.length },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                activeTab === tab.id ? 'bg-gray-100 text-gray-600' : 'bg-gray-200/60 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {activeTab === 'follow' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          {/* 表头 */}
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">跟进记录</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              记录
            </button>
          </div>

          {/* 跟进记录时间线 */}
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="space-y-4">
              {followRecords.map((record, index) => (
                <div key={record.id} className="flex gap-3">
                  {/* 时间线圆点 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      record.type === 'phone' ? 'bg-blue-50 text-blue-600' :
                      record.type === 'visit' ? 'bg-green-50 text-green-600' :
                      record.type === 'wechat' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>
                      {record.type === 'phone' ? <Phone className="w-4 h-4" /> :
                       record.type === 'visit' ? <MapPin className="w-4 h-4" /> :
                       record.type === 'wechat' ? <MessageCircle className="w-4 h-4" /> :
                       <Mail className="w-4 h-4" />}
                    </div>
                    {index < followRecords.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                    )}
                  </div>

                  {/* 记录内容 */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[13px] font-semibold text-gray-900">{record.operator}</span>
                      <span className="text-[12px] text-gray-400">{record.time}</span>
                      <span className="text-[12px] text-gray-400">·</span>
                      <span className="text-[12px] text-gray-400">{record.duration}分钟</span>
                    </div>
                    <p className="text-[13px] text-gray-700 mb-2.5 leading-relaxed">{record.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-gray-500">阶段：</span>
                        <span className="text-[12px] text-blue-600 font-medium">{record.stage}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] text-gray-500">意向：</span>
                        <span className="text-[12px] text-green-600 font-medium">{record.intent}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[12px] text-gray-500">下次计划：</span>
                      <span className="text-[12px] text-orange-600 font-medium">{record.nextPlan}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 报价列表 */}
      {activeTab === 'quotation' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">报价</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {quotations.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-900">{item.name}</span>
                      <span className="text-[11px] text-gray-400">{item.id}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      item.status === '待确认' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>{item.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-bold text-gray-900">{item.amount}</span>
                    <span className="text-[12px] text-gray-500">{item.createTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.items.map((itm, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-gray-600 text-[11px] rounded-full border border-gray-200">{itm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 合同列表 */}
      {activeTab === 'contract' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">合同</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {contracts.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-gray-900">{item.name}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full">{item.status}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[15px] font-bold text-gray-900">{item.amount}</span>
                    <span className="text-[12px] text-gray-500">签约日期：{item.signDate}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[12px] text-gray-500">
                    <span>开始：{item.startDate}</span>
                    <span>结束：{item.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 出差列表 */}
      {activeTab === 'travel' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">出差</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              申请
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {travels.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-[13px] font-semibold text-gray-900">{item.destination}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      item.status === '已完成' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>{item.status}</span>
                  </div>
                  <p className="text-[12px] text-gray-600 mb-2">{item.purpose}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-gray-900">{item.amount}</span>
                    <span className="text-[12px] text-gray-500">{item.startDate} ~ {item.endDate} ({item.days}天)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 报销列表 */}
      {activeTab === 'reimbursement' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">报销</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              申请
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {reimbursements.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-gray-900">{item.type}</span>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      item.status === '已报销' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>{item.status}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[15px] font-bold text-gray-900">{item.amount}</span>
                    <span className="text-[12px] text-gray-500">提交日期：{item.submitDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {item.items.map((itm, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white text-gray-600 text-[11px] rounded-full border border-gray-200">{itm}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 收款列表 */}
      {activeTab === 'payment' && (
        <div className="relative bg-gray-100/80 rounded-[20px] shadow-[0_3px_8px_rgba(17,18,20,0.035)] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">收款</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg shadow-sm hover:shadow-md transition-all">
              <Plus className="w-3.5 h-3.5" />
              记录
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-3 max-h-[500px] overflow-y-auto">
            <div className="space-y-3">
              {payments.map(item => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-gray-900">{item.name}</span>
                    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      item.status === '已收款' ? 'bg-green-50 text-green-600' :
                      item.status === '待收款' ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>{item.status}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[15px] font-bold text-gray-900">{item.amount}</span>
                    <span className="text-[12px] text-gray-500">到期：{item.dueDate}</span>
                  </div>
                  {item.receivedDate !== '-' && (
                    <div className="text-[12px] text-gray-500">
                      收款日期：{item.receivedDate} · {item.method}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 操作按钮组
function ActionBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <h2 className="text-[18px] font-semibold text-gray-900 truncate">
          {leadData.id}：{leadData.name}
        </h2>
        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full shrink-0">
          {leadData.stage}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
          <Edit className="w-3.5 h-3.5" />
          编辑
        </button>
        <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          转给他人
        </button>
        <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-[12px] font-medium rounded-lg hover:bg-gray-50 transition-colors">
          扔回公海
        </button>
        <button className="px-3 py-1.5 bg-white border border-red-200 text-red-600 text-[12px] font-medium rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5" />
          标记为垃圾
        </button>
      </div>
    </div>
  );
}

// 主页面组件
export default function LeadDetailExample() {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-4">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">首页</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-gray-600 cursor-pointer transition-colors">线索管理</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-gray-600 cursor-pointer transition-colors">线索列表</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{leadData.name}</span>
        </div>

        {/* 操作栏 */}
        <div className="mb-6">
          <ActionBar />
        </div>

        {/* 两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* 左侧 - 基础信息 */}
          <div className="lg:col-span-3">
            <LeadInfoCard />
          </div>

          {/* 右侧 - 跟进记录 */}
          <div className="lg:col-span-2">
            <FollowRecordCard />
          </div>
        </div>
      </div>
    </div>
  );
}
