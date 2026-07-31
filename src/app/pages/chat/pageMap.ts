// ============================================================
// HubX 内部通讯 — 页面路径 → 中文标题映射
// ============================================================

export const pageMap: Record<string, string> = {
  // 工作台
  '/': '仪表盘',
  '/workbench': '个人工作台',

  // 线索管理
  '/leads/all': '全部线索',
  '/leads/assigned': '已分配线索',
  '/leads/public-pool': '公海线索',
  '/leads/my': '我的线索',
  '/leads/trash': '垃圾线索',
  '/leads/follow-records': '跟进记录',
  '/leads/high-tech': '高新企业线索',
  '/leads/governance': '线索治理',

  // 线索成本
  '/lead-cost/dashboard': '成本看板',
  '/lead-cost/daily': '投放日报',
  '/lead-cost/recharge': '充值记录',
  '/lead-cost/analysis': '渠道分析',

  // 客户管理
  '/customers': '客户列表',

  // 合同管理
  '/contracts': '合同列表',
  '/contracts/payments': '回款看板',
  '/contracts/forecast': '回款预测',

  // 项目管理
  '/projects': '项目列表',
  '/issues': '工作事项',

  // 日报管理
  '/dailyreport/list': '日报列表',
  '/dailyreport/view': '日报视图',
  '/dailyreport/projectlog': '项目视图',

  // 差旅管理
  '/travel/trips': '出差管理',
  '/travel/reimbursements': '报销管理',
  '/travel/loans': '借款管理',
  '/travel/dormitory': '宿舍管理',
  '/travel/punch': '打卡',
  '/travel/standards': '费用标准',
  '/travel/dashboard': '差旅看板',

  // 人资管理
  '/hr/dashboard': '管理看板',
  '/hr/organization': '组织管理',
  '/hr/employees': '员工花名册',
  '/hr/recruitment': '招聘 ATS',
  '/hr/onboarding': '入职管理',
  '/hr/trial': '试岗跟踪',
  '/hr/attendance': '考勤管理',
  '/hr/performance': '绩效管理',
  '/hr/payroll': '薪资核算',
  '/hr/dispatch': '工作派单',
  '/hr/resignation': '离职管理',

  // 财务管理
  '/finance/dashboard': '财务统计',
  '/finance/project-cost': '项目成本核算',
  '/finance/salary': '工资表',
  '/quotation': '报价管理',
  '/businesstrip': '出差申请',
  '/reimbursement': '报销申请',
  '/paymentinvoice': '回款与发票',

  // 运营支持
  '/assets': '资产管理',
  '/maintenance': '售后运维',
  '/suppliers': '供应商管理',

  // 知识与协作
  '/knowledge': '知识库',
  '/meetings': '会议管理',

  // 数据分析
  '/reports': '数据报表',
  '/roi': '全链路 ROI',

  // AI 能力
  '/ai': 'AI 智能助手',

  // 系统管理
  '/system/organization': '组织架构',
  '/system/permission': '用户权限',
  '/system/company': '本公司主体',
  '/system/dictionary': '数据字典',
  '/system/log': '系统日志',
  '/system/config': '系统配置',
  '/system/workflow': '审批模板管理',
  '/system/bizapproval': '业务审批配置',
  '/system/expensecategory': '费用分类管理',
};

/**
 * 根据路径获取页面标题
 */
export function getPageTitle(path: string): string {
  // 精确匹配
  if (pageMap[path]) return pageMap[path];

  // 处理动态路由（如 /leads/123, /customers/456）
  const segments = path.split('/');
  if (segments.length >= 2) {
    // 尝试匹配父路径
    const parentPath = '/' + segments.slice(1, -1).join('/');
    if (pageMap[parentPath]) return pageMap[parentPath] + '详情';
  }

  return '未知页面';
}
