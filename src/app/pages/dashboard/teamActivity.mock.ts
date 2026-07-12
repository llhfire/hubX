// 工作台右下角团队动态 Feed 占位数据。
//
// 4 条时间轴文本——对应参考图右下角：
//   08:39 张三 成功签约 S级客户 某大厂
//   08:09 李四 今日出差上海，正在拜访 A级客户 某科技公司
//   06:54 王五 重点客户 某集团 已进入【促成阶段】
//   03:54 赵六 已完成本周业绩 120%
//
// 这条实体是 HubX 全新占位概念，仅工作台可视化，未接入全系统行为埋点。
// TODO（CONTEXT 第四阶段「AI 驱动」子集）：未来需补一个团队事件流系统。

import type { TeamActivity } from './types';

export const teamActivityFeed: TeamActivity[] = [
  {
    id: 'feed-1',
    time: '08:39',
    actor: '张三',
    action: '成功签约 S 级客户 — 某大厂',
  },
  {
    id: 'feed-2',
    time: '08:09',
    actor: '李四',
    action: '今日出差上海，正在拜访 A 级客户 某科技公司',
  },
  {
    id: 'feed-3',
    time: '06:54',
    actor: '王五',
    action: '重点客户 某集团 已进入【促成阶段】',
  },
  {
    id: 'feed-4',
    time: '03:54',
    actor: '赵六',
    action: '已完成本周业绩 120%',
  },
];
