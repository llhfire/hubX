// ========================================
// 微信群采集模块 - Mock 数据
// ========================================

import type {
  WeChatBot, WeChatGroup, GroupMember, ChatMessage,
  ProjectContext, ExtractedItem, AlertRule, AlertRecord,
} from './types';

// ==================== 机器人账号 ====================

export const mockBots: WeChatBot[] = [
  {
    id: 'bot-001',
    wechatId: 'wxid_sales01',
    nickname: 'HubX业务助手',
    status: '在线',
    cloudComputer: 'cloud-pc-01',
    groupCount: 12,
    lastSyncTime: '2026-07-29T10:30:00',
    remark: '主业务号',
    createTime: '2026-06-01T00:00:00',
    updateTime: '2026-07-29T10:30:00',
  },
  {
    id: 'bot-002',
    wechatId: 'wxid_sales02',
    nickname: 'HubX客服号',
    status: '离线',
    cloudComputer: 'cloud-pc-02',
    groupCount: 8,
    lastSyncTime: '2026-07-28T18:00:00',
    remark: '备用号',
    createTime: '2026-06-15T00:00:00',
    updateTime: '2026-07-28T18:00:00',
  },
  {
    id: 'bot-003',
    wechatId: 'wxid_sales03',
    nickname: 'HubX项目号',
    status: '异常',
    cloudComputer: 'cloud-pc-03',
    groupCount: 5,
    lastSyncTime: '2026-07-27T09:00:00',
    remark: '云端电脑异常，需检查',
    createTime: '2026-07-01T00:00:00',
    updateTime: '2026-07-27T09:00:00',
  },
];

// ==================== 群成员 ====================

export const mockGroupMembers: GroupMember[] = [
  // 群1: 家具小程序
  { id: 'gm-001', groupId: 'grp-001', wechatNickname: '张总', wechatId: 'wxid_zhangzong', identity: '客户', isCustomer: true, isConfirmed: true },
  { id: 'gm-002', groupId: 'grp-001', wechatNickname: '李四-产品经理', wechatId: 'wxid_lisi', identity: '我方', systemUserId: 'emp-003', systemUserName: '李四', isCustomer: false, isConfirmed: true },
  { id: 'gm-003', groupId: 'grp-001', wechatNickname: '王五-前端', wechatId: 'wxid_wangwu', identity: '我方', systemUserId: 'emp-004', systemUserName: '王五', isCustomer: false, isConfirmed: true },
  { id: 'gm-004', groupId: 'grp-001', wechatNickname: '赵六（设计）', wechatId: 'wxid_zhaoliu', identity: '我方', systemUserId: 'emp-005', systemUserName: '赵六', isCustomer: false, isConfirmed: true },
  // 群2: 医疗陪诊
  { id: 'gm-005', groupId: 'grp-002', wechatNickname: '刘总', wechatId: 'wxid_liuzong', identity: '客户', isCustomer: true, isConfirmed: true },
  { id: 'gm-006', groupId: 'grp-002', wechatNickname: '陈七-项目经理', wechatId: 'wxid_chenqi', identity: '我方', systemUserId: 'emp-006', systemUserName: '陈七', isCustomer: false, isConfirmed: true },
  { id: 'gm-007', groupId: 'grp-002', wechatNickname: '周八-后端', wechatId: 'wxid_zhouba', identity: '我方', systemUserId: 'emp-007', systemUserName: '周八', isCustomer: false, isConfirmed: true },
  // 群3: 汽车配件
  { id: 'gm-008', groupId: 'grp-003', wechatNickname: '吴总', wechatId: 'wxid_wuzong', identity: '客户', isCustomer: true, isConfirmed: true },
  { id: 'gm-009', groupId: 'grp-003', wechatNickname: '郑九-销售', wechatId: 'wxid_zhengjiu', identity: '我方', systemUserId: 'emp-008', systemUserName: '郑九', isCustomer: false, isConfirmed: true },
  { id: 'gm-010', groupId: 'grp-003', wechatNickname: '孙十-产品经理', wechatId: 'wxid_sunshi', identity: '我方', systemUserId: 'emp-009', systemUserName: '孙十', isCustomer: false, isConfirmed: true },
];

// ==================== 微信群 ====================

export const mockGroups: WeChatGroup[] = [
  {
    id: 'grp-001',
    groupName: '【0721】家具小程序开发',
    botId: 'bot-001',
    botNickname: 'HubX业务助手',
    leadId: '1',
    leadName: '家具小程序开发',
    projectId: '1',
    projectName: '家具小程序开发项目',
    memberCount: 4,
    todayMsgCount: 47,
    activityLevel: '高',
    lastMessageTime: '2026-07-29T10:15:00',
    botJoinedAt: '2026-07-21T09:00:00',
    lastSyncTime: '2026-07-29T10:30:00',
    nextSyncTime: '2026-07-29T10:30:30',
    isArchived: false,
    createTime: '2026-07-21T09:00:00',
    updateTime: '2026-07-29T10:15:00',
  },
  {
    id: 'grp-002',
    groupName: '【0815】医疗陪诊小程序',
    botId: 'bot-001',
    botNickname: 'HubX业务助手',
    leadId: '2',
    leadName: '医疗陪诊小程序',
    memberCount: 3,
    todayMsgCount: 12,
    activityLevel: '中',
    lastMessageTime: '2026-07-29T09:30:00',
    botJoinedAt: '2026-08-15T10:00:00',
    lastSyncTime: '2026-07-29T10:30:00',
    nextSyncTime: '2026-07-29T10:30:30',
    isArchived: false,
    createTime: '2026-08-15T10:00:00',
    updateTime: '2026-07-29T09:30:00',
  },
  {
    id: 'grp-003',
    groupName: '【0910】汽车配件索赔系统',
    botId: 'bot-001',
    botNickname: 'HubX业务助手',
    leadId: '3',
    leadName: '汽车配件索赔系统',
    memberCount: 3,
    todayMsgCount: 3,
    activityLevel: '低',
    lastMessageTime: '2026-07-28T16:00:00',
    botJoinedAt: '2026-09-10T14:00:00',
    lastSyncTime: '2026-07-29T10:30:00',
    nextSyncTime: '2026-07-29T10:30:30',
    isArchived: false,
    createTime: '2026-09-10T14:00:00',
    updateTime: '2026-07-28T16:00:00',
  },
  {
    id: 'grp-004',
    groupName: '【1005】教育平台APP',
    botId: 'bot-002',
    botNickname: 'HubX客服号',
    leadId: '4',
    leadName: '教育平台APP',
    memberCount: 5,
    todayMsgCount: 0,
    activityLevel: '沉默',
    lastMessageTime: '2026-07-25T11:00:00',
    botJoinedAt: '2026-10-05T09:00:00',
    lastSyncTime: '2026-07-28T18:00:00',
    nextSyncTime: '2026-07-28T18:00:30',
    isArchived: false,
    createTime: '2026-10-05T09:00:00',
    updateTime: '2026-07-25T11:00:00',
  },
  {
    id: 'grp-005',
    groupName: '【1101】餐饮SaaS系统',
    botId: 'bot-001',
    botNickname: 'HubX业务助手',
    leadId: '5',
    leadName: '餐饮SaaS系统',
    projectId: '2',
    projectName: '餐饮SaaS系统项目',
    memberCount: 6,
    todayMsgCount: 35,
    activityLevel: '高',
    lastMessageTime: '2026-07-29T10:20:00',
    botJoinedAt: '2026-11-01T10:00:00',
    lastSyncTime: '2026-07-29T10:30:00',
    nextSyncTime: '2026-07-29T10:30:30',
    isArchived: false,
    createTime: '2026-11-01T10:00:00',
    updateTime: '2026-07-29T10:20:00',
  },
  {
    id: 'grp-006',
    groupName: '【0601】企业OA管理系统',
    botId: 'bot-001',
    botNickname: 'HubX业务助手',
    leadId: '15',
    leadName: '企业OA管理系统定制开发',
    projectId: '1',
    projectName: '企业OA管理系统项目',
    memberCount: 5,
    todayMsgCount: 28,
    activityLevel: '高',
    lastMessageTime: '2026-07-29T11:00:00',
    botJoinedAt: '2026-06-01T10:00:00',
    lastSyncTime: '2026-07-29T10:30:00',
    nextSyncTime: '2026-07-29T10:30:30',
    isArchived: false,
    createTime: '2026-06-01T10:00:00',
    updateTime: '2026-07-29T10:20:00',
  },
];

// ==================== 聊天消息（群1: 家具小程序）====================

export const mockMessages: ChatMessage[] = [
  // 7月28日
  {
    id: 'msg-001', groupId: 'grp-001', msgType: '文本', content: '大家好，首页的设计稿已经发到群里了，麻烦看一下',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-28T09:00:00', isExtracted: false,
  },
  {
    id: 'msg-002', groupId: 'grp-001', msgType: '图片', content: '首页设计稿V2', mediaUrl: '/mock/design-v2.png', mediaName: '首页设计稿V2.png', mediaSize: '2.3MB',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-28T09:01:00', isExtracted: false,
  },
  {
    id: 'msg-003', groupId: 'grp-001', msgType: '文本', content: '整体风格不错，但是banner换成蓝色的吧，跟我们品牌色一致',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-28T09:32:00', isExtracted: true, extractedItemId: 'ext-001',
  },
  {
    id: 'msg-004', groupId: 'grp-001', msgType: '文本', content: '好的张总，我调整一下',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-28T09:35:00', isExtracted: false,
  },
  {
    id: 'msg-005', groupId: 'grp-001', msgType: '文本', content: '还有商品详情页的图片轮播，能不能支持手势缩放？',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-28T10:15:00', isExtracted: true, extractedItemId: 'ext-002',
  },
  {
    id: 'msg-006', groupId: 'grp-001', msgType: '文本', content: '可以的，这个功能我们之前做过，大概需要2天时间',
    senderId: 'gm-003', senderNickname: '王五-前端', senderIdentity: '我方', sendTime: '2026-07-28T10:18:00', isExtracted: false,
  },
  {
    id: 'msg-007', groupId: 'grp-001', msgType: '文本', content: '登录页面点了两次才跳转，这个bug修了吗？',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-28T14:20:00', isExtracted: true, extractedItemId: 'ext-003',
  },
  {
    id: 'msg-008', groupId: 'grp-001', msgType: '文本', content: '我查一下，应该是防抖没处理好',
    senderId: 'gm-003', senderNickname: '王五-前端', senderIdentity: '我方', sendTime: '2026-07-28T14:22:00', isExtracted: false,
  },
  {
    id: 'msg-009', groupId: 'grp-001', msgType: '文本', content: '已经修复了，麻烦张总再试试',
    senderId: 'gm-003', senderNickname: '王五-前端', senderIdentity: '我方', sendTime: '2026-07-28T15:00:00', isExtracted: false,
  },
  {
    id: 'msg-010', groupId: 'grp-001', msgType: '文本', content: '好的，我看看',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-28T15:05:00', isExtracted: false,
  },
  {
    id: 'msg-011', groupId: 'grp-001', msgType: '文件', content: '', mediaUrl: '/mock/requirements-v3.docx', mediaName: '需求文档V3.docx', mediaSize: '156KB',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-28T16:00:00', isExtracted: false,
  },
  {
    id: 'msg-012', groupId: 'grp-001', msgType: '文本', content: '最新版需求文档已上传，请大家查看',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-28T16:01:00', isExtracted: false,
  },
  {
    id: 'msg-013', groupId: 'grp-001', msgType: '文本', content: '下周三之前要交付第二版，大家抓紧',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-28T16:30:00', isExtracted: true, extractedItemId: 'ext-004',
  },
  {
    id: 'msg-014', groupId: 'grp-001', msgType: '文本', content: '收到，我们安排一下排期',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-28T16:32:00', isExtracted: false,
  },
  // 7月29日
  {
    id: 'msg-015', groupId: 'grp-001', msgType: '文本', content: '早，banner颜色改好了，发预览链接给大家',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-29T09:00:00', isExtracted: false,
  },
  {
    id: 'msg-016', groupId: 'grp-001', msgType: '链接', content: '预览链接', linkUrl: 'https://preview.example.com/001', linkTitle: '家具小程序首页预览',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-29T09:01:00', isExtracted: false,
  },
  {
    id: 'msg-017', groupId: 'grp-001', msgType: '文本', content: '蓝色很好看，可以的',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-29T09:15:00', isExtracted: false,
  },
  {
    id: 'msg-018', groupId: 'grp-001', msgType: '文本', content: '搜索功能加上了吗？客户可以按价格、销量、评价筛选',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-29T09:30:00', isExtracted: true, extractedItemId: 'ext-005',
  },
  {
    id: 'msg-019', groupId: 'grp-001', msgType: '文本', content: '搜索功能在排期中，预计周四可以完成',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T09:35:00', isExtracted: false,
  },
  {
    id: 'msg-020', groupId: 'grp-001', msgType: '语音', content: '',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-29T10:00:00', isExtracted: false,
  },
  {
    id: 'msg-021', groupId: 'grp-001', msgType: '文本', content: '张总语音说了，搜索结果要支持按距离排序，他线下门店多',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T10:05:00', isExtracted: true, extractedItemId: 'ext-006',
  },
  {
    id: 'msg-022', groupId: 'grp-001', msgType: '文本', content: '好的，这个功能加上',
    senderId: 'gm-003', senderNickname: '王五-前端', senderIdentity: '我方', sendTime: '2026-07-29T10:10:00', isExtracted: false,
  },
  {
    id: 'msg-023', groupId: 'grp-001', msgType: '视频', content: '', mediaUrl: '/mock/demo-video.mp4', mediaName: '商品详情页交互演示.mp4', mediaSize: '12.5MB',
    senderId: 'gm-003', senderNickname: '王五-前端', senderIdentity: '我方', sendTime: '2026-07-29T10:20:00', isExtracted: false,
  },
  {
    id: 'msg-024', groupId: 'grp-001', msgType: '图片', content: '搜索结果页设计稿', mediaUrl: '/mock/search-design.png', mediaName: '搜索结果页.png', mediaSize: '1.5MB',
    senderId: 'gm-004', senderNickname: '赵六（设计）', senderIdentity: '我方', sendTime: '2026-07-29T10:25:00', isExtracted: false,
  },
  {
    id: 'msg-025', groupId: 'grp-001', msgType: '文件', content: '', mediaUrl: '/mock/api-doc.pdf', mediaName: '搜索接口文档.pdf', mediaSize: '320KB',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T10:30:00', isExtracted: false,
  },
];

// 群2部分消息
export const mockMessages2: ChatMessage[] = [
  {
    id: 'msg-101', groupId: 'grp-002', msgType: '文本', content: '刘总，陪诊流程的原型图做好了',
    senderId: 'gm-006', senderNickname: '陈七-项目经理', senderIdentity: '我方', sendTime: '2026-07-29T09:00:00', isExtracted: false,
  },
  {
    id: 'msg-102', groupId: 'grp-002', msgType: '图片', content: '陪诊流程原型图', mediaUrl: '/mock/prototype.png', mediaName: '陪诊流程原型.png', mediaSize: '1.8MB',
    senderId: 'gm-006', senderNickname: '陈七-项目经理', senderIdentity: '我方', sendTime: '2026-07-29T09:01:00', isExtracted: false,
  },
  {
    id: 'msg-103', groupId: 'grp-002', msgType: '文本', content: '流程看起来可以，但是预约时间能不能精确到半小时？现在是一小时一档',
    senderId: 'gm-005', senderNickname: '刘总', senderIdentity: '客户', sendTime: '2026-07-29T09:20:00', isExtracted: true, extractedItemId: 'ext-101',
  },
  {
    id: 'msg-104', groupId: 'grp-002', msgType: '文本', content: '没问题，我调整一下时间选择器',
    senderId: 'gm-007', senderNickname: '周八-后端', senderIdentity: '我方', sendTime: '2026-07-29T09:25:00', isExtracted: false,
  },
  {
    id: 'msg-105', groupId: 'grp-002', msgType: '文本', content: '还有支付这块，客户要求支持微信分账，陪诊师直接收到钱',
    senderId: 'gm-005', senderNickname: '刘总', senderIdentity: '客户', sendTime: '2026-07-29T09:30:00', isExtracted: true, extractedItemId: 'ext-102',
  },
  // 群6: 企业OA管理系统
  {
    id: 'msg-201', groupId: 'grp-006', msgType: '文本', content: '王总，审批流程的原型图做好了，您看一下',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T09:00:00', isExtracted: false,
  },
  {
    id: 'msg-202', groupId: 'grp-006', msgType: '图片', content: '审批流程原型图', mediaUrl: '/mock/approval-flow.png', mediaName: '审批流程原型.png', mediaSize: '2.1MB',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T09:01:00', isExtracted: false,
  },
  {
    id: 'msg-203', groupId: 'grp-006', msgType: '文本', content: '整体流程可以，但是请假审批要支持多级审批，部门经理批完还要总经理批',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-29T09:20:00', isExtracted: true, extractedItemId: 'ext-201',
  },
  {
    id: 'msg-204', groupId: 'grp-006', msgType: '文本', content: '好的，我加上多级审批的逻辑',
    senderId: 'gm-002', senderNickname: '李四-产品经理', senderIdentity: '我方', sendTime: '2026-07-29T09:25:00', isExtracted: false,
  },
  {
    id: 'msg-205', groupId: 'grp-006', msgType: '文本', content: '考勤模块要支持人脸识别打卡，数据要实时同步',
    senderId: 'gm-001', senderNickname: '张总', senderIdentity: '客户', sendTime: '2026-07-29T10:00:00', isExtracted: true, extractedItemId: 'ext-202',
  },
];

// ==================== AI 提取结果 ====================

export const mockExtractedItems: ExtractedItem[] = [
  // 群1的提取结果
  {
    id: 'ext-001', groupId: 'grp-001', itemType: '需求', title: '首页banner换成蓝色',
    description: '客户要求首页banner颜色改为蓝色，与品牌色保持一致',
    confidence: 0.95, status: '待审核',
    sourceMessageIds: ['msg-003'], sourceSummary: '07-28 09:32 张总(客户)',
    createdAt: '2026-07-28T22:00:00', updatedAt: '2026-07-28T22:00:00',
  },
  {
    id: 'ext-002', groupId: 'grp-001', itemType: '需求', title: '商品详情页图片支持手势缩放',
    description: '客户要求商品详情页的图片轮播支持手势缩放功能，预计需要2天开发时间',
    confidence: 0.92, status: '待审核',
    sourceMessageIds: ['msg-005', 'msg-006'], sourceSummary: '07-28 10:15 张总(客户)',
    createdAt: '2026-07-28T22:00:00', updatedAt: '2026-07-28T22:00:00',
  },
  {
    id: 'ext-003', groupId: 'grp-001', itemType: '缺陷', title: '登录页面点击两次才跳转',
    description: '客户反馈登录页面需要点击两次才能跳转，原因是防抖处理不当，已修复',
    confidence: 0.88, status: '已入库',
    sourceMessageIds: ['msg-007', 'msg-008', 'msg-009'], sourceSummary: '07-28 14:20 张总(客户)',
    linkedWorkItemId: 'BUG-015', linkedWorkItemType: 'defect',
    createdAt: '2026-07-28T22:00:00', updatedAt: '2026-07-29T09:00:00',
  },
  {
    id: 'ext-004', groupId: 'grp-001', itemType: '任务', title: '下周三前交付第二版',
    description: '客户要求下周三（7月31日）之前完成第二版交付',
    confidence: 0.9, status: '已确认',
    sourceMessageIds: ['msg-013'], sourceSummary: '07-28 16:30 张总(客户)',
    assignedTo: 'emp-003', assignedToName: '李四',
    createdAt: '2026-07-28T22:00:00', updatedAt: '2026-07-29T09:00:00',
  },
  {
    id: 'ext-005', groupId: 'grp-001', itemType: '需求', title: '搜索功能支持多维度筛选',
    description: '客户要求搜索功能支持按价格、销量、评价进行筛选',
    confidence: 0.93, status: '待审核',
    sourceMessageIds: ['msg-018'], sourceSummary: '07-29 09:30 张总(客户)',
    createdAt: '2026-07-29T10:00:00', updatedAt: '2026-07-29T10:00:00',
  },
  {
    id: 'ext-006', groupId: 'grp-001', itemType: '需求', title: '搜索结果按距离排序',
    description: '客户有多个线下门店，要求搜索结果支持按距离排序',
    confidence: 0.85, status: '待审核',
    sourceMessageIds: ['msg-020', 'msg-021'], sourceSummary: '07-29 10:00 张总(客户,语音转文字)',
    createdAt: '2026-07-29T10:30:00', updatedAt: '2026-07-29T10:30:00',
  },
  // 群2的提取结果
  {
    id: 'ext-101', groupId: 'grp-002', itemType: '需求', title: '预约时间精确到半小时',
    description: '客户要求预约时间选择器从1小时一档改为半小时一档',
    confidence: 0.91, status: '待审核',
    sourceMessageIds: ['msg-103'], sourceSummary: '07-29 09:20 刘总(客户)',
    createdAt: '2026-07-29T10:00:00', updatedAt: '2026-07-29T10:00:00',
  },
  {
    id: 'ext-102', groupId: 'grp-002', itemType: '需求', title: '支持微信分账支付',
    description: '客户要求支付功能支持微信分账，陪诊师直接收到款项',
    confidence: 0.87, status: '待审核',
    sourceMessageIds: ['msg-105'], sourceSummary: '07-29 09:30 刘总(客户)',
    createdAt: '2026-07-29T10:00:00', updatedAt: '2026-07-29T10:00:00',
  },
  // 群6的提取结果
  {
    id: 'ext-201', groupId: 'grp-006', itemType: '需求', title: '请假审批支持多级审批',
    description: '客户要求请假审批支持多级审批流程：部门经理审批后还需总经理审批',
    confidence: 0.94, status: '待审核',
    sourceMessageIds: ['msg-203'], sourceSummary: '07-29 09:20 王总(客户)',
    createdAt: '2026-07-29T10:00:00', updatedAt: '2026-07-29T10:00:00',
  },
  {
    id: 'ext-202', groupId: 'grp-006', itemType: '需求', title: '考勤模块支持人脸识别打卡',
    description: '客户要求考勤模块集成人脸识别打卡功能，数据实时同步',
    confidence: 0.91, status: '待审核',
    sourceMessageIds: ['msg-205'], sourceSummary: '07-29 10:00 王总(客户)',
    createdAt: '2026-07-29T10:30:00', updatedAt: '2026-07-29T10:30:00',
  },
];

// ==================== 项目上下文 ====================

export const mockProjectContexts: ProjectContext[] = [
  {
    id: 'ctx-001',
    groupId: 'grp-001',
    requirementChanges: [
      { id: 'rc-001', date: '07-28', content: '客户确认首页设计稿，要求banner换蓝色', status: '已确认' },
      { id: 'rc-002', date: '07-28', content: '新增商品详情页图片手势缩放需求', status: '待确认' },
      { id: 'rc-003', date: '07-29', content: '新增搜索功能多维度筛选', status: '待确认' },
      { id: 'rc-004', date: '07-29', content: '新增搜索结果按距离排序', status: '待确认' },
    ],
    knownIssues: [
      { id: 'ki-001', date: '07-28', content: '登录页点击两次才跳转（已修复）', status: '已确认' },
    ],
    keyDecisions: [
      { id: 'kd-001', date: '07-20', content: '确认使用Vue3 + UniApp技术栈', status: '已确认' },
      { id: 'kd-002', date: '07-25', content: '确认支付方案使用微信支付', status: '已确认' },
    ],
    todoItems: [
      { id: 'td-001', date: '07-28', content: '下周三前交付第二版（7月31日）', status: '已确认' },
      { id: 'td-002', date: '07-29', content: '完成搜索功能开发（周四）', status: '待确认' },
    ],
    customerStatus: '客户近期沟通态度积极，多次主动确认需求，对设计稿满意',
    riskItems: ['交付日期临近，搜索功能可能延期', '新增需求较多，需评估是否影响交付'],
    lastUpdatedAt: '2026-07-29T10:30:00',
  },
  {
    id: 'ctx-002',
    groupId: 'grp-002',
    requirementChanges: [
      { id: 'rc-101', date: '07-29', content: '预约时间改为半小时一档', status: '待确认' },
      { id: 'rc-102', date: '07-29', content: '新增微信分账支付功能', status: '待确认' },
    ],
    knownIssues: [],
    keyDecisions: [
      { id: 'kd-101', date: '07-20', content: '确认使用Flutter跨端开发', status: '已确认' },
    ],
    todoItems: [
      { id: 'td-101', date: '07-29', content: '完成原型图评审', status: '已确认' },
    ],
    customerStatus: '客户沟通积极，对原型图基本认可',
    riskItems: ['微信分账需要额外资质审核'],
    lastUpdatedAt: '2026-07-29T10:00:00',
  },
];

// ==================== 预警规则 ====================

export const mockAlertRules: AlertRule[] = [
  {
    id: 'rule-001', name: '客户沉默超过3天', ruleType: '客户沉默',
    description: '@客户后3天未回复消息',
    condition: '{"type":"silence","thresholdDays":3,"triggerAfterMention":true}',
    alertLevel: '中', notifyRoles: ['销售', '产品经理'], notifyUsers: [],
    source: '预置', isEnabled: true, triggerCount: 5,
    lastTriggeredAt: '2026-07-27T10:00:00',
    createdAt: '2026-06-01T00:00:00', updatedAt: '2026-07-27T10:00:00',
  },
  {
    id: 'rule-002', name: '客户出现负面情绪', ruleType: '负面情绪',
    description: '检测到客户消息中包含抱怨、不满等负面情绪',
    condition: '{"type":"sentiment","keywords":["不满意","投诉","退款","太慢"],"level":"any"}',
    alertLevel: '高', notifyRoles: ['销售', '项目经理'], notifyUsers: [],
    source: '预置', isEnabled: true, triggerCount: 2,
    lastTriggeredAt: '2026-07-20T14:00:00',
    createdAt: '2026-06-01T00:00:00', updatedAt: '2026-07-20T14:00:00',
  },
  {
    id: 'rule-003', name: '群活跃度连续下降', ruleType: '活跃度下降',
    description: '群消息量连续3天下降超过50%',
    condition: '{"type":"activity_decline","consecutiveDays":3,"thresholdPercent":50}',
    alertLevel: '低', notifyRoles: ['销售'], notifyUsers: [],
    source: '预置', isEnabled: true, triggerCount: 8,
    createdAt: '2026-06-01T00:00:00', updatedAt: '2026-07-25T00:00:00',
  },
  {
    id: 'rule-004', name: '需求讨论未形成文档', ruleType: '关键信息缺失',
    description: '群内讨论了需求相关话题但未形成正式文档',
    condition: '{"type":"missing_doc","keywords":["需求","功能","要加"],"timeWindow":"1d"}',
    alertLevel: '低', notifyRoles: ['产品经理'], notifyUsers: [],
    source: 'AI学习', isEnabled: true, triggerCount: 12,
    createdAt: '2026-06-15T00:00:00', updatedAt: '2026-07-28T00:00:00',
  },
  {
    id: 'rule-005', name: '变更未走流程', ruleType: '变更未确认',
    description: '提到需求变更但未走正式变更确认流程',
    condition: '{"type":"unconfirmed_change","keywords":["改需求","加功能","变更"],"timeWindow":"2d"}',
    alertLevel: '中', notifyRoles: ['产品经理', '项目经理'], notifyUsers: [],
    source: 'AI学习', isEnabled: true, triggerCount: 6,
    createdAt: '2026-07-01T00:00:00', updatedAt: '2026-07-28T00:00:00',
  },
  {
    id: 'rule-006', name: '客户提及竞品', ruleType: '负面情绪',
    description: '客户消息中提及竞品名称，可能在比较',
    condition: '{"type":"competitor_mention","keywords":["别人家","别家公司","竞品"]}',
    alertLevel: '中', notifyRoles: ['销售'], notifyUsers: [],
    source: '人工', isEnabled: false, triggerCount: 1,
    createdAt: '2026-07-15T00:00:00', updatedAt: '2026-07-15T00:00:00',
  },
];

// ==================== 预警记录 ====================

export const mockAlertRecords: AlertRecord[] = [
  {
    id: 'alert-001', ruleId: 'rule-001', ruleName: '客户沉默超过3天', ruleType: '客户沉默', alertLevel: '中',
    groupId: 'grp-004', groupName: '【1005】教育平台APP',
    leadId: '4', leadName: '教育平台APP',
    message: '客户已3天未回复消息，最后消息时间：7月25日',
    isRead: false, isHandled: false, createdAt: '2026-07-28T10:00:00',
  },
  {
    id: 'alert-002', ruleId: 'rule-002', ruleName: '客户出现负面情绪', ruleType: '负面情绪', alertLevel: '高',
    groupId: 'grp-003', groupName: '【0910】汽车配件索赔系统',
    leadId: '3', leadName: '汽车配件索赔系统',
    message: '客户消息中出现"不太满意"等负面表达，建议关注',
    isRead: true, isHandled: true, handledBy: 'emp-008', handledAt: '2026-07-20T15:00:00',
    createdAt: '2026-07-20T14:00:00',
  },
  {
    id: 'alert-003', ruleId: 'rule-001', ruleName: '客户沉默超过3天', ruleType: '客户沉默', alertLevel: '中',
    groupId: 'grp-003', groupName: '【0910】汽车配件索赔系统',
    leadId: '3', leadName: '汽车配件索赔系统',
    message: '客户已4天未回复消息，最后消息时间：7月24日',
    isRead: true, isHandled: false, createdAt: '2026-07-28T09:00:00',
  },
  {
    id: 'alert-004', ruleId: 'rule-004', ruleName: '需求讨论未形成文档', ruleType: '关键信息缺失', alertLevel: '低',
    groupId: 'grp-001', groupName: '【0721】家具小程序开发',
    leadId: '1', leadName: '家具小程序开发',
    message: '群内讨论了搜索功能需求但未形成正式需求文档',
    isRead: false, isHandled: false, createdAt: '2026-07-29T10:30:00',
  },
  {
    id: 'alert-005', ruleId: 'rule-005', ruleName: '变更未走流程', ruleType: '变更未确认', alertLevel: '中',
    groupId: 'grp-001', groupName: '【0721】家具小程序开发',
    leadId: '1', leadName: '家具小程序开发',
    message: '客户提到新增搜索功能，但未走正式变更确认流程',
    isRead: false, isHandled: false, createdAt: '2026-07-29T10:00:00',
  },
  {
    id: 'alert-006', ruleId: 'rule-003', ruleName: '群活跃度连续下降', ruleType: '活跃度下降', alertLevel: '低',
    groupId: 'grp-004', groupName: '【1005】教育平台APP',
    leadId: '4', leadName: '教育平台APP',
    message: '该群连续4天消息量下降，当前活跃度为"沉默"',
    isRead: true, isHandled: false, createdAt: '2026-07-27T08:00:00',
  },
];
