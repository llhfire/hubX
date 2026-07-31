// Agent Mock 数据 —— 跨域穿透的真实感模拟数据

export interface InlineWarning {
  fieldId: string
  text: string
  detail: string
  level: 'info' | 'warning' | 'danger'
  actionLabel?: string
}

export interface WBSTask {
  id: string
  title: string
  hours: number
  assignee: string
  assigneeLevel: string
  skillMatch: number
  bandwidth: number
}

export interface SimilarProject {
  name: string
  source: '公司项目' | '简历经历'
  similarity: number
  techStack: string[]
  description: string
}

export interface AssigneeRecommendation {
  id: string
  name: string
  level: string
  title: string
  skillMatch: number
  bandwidth: number
  bandwidthLabel: string
  skills: string[]
  avatar: string
  similarProjects: SimilarProject[]
}

export interface AgentLogEntry {
  timestamp: string
  source: 'Context Engine' | 'LLM Reasoning' | 'Pipeline' | 'Zod Validator'
  message: string
}

// ==================== 合同风险审查专用类型 ====================

export type RiskCheckStatus = 'pass' | 'warning' | 'danger' | 'info'

export interface RiskCheckItem {
  id: string
  category: string
  name: string
  status: RiskCheckStatus
  summary: string
  detail: string
  suggestion?: string
  // 合同正文锚点：点击时定位到对应的合同条款
  anchor?: {
    // 要高亮的文本片段（用于在合同正文中查找）
    text: string
    // 可选：正则表达式匹配
    pattern?: string
  }
}

export interface ContractReviewResult {
  overallRisk: 'LOW' | 'MEDIUM' | 'HIGH'
  overallSummary: string
  checks: RiskCheckItem[]
}

// ==================== 通用 Agent 分析结果（场景 B/C 共用）====================

export const CONTRACT_ANALYSIS: AgentAnalysisResult = {
  riskLevel: 'HIGH',
  contextSummary:
    '该客户过去 1 年累计合作 3 次，平均结款周期 45 天（公司标准 30 天）。当前尾款比例 60% 偏高，历史回款延迟概率 45%。前端组 8 月饱和度已达 90%，交付延期风险显著。',
  inlineWarnings: [
    {
      fieldId: 'payment_terms',
      text: '尾款比例 60% 偏高',
      detail:
        '结合财务模块历史数据：该客户过去 3 笔合同平均回款延迟 15 天，尾款回收率仅 82%。建议调整为 50/50 分期。',
      level: 'danger',
      actionLabel: '一键替换为标准条款',
    },
    {
      fieldId: 'delivery_date',
      text: '交付周期压缩 30%',
      detail:
        '穿透项目模块工时数据：同类小程序项目平均交付周期 45 天，当前合同承诺 30 天。需增加 1 名高级后端或延长 15 天。',
      level: 'warning',
    },
    {
      fieldId: 'contract_amount',
      text: '报价低于同类项目均价 15%',
      detail:
        '对比近 6 个月同类项目合同金额：教育类小程序均价 18 万，当前报价 15.3 万。利润率可能低于预期。',
      level: 'info',
    },
  ],
  suggestedWBS: [
    { id: 'wbs-1', title: '需求调研与架构设计', hours: 20, assignee: '张伟', assigneeLevel: 'L8 高级后端', skillMatch: 95, bandwidth: 65 },
    { id: 'wbs-2', title: 'UI/UX 原型设计', hours: 30, assignee: '李娜', assigneeLevel: 'L6 UI 设计师', skillMatch: 90, bandwidth: 50 },
    { id: 'wbs-3', title: '前端页面开发', hours: 60, assignee: '王磊', assigneeLevel: 'L7 前端开发', skillMatch: 88, bandwidth: 70 },
    { id: 'wbs-4', title: '后端接口开发', hours: 50, assignee: '张伟', assigneeLevel: 'L8 高级后端', skillMatch: 95, bandwidth: 65 },
    { id: 'wbs-5', title: '联调测试', hours: 20, assignee: '赵敏', assigneeLevel: 'L5 测试工程师', skillMatch: 82, bandwidth: 40 },
    { id: 'wbs-6', title: '部署上线与验收', hours: 10, assignee: '张伟', assigneeLevel: 'L8 高级后端', skillMatch: 95, bandwidth: 65 },
  ],
  recommendedAssignees: [
    {
      id: 'user-1', name: '张伟', level: 'L8', title: '高级后端工程师', skillMatch: 95, bandwidth: 65, bandwidthLabel: '适中',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', '微服务'], avatar: '张',
      similarProjects: [
        { name: '智慧校园小程序（公司）', source: '公司项目', similarity: 92, techStack: ['Java', 'Spring Boot', '小程序'], description: '教育类小程序，含课程管理、在线支付、学生端+管理端' },
        { name: '医疗健康 APP 后端', source: '公司项目', similarity: 78, techStack: ['Java', 'PostgreSQL', 'Redis'], description: '健康数据管理平台，高并发接口设计' },
        { name: '某在线教育平台（前公司）', source: '简历经历', similarity: 85, techStack: ['Java', 'MyBatis', 'MySQL'], description: 'K12 在线教育平台，负责课程与支付模块开发' },
      ],
    },
    {
      id: 'user-2', name: '李娜', level: 'L6', title: 'UI 设计师', skillMatch: 90, bandwidth: 50, bandwidthLabel: '充裕',
      skills: ['Figma', 'Sketch', '设计系统', 'B 端设计'], avatar: '李',
      similarProjects: [
        { name: '智慧校园小程序（公司）', source: '公司项目', similarity: 88, techStack: ['Figma', '小程序 UI'], description: '教育类小程序全套 UI 设计，含学生端+教师端+管理端' },
        { name: '电商平台小程序', source: '公司项目', similarity: 72, techStack: ['Figma', 'Design System'], description: '电商类小程序设计，商品展示+购物车+订单流程' },
        { name: '某教育 APP UI 设计（前公司）', source: '简历经历', similarity: 80, techStack: ['Sketch', 'Principle'], description: '在线教育 APP，负责课程学习页、直播互动页设计' },
      ],
    },
    {
      id: 'user-3', name: '王磊', level: 'L7', title: '高级前端工程师', skillMatch: 88, bandwidth: 70, bandwidthLabel: '偏紧',
      skills: ['React', 'TypeScript', 'Tailwind', '小程序'], avatar: '王',
      similarProjects: [
        { name: '电商平台小程序', source: '公司项目', similarity: 85, techStack: ['React', 'Taro', '小程序'], description: '电商小程序前端开发，含商品浏览、下单、支付全流程' },
        { name: '企业 OA 系统', source: '公司项目', similarity: 65, techStack: ['React', 'Ant Design'], description: '内部 OA 系统前端，审批流程、日报、考勤模块' },
        { name: '某外卖平台小程序（前公司）', source: '简历经历', similarity: 78, techStack: ['微信小程序', 'WXML'], description: '外卖点餐小程序，负责首页、菜单、购物车页面' },
      ],
    },
    {
      id: 'user-4', name: '赵敏', level: 'L5', title: '测试工程师', skillMatch: 82, bandwidth: 40, bandwidthLabel: '充裕',
      skills: ['自动化测试', 'Playwright', '接口测试'], avatar: '赵',
      similarProjects: [
        { name: '电商平台小程序', source: '公司项目', similarity: 80, techStack: ['Playwright', 'Jest'], description: '电商小程序全流程自动化测试，含支付链路回归' },
        { name: '企业 OA 系统', source: '公司项目', similarity: 60, techStack: ['Selenium', 'Postman'], description: 'OA 系统功能测试与接口测试' },
        { name: '某银行 APP 测试（前公司）', source: '简历经历', similarity: 70, techStack: ['Appium', 'JMeter'], description: '银行 APP 性能测试与安全测试' },
      ],
    },
    {
      id: 'user-5', name: '陈浩', level: 'L7', title: '高级后端工程师', skillMatch: 78, bandwidth: 90, bandwidthLabel: '饱和',
      skills: ['Python', 'Go', 'Docker', 'K8s'], avatar: '陈',
      similarProjects: [
        { name: '智能制造 MES 系统', source: '公司项目', similarity: 55, techStack: ['Go', 'gRPC', 'Docker'], description: '工业 MES 系统后端，设备数据采集与生产调度' },
        { name: '某社交 APP 后端（前公司）', source: '简历经历', similarity: 45, techStack: ['Python', 'Django', 'Celery'], description: '社交 APP 消息推送与IM后端' },
      ],
    },
  ],
}

export const CONTRACT_ANALYSIS_DESENSITIZED: AgentAnalysisResult = {
  ...CONTRACT_ANALYSIS,
  contextSummary: '该客户历史合作记录良好，但回款周期偏长。当前尾款比例偏高，建议调整付款条款。团队排期较紧，交付时间需评估。',
  inlineWarnings: CONTRACT_ANALYSIS.inlineWarnings.map((w) => ({
    ...w,
    detail: w.level === 'danger' ? '建议调整为标准付款比例以降低风险。' : w.detail,
  })),
}

export const AGENT_LOGS: AgentLogEntry[] = [
  { timestamp: '00:00.000', source: 'Pipeline', message: '收到合同提交事件，触发 ContractAnalysis Agent' },
  { timestamp: '00:00.120', source: 'Context Engine', message: '正在穿透 Customers 数据库，检索客户 ID: cust-001 的历史合作记录...' },
  { timestamp: '00:00.350', source: 'Context Engine', message: '✓ 找到 3 笔历史合同，平均回款周期 45 天，尾款回收率 82%' },
  { timestamp: '00:00.520', source: 'Context Engine', message: '正在穿透 Finance 模块，检索该客户的发票与付款记录...' },
  { timestamp: '00:00.780', source: 'Context Engine', message: '✓ 发现 2 次逾期记录，最长逾期 22 天' },
  { timestamp: '00:01.050', source: 'Context Engine', message: '正在穿透 HR 模块，检索前端组 8 月工时饱和度...' },
  { timestamp: '00:01.320', source: 'Context Engine', message: '✓ 前端组饱和度 90%，可用高级前端仅 1 人（王磊）' },
  { timestamp: '00:01.500', source: 'Context Engine', message: '正在穿透 Projects 模块，检索同类教育小程序项目的历史 WBS...' },
  { timestamp: '00:01.850', source: 'Context Engine', message: '✓ 找到 5 个同类项目，平均交付周期 45 天，平均工时 190h' },
  { timestamp: '00:02.000', source: 'LLM Reasoning', message: '上下文收集完成，开始调用 Deepseek 进行风险推理...' },
  { timestamp: '00:02.800', source: 'LLM Reasoning', message: '✓ 风险评估完成：HIGH（尾款比例 + 交付压缩 + 报价偏低）' },
  { timestamp: '00:02.950', source: 'Zod Validator', message: '正在校验结构化输出 Schema...' },
  { timestamp: '00:03.000', source: 'Zod Validator', message: '✓ ContractAnalysisResult 校验通过，3 条 inlineWarnings, 6 条 WBS' },
  { timestamp: '00:03.050', source: 'Pipeline', message: '结果已写入分析表，通过 WebSocket 推送至前端' },
]

// ==================== 完整合同文本 ====================

export const CONTRACT_FULL_TEXT = `
软件开发服务合同

合同编号：HT-2026-0718-001
签订日期：2026 年 7 月 18 日

甲方（委托方）：深圳前海智学教育科技有限公司
统一社会信用代码：91440300MA5G2XXXXX
法定代表人：王建国
地址：深圳市南山区科技园南区深南大道 9998 号万利达科技大厦 12 楼
联系人：刘芳    联系电话：138-0000-1234

乙方（受托方）：XX 软件科技有限公司
统一社会信用代码：91440300MA5D1XXXXX
法定代表人：李明
地址：深圳市福田区车公庙天安数码城创新科技广场 B 座 8 楼
联系人：张三    联系电话：139-0000-5678

鉴于甲方拟委托乙方进行"智学云课堂"微信小程序及相关管理后台的开发工作，双方经友好协商，达成如下协议：

第一条  项目范围与交付物

1.1 项目名称：智学云课堂在线教育平台

1.2 项目范围：
  （1）微信小程序端（学生端）：课程浏览、在线购买、视频播放、学习进度跟踪、作业提交、在线考试、学习报告
  （2）微信小程序端（教师端）：课程管理、作业批改、考试出题、学生管理、数据统计
  （3）Web 管理后台：机构管理、课程管理、用户管理、订单管理、数据报表、内容审核、财务管理
  （4）第三方集成：微信支付、腾讯云点播、阿里云 OSS、短信服务

1.3 交付物清单：
  （1）需求规格说明书
  （2）UI/UX 设计稿（Figma 源文件）
  （3）前端源代码（含小程序与 Web 后台）
  （4）后端源代码及 API 文档
  （5）数据库设计文档
  （6）测试报告
  （7）部署文档及运维手册
  （8）三个月免费维护期

第二条  项目工期

2.1 项目总工期：30 个工作日（自合同签订之日起计算）

2.2 里程碑计划：
  （1）需求确认：合同签订后 5 个工作日内完成
  （2）UI 设计：需求确认后 5 个工作日内完成
  （3）前端开发：UI 确认后 10 个工作日内完成
  （4）后端开发：与前端并行，10 个工作日内完成
  （5）联调测试：开发完成后 5 个工作日内完成
  （6）上线部署：测试通过后 3 个工作日内完成
  （7）验收确认：上线后 2 个工作日内完成

2.3 乙方应按照上述里程碑计划提交各阶段交付物。如因甲方原因导致工期延误，工期相应顺延。

第三条  合同金额与付款方式

3.1 合同总金额：人民币壹拾伍万叁仟元整（¥153,000.00）

3.2 付款方式：
  （1）首付款：合同签订后 3 个工作日内，甲方向乙方支付合同总额的 40%，即人民币陆万壹仟贰佰元整（¥61,200.00）
  （2）中期款：UI 设计稿确认后 3 个工作日内，甲方向乙方支付合同总额的 30%，即人民币肆万伍仟玖佰元整（¥45,900.00）
  （3）尾款：项目验收通过后 7 个工作日内，甲方向乙方支付合同总额的 30%，即人民币肆万伍仟玖佰元整（¥45,900.00）

3.3 乙方收款账户：
  户名：XX 软件科技有限公司
  开户行：招商银行深圳福田支行
  账号：7559 0123 4567 8901 234

第四条  知识产权

4.1 本项目开发完成的全部源代码、设计稿、文档等成果的知识产权归甲方所有。

4.2 乙方在开发过程中使用的通用工具、框架、组件的知识产权仍归乙方或原始权利人所有。

4.3 乙方保证其交付的成果不侵犯任何第三方的知识产权。如因知识产权纠纷导致甲方损失，乙方应承担全部赔偿责任。

第五条  保密条款

5.1 双方应对本合同的内容及在履行合同过程中知悉的对方商业秘密严格保密。

5.2 保密期限：自合同签订之日起 3 年。

5.3 未经对方书面同意，任何一方不得向第三方披露合同金额、技术方案、客户信息等保密信息。

第六条  验收标准与流程

6.1 验收标准：
  （1）功能完整性：交付物应覆盖需求规格说明书中的全部功能
  （2）性能指标：页面加载时间 ≤ 3 秒，API 响应时间 ≤ 500ms，并发支持 ≥ 500 用户
  （3）兼容性：支持 iOS 14+、Android 10+、Chrome 90+
  （4）安全性：通过基本安全测试，无高危漏洞

6.2 验收流程：
  （1）乙方提交验收申请及测试报告
  （2）甲方在 5 个工作日内完成验收测试
  （3）验收通过，双方签署验收确认书
  （4）验收不通过，乙方应在 3 个工作日内完成整改并重新提交

第七条  售后服务与维护

7.1 免费维护期：验收通过后 3 个月，乙方提供免费 Bug 修复服务。

7.2 免费维护期内，乙方应在收到问题报告后 24 小时内响应，72 小时内修复。

7.3 免费维护期满后，如甲方需要继续维护服务，双方另行签订维护合同。

7.4 维护范围不包括：甲方新增需求、第三方服务变更导致的问题、不可抗力导致的故障。

第八条  违约责任

8.1 如乙方未按期交付，每延迟一天，应向甲方支付合同总额 0.5% 的违约金，但累计不超过合同总额的 10%。

8.2 如甲方未按期付款，每延迟一天，应向乙方支付应付金额 0.5% 的滞纳金。

8.3 任何一方违反保密义务，违约方应向守约方支付合同总额 20% 的违约金，并赔偿由此造成的全部损失。

第九条  不可抗力

9.1 因不可抗力导致合同无法履行的，受影响方应在 3 个工作日内书面通知对方，并在 15 个工作日内提供相关证明。

9.2 不可抗力持续超过 30 天的，任何一方有权书面通知对方解除合同。

第十条  争议解决

10.1 本合同的签订、履行、解释及争议解决均适用中华人民共和国法律。

10.2 双方因本合同产生争议的，应首先友好协商解决；协商不成的，任何一方可向乙方所在地人民法院提起诉讼。

第十一条  其他约定

11.1 本合同一式四份，甲乙双方各执两份，具有同等法律效力。

11.2 本合同自双方签字盖章之日起生效。

11.3 本合同未尽事宜，双方可另行签订补充协议，补充协议与本合同具有同等法律效力。

（以下无正文）

甲方（盖章）：深圳前海智学教育科技有限公司
法定代表人/授权代表：________________
日期：2026 年 7 月 18 日

乙方（盖章）：XX 软件科技有限公司
法定代表人/授权代表：________________
日期：2026 年 7 月 18 日
`.trim()

// ==================== 合同审查结果 ====================

export const CONTRACT_REVIEW_RESULT: ContractReviewResult = {
  overallRisk: 'HIGH',
  overallSummary:
    'Agent 穿透客户数据库、财务模块、HR 模块、行业知识库后，对本合同进行全维度审查。共发现 3 项高风险、2 项中风险、5 项低风险、4 项无风险通过。整体风险等级为 HIGH，建议在签约前调整付款条款和交付周期。',
  checks: [
    // === 内容审查 ===
    {
      id: 'content-scope',
      category: '内容审查',
      name: '项目范围完整性',
      status: 'warning',
      summary: '项目范围描述较完整，但部分功能缺乏验收标准',
      detail:
        '合同 1.2 条列出了 4 大模块（学生端、教师端、管理后台、第三方集成），功能描述较清晰。但"学习进度跟踪""数据报表"等功能未定义具体的验收指标（如数据精度、报表维度），可能导致验收争议。',
      suggestion: '建议在附件中补充各功能模块的详细验收标准，明确"完成"的定义。',
      anchor: {
        text: '1.2 项目范围',
      },
    },
    {
      id: 'content-deliverable',
      category: '内容审查',
      name: '交付物清单',
      status: 'pass',
      summary: '交付物清单完整，覆盖设计、开发、测试、文档全阶段',
      detail:
        '合同 1.3 条列出了 8 项交付物，包含需求文档、设计稿、源代码、测试报告、部署文档等，覆盖软件交付全生命周期。特别包含了"三个月免费维护期"，符合行业惯例。',
      anchor: {
        text: '1.3 交付物清单',
      },
    },
    {
      id: 'content-timeline',
      category: '内容审查',
      name: '工期合理性',
      status: 'danger',
      summary: '30 个工作日交付 4 个模块严重偏紧，延期风险极高',
      detail:
        '穿透项目模块历史数据：近 6 个月同类教育小程序项目（含管理后台）平均交付周期为 45 个工作日，最短 38 天。本合同承诺 30 天完成 4 个模块（学生端+教师端+管理后台+第三方集成），工期压缩 33%。当前前端组 8 月饱和度 90%，可用高级前端仅 1 人（王磊），后端组张伟已排期至 8 月底。',
      suggestion: '建议将工期延长至 45 个工作日，或增加 1 名高级前端开发。如客户坚持 30 天，需明确告知交付范围可能需要分期。',
      anchor: {
        text: '2.1 项目总工期',
      },
    },
    // === 法律审查 ===
    {
      id: 'legal-ip',
      category: '法律审查',
      name: '知识产权条款',
      status: 'pass',
      summary: '知识产权归属明确，乙方保留通用工具权利',
      detail:
        '合同 4.1 条明确全部成果知识产权归甲方所有，4.2 条合理保留了乙方通用工具/框架的权利，4.3 条设置了知识产权侵权担保条款。条款设计合理，符合外包行业惯例。',
      anchor: {
        text: '第四条  知识产权',
      },
    },
    {
      id: 'legal-confidential',
      category: '法律审查',
      name: '保密条款',
      status: 'pass',
      summary: '保密条款完整，期限合理',
      detail:
        '合同 5.1-5.3 条设置了保密义务、保密期限（3 年）和违约金（合同总额 20%）。保密范围涵盖了商业秘密、技术方案、客户信息等关键信息。3 年保密期符合行业标准。',
      anchor: {
        text: '第五条  保密条款',
      },
    },
    {
      id: 'legal-liability',
      category: '法律审查',
      name: '违约责任条款',
      status: 'warning',
      summary: '违约金上限偏低，对乙方约束力不足',
      detail:
        '合同 8.1 条约定乙方延期违约金为每天 0.5%，累计上限为合同总额 10%（即 ¥15,300）。对比行业标准（通常 15%-20%），违约金上限偏低。若项目延期 20 天，违约金仅 ¥15,300，不足以覆盖甲方的延期损失（如运营成本、机会成本）。',
      suggestion: '建议将违约金累计上限提升至合同总额的 15%-20%，或设置阶梯式违约金（延期 1-10 天 0.5%/天，10 天以上 1%/天）。',
      anchor: {
        text: '第八条  违约责任',
      },
    },
    {
      id: 'legal-dispute',
      category: '法律审查',
      name: '争议解决条款',
      status: 'info',
      summary: '约定乙方所在地法院管辖，对甲方略有不利',
      detail:
        '合同 10.2 条约定"向乙方所在地人民法院提起诉讼"。由于乙方注册地在深圳福田，甲方注册地在深圳南山，两地法院距离不远，实际影响有限。但如果未来乙方变更注册地，可能增加甲方维权成本。',
      suggestion: '可考虑约定"向合同签订地人民法院提起诉讼"或"提交深圳国际仲裁院仲裁"，更中立。',
      anchor: {
        text: '第十条  争议解决',
      },
    },
    // === 商务合作审查 ===
    {
      id: 'biz-payment',
      category: '商务审查',
      name: '付款条款',
      status: 'danger',
      summary: '尾款比例 30% 偏低，回款保障不足',
      detail:
        '合同 3.2 条约定付款节奏为 40%/30%/30%。穿透财务模块数据：该客户（深圳前海智学教育）过去 1 年合作 3 次，平均回款周期 45 天（公司标准 30 天），其中 2 次出现尾款逾期（最长逾期 22 天）。当前尾款 ¥45,900 仅在"验收通过后 7 个工作日"支付，但合同未定义验收不通过时的处理机制，可能导致尾款长期悬而未决。',
      suggestion: '建议调整为 40%/30%/30% 但设置验收超时自动视为通过的条款（如甲方收到验收申请后 10 个工作日未提出异议视为验收通过），或将尾款拆分为 25% 验收款 + 5% 质保金。',
      anchor: {
        text: '3.2 付款方式',
      },
    },
    {
      id: 'biz-acceptance',
      category: '商务审查',
      name: '验收流程',
      status: 'warning',
      summary: '验收标准有量化指标，但缺少验收超时机制',
      detail:
        '合同 6.1 条设置了功能完整性、性能指标（加载≤3s、API≤500ms、并发≥500）、兼容性等量化标准，较为规范。但 6.2 条仅约定甲方"5 个工作日内完成验收"，未设置超时自动通过机制，可能导致甲方拖延验收从而延迟付款。',
      suggestion: '建议增加"甲方收到验收申请后 10 个工作日内未提出书面异议的，视为验收通过"。',
      anchor: {
        text: '第六条  验收标准与流程',
      },
    },
    {
      id: 'biz-price',
      category: '商务审查',
      name: '报价合理性',
      status: 'info',
      summary: '报价略低于同类项目均价，利润率承压',
      detail:
        '穿透合同模块历史数据：近 6 个月教育类小程序项目（含管理后台）的合同均价为 ¥182,000，本合同报价 ¥153,000，低于均价 16%。按当前工时估算（需求调研 20h + UI 设计 30h + 前端 60h + 后端 50h + 测试 20h + 部署 10h = 190h），以平均时薪 ¥300 计算，人力成本约 ¥57,000，毛利率约 62.7%，处于合理范围但偏低。',
      anchor: {
        text: '3.1 合同总金额',
      },
    },
    // === 行业限制审查 ===
    {
      id: 'industry-edu',
      category: '行业审查',
      name: '教育行业资质',
      status: 'danger',
      summary: '在线教育平台需关注办学许可证与ICP备案要求',
      detail:
        '穿透行业知识库：根据《民办教育促进法》及教育部等六部门《关于规范校外线上培训的实施意见》，面向中小学生提供学科类在线培训需取得办学许可证。本合同项目"智学云课堂"包含"在线考试""学习报告"等功能，如涉及 K12 学科类培训，甲方可能需要额外资质。合同中未约定甲方资质合规的免责声明。',
      suggestion: '建议在合同中增加甲方资质保证条款："甲方保证其使用本平台开展的业务已取得或无需取得相关行政许可，因甲方资质问题导致的法律责任由甲方承担。"',
      anchor: {
        text: '1.1 项目名称',
      },
    },
    {
      id: 'industry-payment',
      category: '行业审查',
      name: '支付接入合规',
      status: 'pass',
      summary: '微信支付接入需商户资质，属甲方责任',
      detail:
        '合同 1.2 条约定集成微信支付。微信支付接入需要甲方提供营业执照、法人身份证、对公账户等材料申请商户号。合同中未明确此为甲方义务，但从行业惯例看，商户资质申请属于甲方责任，实际操作中不会产生争议。',
      anchor: {
        text: '（4）第三方集成',
      },
    },
    {
      id: 'industry-data',
      category: '行业审查',
      name: '数据安全与隐私',
      status: 'warning',
      summary: '教育平台涉及未成年人数据，需关注《个人信息保护法》',
      detail:
        '穿透行业知识库：本平台面向教育场景，可能涉及未成年人个人信息（姓名、年龄、学习数据等）。根据《个人信息保护法》第 28 条，处理不满 14 周岁未成年人个人信息应取得其监护人同意。合同中未约定数据安全责任划分和隐私保护要求。',
      suggestion: '建议增加数据安全条款：明确甲乙双方的数据安全责任，约定乙方不得留存用户数据，开发完成后应删除所有测试数据。',
      anchor: {
        text: '第五条  保密条款',
      },
    },
    {
      id: 'industry-content',
      category: '行业审查',
      name: '内容审核责任',
      status: 'pass',
      summary: '管理后台含内容审核功能，符合监管要求',
      detail:
        '合同 1.2 条管理后台包含"内容审核"功能，符合教育类平台的内容监管要求。平台内容审核责任归属甲方，乙方仅提供技术工具。此约定合理。',
      anchor: {
        text: '（3）Web 管理后台',
      },
    },
  ],
}

// ==================== Agent 思考日志 ====================

export const CONTRACT_REVIEW_LOGS: AgentLogEntry[] = [
  { timestamp: '00:00.000', source: 'Pipeline', message: '收到合同提交事件，触发 ContractReview Agent (Topic: CLM)' },
  { timestamp: '00:00.080', source: 'Context Engine', message: '正在解析合同文本，提取关键字段：合同编号、甲乙双方、金额、工期、付款条款...' },
  { timestamp: '00:00.350', source: 'Context Engine', message: '✓ 合同解析完成：HT-2026-0718-001, ¥153,000, 30 工作日, 40%/30%/30%' },
  { timestamp: '00:00.520', source: 'Context Engine', message: '正在穿透 Customers 数据库，检索甲方"深圳前海智学教育科技有限公司"的历史合作记录...' },
  { timestamp: '00:00.850', source: 'Context Engine', message: '✓ 找到 3 笔历史合同：平均回款周期 45 天，2 次尾款逾期（最长 22 天）' },
  { timestamp: '00:01.020', source: 'Context Engine', message: '正在穿透 Finance 模块，检索该客户的发票与付款记录...' },
  { timestamp: '00:01.280', source: 'Context Engine', message: '✓ 发现逾期付款记录：2025-11 笔 ¥32,000 逾期 18 天，2026-03 笔 ¥28,000 逾期 22 天' },
  { timestamp: '00:01.450', source: 'Context Engine', message: '正在穿透 Projects 模块，检索近 6 个月同类教育小程序项目的历史数据...' },
  { timestamp: '00:01.780', source: 'Context Engine', message: '✓ 找到 5 个同类项目：平均工期 45 天，平均合同额 ¥182,000，平均工时 195h' },
  { timestamp: '00:01.950', source: 'Context Engine', message: '正在穿透 HR 模块，检索前端组和后端组的人员排期与饱和度...' },
  { timestamp: '00:02.200', source: 'Context Engine', message: '✓ 前端组 8 月饱和度 90%，可用高级前端仅 1 人（王磊）；后端张伟排期至 8 月底' },
  { timestamp: '00:02.400', source: 'Context Engine', message: '正在穿透 Contracts 模块，检索公司标准合同模板与条款...' },
  { timestamp: '00:02.650', source: 'Context Engine', message: '✓ 标准付款节奏 50%/30%/20%，违约金上限 15%，验收超时 10 天自动通过' },
  { timestamp: '00:02.800', source: 'Context Engine', message: '正在穿透行业知识库，检索教育行业资质要求与合规风险...' },
  { timestamp: '00:03.100', source: 'Context Engine', message: '✓ 检索到《民办教育促进法》《个人信息保护法》《校外线上培训实施意见》相关条款' },
  { timestamp: '00:03.300', source: 'LLM Reasoning', message: '全部上下文收集完成（6 个域），开始调用 Deepseek 进行多维度风险推理...' },
  { timestamp: '00:03.900', source: 'LLM Reasoning', message: '✓ 内容审查完成：工期压缩 33%（HIGH），范围完整性（WARNING），交付物（PASS）' },
  { timestamp: '00:04.200', source: 'LLM Reasoning', message: '✓ 法律审查完成：知识产权（PASS），保密（PASS），违约金上限偏低（WARNING），争议管辖（INFO）' },
  { timestamp: '00:04.500', source: 'LLM Reasoning', message: '✓ 商务审查完成：付款条款（HIGH），验收流程（WARNING），报价偏低（INFO）' },
  { timestamp: '00:04.800', source: 'LLM Reasoning', message: '✓ 行业审查完成：教育资质（HIGH），支付合规（PASS），数据隐私（WARNING），内容审核（PASS）' },
  { timestamp: '00:05.000', source: 'LLM Reasoning', message: '综合评估：3 HIGH + 2 WARNING + 1 INFO + 4 PASS → 整体风险 HIGH' },
  { timestamp: '00:05.150', source: 'Zod Validator', message: '正在校验 ContractReviewResult Schema...' },
  { timestamp: '00:05.250', source: 'Zod Validator', message: '✓ 校验通过：14 项检查，3 danger, 4 warning, 2 info, 5 pass' },
  { timestamp: '00:05.300', source: 'Pipeline', message: '结果已写入审查表，通过 WebSocket 推送至前端' },
]

// 合同审查脱敏版（销售视角）
export const CONTRACT_REVIEW_DESENSITIZED: ContractReviewResult = {
  ...CONTRACT_REVIEW_RESULT,
  overallSummary: '合同整体风险较高，主要集中在交付周期和付款条款。建议在签约前与客户沟通调整。',
  checks: CONTRACT_REVIEW_RESULT.checks.map((c) => ({
    ...c,
    detail: c.status === 'danger' ? '存在较高风险，建议与团队沟通后调整。' : c.detail,
  })),
}
