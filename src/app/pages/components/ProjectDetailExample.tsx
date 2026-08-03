import { useState } from 'react';
import {
  ChevronRight, Plus, X, Info, FileText, Download, Trash2, Edit,
  ArrowLeft, Users, TrendingUp, DollarSign, GitBranch, MessageSquare,
  AlertTriangle, CheckCircle2, Clock, ExternalLink, Copy, MoreHorizontal,
  Pencil, MessageCircle, Calendar, RefreshCw, Paperclip, User
} from 'lucide-react';

// 模拟项目数据
const projectData = {
  projectNo: 'PRJ202605001',
  name: 'A公司CRM系统开发',
  progress: 65,
  entity: '中科软艺',
  priority: '高',
  status: '进行中',
  businessLine: '外包',
  latestProgress: '完成项目管理底座需求梳理，进入原型确认阶段。',
  createdAt: '2026-05-01 09:30',
  owner: '李四',
  salesUsers: ['张三'],
  assistants: ['王五'],
  startDate: '2026-05-01',
  expectedEndDate: '2026-06-30',
  remark: '客户重点关注销售跟进、客户管理和项目成本统计。',
  contractId: '4',
  leadId: 'LD-2024-001',
  attachments: [
    { id: 1, name: '项目需求初稿.pdf', size: '1.2MB' },
  ],
};

// 项目概览卡片数据
const summaryCards = [
  {
    title: '交付进度',
    level: '严重',
    levelColor: 'bg-red-50 text-red-600',
    value: '项目交付执行 / 34%',
    subtitle: '域名注册与实名认证逾期 70 天',
    extra: '下一座碑：一期交付（2026-06-15）',
  },
  {
    title: '工作项目',
    level: '预警',
    levelColor: 'bg-orange-50 text-orange-600',
    value: '11',
    subtitle: '3 需求 / 5 任务 / 3 缺陷',
    extra: '含 3 个待处理缺陷',
  },
  {
    title: '负责人',
    level: '正常',
    levelColor: 'bg-green-50 text-green-600',
    value: '李四',
    subtitle: '当前无高优先行项目',
    extra: '当前项目可优先推进',
  },
  {
    title: '交付时间',
    level: '严重',
    levelColor: 'bg-red-50 text-red-600',
    value: '已逾期 34 天',
    subtitle: '合同约定交付日：2026-06-30',
    extra: '已逾期',
  },
  {
    title: '总工时',
    level: '预警',
    levelColor: 'bg-orange-50 text-orange-600',
    value: '18.5H',
    subtitle: '王五 7.5H / 李四 6H / 赵六 5H',
    extra: '前三成员占比 100%',
  },
  {
    title: '客户动态',
    level: '正常',
    levelColor: 'bg-green-50 text-green-600',
    value: '5',
    subtitle: '3 个新需求 / 5 个任务',
    extra: '共 11 个工作日',
  },
];

// 模拟关联线索
const leadRelations = [
  { id: 'LD-2024-001', name: '张三', source: '官网表单', stage: '已签单' },
  { id: 'LD-2024-002', name: '李四', source: '朋友介绍', stage: '跟进中' },
];

// 模拟日报数据
const dailyReports = [
  { id: 1, date: '2026-05-20', reporter: '刘前端', content: '完成用户管理模块开发', hours: 8 },
  { id: 2, date: '2026-05-20', reporter: '赵后端', content: '完成API接口设计和开发', hours: 8 },
  { id: 3, date: '2026-05-19', reporter: '张产品', content: '完成需求文档评审', hours: 6 },
];

// 模拟文档数据
const documents = [
  { id: 1, title: '项目需求初稿.pdf', owner: '张产品', createdAt: '2026-05-01' },
  { id: 2, title: 'UI设计稿.fig', owner: '李设计', createdAt: '2026-05-10' },
];

// 模拟跟进记录
const followRecords = [
  {
    id: 1,
    type: '普通跟进',
    other: '其他',
    content: '项目开发完成，已提交客户验收。客户反馈整体功能符合预期，待签署验收确认书。',
    time: '06/01 15:30',
    operator: '张三',
    stage: '验收中',
    progress: '100%',
    attachments: ['终验确认书.pdf'],
  },
  {
    id: 2,
    type: '普通跟进',
    other: '其他',
    content: '项目进入测试阶段，已发现并修复3个bug。预计下周可以提交验收。',
    time: '05/28 11:00',
    operator: '王五',
    stage: '进行中',
    progress: '95%',
    attachments: [],
  },
  {
    id: 3,
    type: '普通跟进',
    other: '其他',
    content: '项目启动会议，确认项目范围和里程碑计划。',
    time: '05/01 10:00',
    operator: '李四',
    stage: '启动',
    progress: '0%',
    attachments: [],
  },
];

// 项目概览卡片组件 - 使用新的组件库风格
function ProjectSummaryCards() {
  return (
    <div className="mb-4">
      <h3 className="text-[14px] font-semibold text-gray-900 mb-3">项目概览</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card, i) => (
          <div key={i} className="bg-[#F5F6F8] rounded-2xl p-[3px]">
            <div className="bg-white rounded-[13px] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] text-gray-500">{card.title}</span>
                <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${card.levelColor}`}>
                  {card.level}
                </span>
              </div>
              <p className="text-[18px] font-bold text-gray-900 mb-1">{card.value}</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">{card.subtitle}</p>
              <p className="text-[11px] text-gray-400 mt-1">{card.extra}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 左侧内容 - 使用新的组件库风格
function ProjectLeftContent() {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: '基础信息' },
    { id: 'members', label: '项目人员' },
    { id: 'daily', label: '关联日报', count: dailyReports.length },
    { id: 'documents', label: '项目文档', count: documents.length },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs - 与组件库一致的样式 */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-200/60 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      <div>
        {/* 基础信息 */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
              {/* 项目属性卡片 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="text-[15px] font-semibold text-gray-900">项目属性</h4>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[12px] font-medium rounded-full">{projectData.status}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">负责人</span>
                    <div className="flex items-center gap-2">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Li" alt="" className="w-7 h-7 rounded-lg" />
                      <span className="text-[13px] font-medium text-gray-900">{projectData.owner}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">创建时间</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">最后更新</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.latestProgress}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">当前阶段</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full">{projectData.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">优先级</span>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded-full">{projectData.priority}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">预计结束</span>
                    <span className="text-[13px] font-medium text-orange-600">{projectData.expectedEndDate}</span>
                  </div>
                </div>
              </div>

              {/* 项目信息卡片 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="text-[15px] font-semibold text-gray-900 mb-4">项目信息</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">项目编号</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.projectNo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">项目名称</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">业务线</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.businessLine}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">对接主体</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.entity}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">开始日期</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.startDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">预计结束</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.expectedEndDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">销售人员</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.salesUsers.join('、')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">协助人</span>
                    <span className="text-[13px] font-medium text-gray-900">{projectData.assistants.join('、')}</span>
                  </div>
                </div>
                {projectData.remark && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                      <span className="text-[13px] text-gray-500 w-20 shrink-0">备注</span>
                      <p className="text-[13px] text-gray-700">{projectData.remark}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 合同信息 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="text-[15px] font-semibold text-gray-900 mb-3">合同信息</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">合同名称</span>
                    <span className="text-[13px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer">A公司CRM系统开发合同</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">客户名称</span>
                    <span className="text-[13px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer">A公司</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">合同金额</span>
                    <span className="text-[13px] font-medium text-gray-900">¥280,000</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-500 w-20">签约日期</span>
                    <span className="text-[13px] font-medium text-gray-900">2026-05-01</span>
                  </div>
                </div>
              </div>

              {/* 附件列表 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="text-[15px] font-semibold text-gray-900 mb-3">附件列表</h4>
                {projectData.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {projectData.attachments.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">PDF</span>
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-900">{file.name}</p>
                            <p className="text-[11px] text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-[13px] text-gray-500">暂无附件</div>
                )}
              </div>

              {/* 关联线索 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
                <h4 className="text-[15px] font-semibold text-gray-900 mb-3">关联线索 ({leadRelations.length})</h4>
                <div className="space-y-2">
                  {leadRelations.map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <GitBranch className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-gray-900">{lead.name}</p>
                          <p className="text-[11px] text-gray-500">{lead.id} · {lead.source}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full">{lead.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 项目人员 */}
          {activeTab === 'members' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[14px] font-semibold text-gray-900">项目团队成员</h4>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                  编辑人员
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '负责人', value: projectData.owner },
                  { label: '协助人', value: projectData.assistants.join('、') },
                  { label: '销售人员', value: projectData.salesUsers.join('、') },
                ].map((item, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="text-[12px] text-gray-500 mb-1">{item.label}</div>
                    <div className="text-[13px] font-medium text-gray-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 关联日报 */}
          {activeTab === 'daily' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-gray-500">点击查看项目的日报列表和工时统计</span>
                <button className="px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
                  查看日报列表
                </button>
              </div>
              <h6 className="text-[14px] font-semibold text-gray-900 mb-3">工时概览</h6>
              {/* 使用 Table 风格 */}
              <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
                <div className="grid grid-cols-[1fr_1.5fr_1fr_1fr] gap-3 items-center h-[36px] px-5 text-[#697181] text-[13px] font-semibold">
                  <div>编号</div>
                  <div>人员名称</div>
                  <div>职位</div>
                  <div>已用工时</div>
                </div>
                <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px]">
                  <div className="px-5">
                    {[
                      { name: '王五', role: '前端开发', hours: 7.5 },
                      { name: '李四', role: '后端开发', hours: 6 },
                      { name: '赵六', role: '测试工程师', hours: 5 },
                    ].map((item, index) => (
                      <div key={index} className={`grid grid-cols-[1fr_1.5fr_1fr_1fr] gap-3 items-center h-[44px] ${index < 2 ? 'border-b border-gray-100' : ''}`}>
                        <span className="text-[13px] text-gray-400">{index + 1}</span>
                        <span className="text-[13px] font-medium text-gray-900">{item.name}</span>
                        <span className="text-[13px] text-gray-600">{item.role}</span>
                        <span className="text-[13px] font-medium text-gray-900">{item.hours}H</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 项目文档 */}
          {activeTab === 'documents' && (
            <div className="space-y-3">
              {documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-gray-900">{doc.title}</p>
                      <p className="text-[11px] text-gray-500">{doc.owner} · {doc.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600"><Download className="w-4 h-4" /></button>
                    <button className="text-gray-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}

// 右侧模块 - 使用新的组件库风格
function ProjectRightModules() {
  const [activeTab, setActiveTab] = useState('follow');

  const tabs = [
    { id: 'follow', label: '跟进记录', count: followRecords.length },
    { id: 'quotation', label: '报价' },
    { id: 'contract', label: '合同' },
    { id: 'travel', label: '出差' },
    { id: 'reimbursement', label: '报销' },
    { id: 'payment', label: '收款' },
  ];

  return (
    <div className="space-y-4">
      {/* 微信群卡片 */}
      <div className="bg-[#F5F6F8] rounded-2xl p-[3px]">
        <div className="bg-white rounded-[13px] p-5">
          {/* 标题行 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.98 4.025c-3.893 0-7.185 2.754-7.185 6.15 0 3.396 3.292 6.15 7.185 6.15.87 0 1.71-.145 2.487-.396a.72.72 0 01.596.08l1.582.926a.272.272 0 00.14.045c.134 0 .242-.108.242-.245 0-.06-.024-.12-.04-.178l-.324-1.23a.49.49 0 01.178-.552C22.834 18.42 24 16.545 24 14.436c0-3.396-3.292-6.15-7.185-6.15h-.222zm-2.85 3.29c.534 0 .967.44.967.98a.976.976 0 01-.967.98.976.976 0 01-.967-.98c0-.54.433-.98.967-.98zm4.69 0c.534 0 .967.44.967.98a.976.976 0 01-.967.98.976.976 0 01-.967-.98c0-.54.433-.98.967-.98z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full">微信群</span>
                  <span className="text-[14px] font-semibold text-gray-900">【0721】家具小程序开发</span>
                </div>
                <span className="text-[12px] text-gray-400 mt-1">👥 4人</span>
              </div>
            </div>
            <span className="text-[12px] text-gray-400">高</span>
          </div>

          {/* 消息统计 */}
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-gray-500">今日</span>
              <span className="text-[16px] font-bold text-gray-900">47</span>
              <span className="text-[13px] text-gray-500">条消息</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-bold text-red-500">5</span>
              <span className="text-[13px] text-red-500">条待审核</span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                需求 <span className="font-medium text-gray-700">4</span>
              </span>
              <span className="text-[13px] text-gray-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                任务 <span className="font-medium text-gray-700">1</span>
              </span>
            </div>
          </div>

          {/* 采集时间 */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4 text-[12px] text-gray-400">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                上次采集: 07/29 10:30:00
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                下次采集: 07/29 10:30:30
              </span>
            </div>
            <span className="text-[13px] text-blue-500 cursor-pointer hover:text-blue-600">查看详情 →</span>
          </div>
        </div>
      </div>

      {/* Tabs - 与线索详情一致 */}
      <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count && (
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-gray-600'
                  : 'bg-gray-200/60 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab 内容 */}
      {activeTab === 'follow' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">跟进记录</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              记录
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4 max-h-[500px] overflow-y-auto">
            <div className="space-y-5">
              {followRecords.map((record, index) => (
                <div key={record.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    {index < followRecords.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded">{record.type}</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded">{record.other}</span>
                      <span className="text-[11px] text-gray-400 ml-auto">{record.time}</span>
                    </div>
                    <p className="text-[13px] text-gray-700 mb-2 leading-relaxed">{record.content}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full">阶段：{record.stage}</span>
                      <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[11px] font-medium rounded-full">进度：{record.progress}</span>
                    </div>
                    {record.attachments.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        {record.attachments.map((att, i) => (
                          <span key={i} className="text-[12px] text-blue-500 cursor-pointer hover:text-blue-600 flex items-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" />
                            {att}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="text-gray-500 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {record.operator}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
                        <Edit className="w-3 h-3" />
                        编辑
                      </button>
                      <button className="text-red-400 hover:text-red-600 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quotation' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">报价</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4">
            <div className="text-center py-8 text-[13px] text-gray-500">暂无报价记录</div>
          </div>
        </div>
      )}

      {activeTab === 'contract' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">合同</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4">
            <div className="text-center py-8 text-[13px] text-gray-500">暂无合同记录</div>
          </div>
        </div>
      )}

      {activeTab === 'travel' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">出差</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              申请
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4">
            <div className="text-center py-8 text-[13px] text-gray-500">暂无出差申请</div>
          </div>
        </div>
      )}

      {activeTab === 'reimbursement' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">报销</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              申请
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4">
            <div className="text-center py-8 text-[13px] text-gray-500">暂无报销申请</div>
          </div>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="relative bg-gray-100/80 rounded-[20px] overflow-hidden">
          <div className="flex items-center justify-between h-[40px] px-5">
            <span className="text-[14px] font-semibold text-[#697181]">收款</span>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-[12px] font-medium rounded-lg transition-all">
              <Plus className="w-3.5 h-3.5" />
              记录
            </button>
          </div>
          <div className="relative bg-white rounded-[18px] mx-[2px] mb-[2px] px-4 py-4">
            <div className="text-center py-8 text-[13px] text-gray-500">暂无收款记录</div>
          </div>
        </div>
      )}
    </div>
  );
}

// 操作栏
function ActionBar() {
  return (
    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-[13px] text-gray-500">返回</span>
      <div className="h-5 w-px bg-gray-200 mx-1" />
      <h2 className="text-[18px] font-semibold text-gray-900">{projectData.name}</h2>
      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] font-medium rounded-full">{projectData.status}</span>
    </div>
  );
}

// 主页面组件
export default function ProjectDetailExample() {
  return (
    <div className="min-h-screen bg-[#F8F9FC]">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-[13px] text-gray-400 mb-4">
          <span className="hover:text-gray-600 cursor-pointer transition-colors">首页</span>
          <ChevronRight className="w-3 h-3" />
          <span className="hover:text-gray-600 cursor-pointer transition-colors">项目管理</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium">{projectData.name}</span>
        </div>

        {/* 操作栏 */}
        <div className="mb-4">
          <ActionBar />
        </div>

        {/* 项目概览卡片 */}
        <ProjectSummaryCards />

        {/* 提示信息 */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
          <p className="text-[13px] text-blue-700">成本核算将在后续阶段接入人工成本设置、项目报销、投放日消耗、回款和利润分析；当前阶段先沉淀项目工时入口。</p>
        </div>

        {/* 两栏布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
          {/* 左侧 - Tab 内容 */}
          <div className="lg:col-span-3">
            <ProjectLeftContent />
          </div>

          {/* 右侧 - 微信群 + 跟进记录 */}
          <div className="lg:col-span-2">
            <ProjectRightModules />
          </div>
        </div>
      </div>
    </div>
  );
}
