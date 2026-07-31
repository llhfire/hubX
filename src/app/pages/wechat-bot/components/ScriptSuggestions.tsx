// ========================================
// 话术建议组件
// 根据聊天上下文动态生成产品经理话术
// ========================================

import { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { toast } from 'sonner';
import { Copy, RefreshCw, MessageSquare, Lightbulb, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ChatMessage, GroupMember } from '../types';

interface ScriptSuggestionsProps {
  messages: ChatMessage[];
  members: GroupMember[];
}

interface ScriptItem {
  id: string;
  category: '需求理解' | '问题解释' | '项目进度' | '风险提醒' | '确认回复';
  title: string;
  content: string;
  confidence: number;
}

// 生成话术的关键词匹配规则
const scriptRules = [
  // 需求理解类
  {
    keywords: ['需求', '功能', '要做', '实现', '支持', '能不能'],
    category: '需求理解' as const,
    icon: Lightbulb,
    templates: [
      '收到，关于"{keyword}"的需求，我理解您的意思是{context}，对吗？',
      '明白，这个功能我们评估下来{context}，我会整理成需求文档确认。',
      '好的，"{keyword}"这个需求我记录下来了，稍后会输出详细的产品方案供您确认。',
    ],
  },
  // 问题解释类
  {
    keywords: ['bug', '问题', '报错', '异常', '不行', '不能', '失败'],
    category: '问题解释' as const,
    icon: AlertCircle,
    templates: [
      '这个问题我排查了一下，{context}，预计{timeframe}内修复。',
      '收到反馈，这个问题原因是{context}，已经安排处理了。',
      '明白，这个bug我记录下来了，会优先处理，预计{timeframe}修复完成。',
    ],
  },
  // 项目进度类
  {
    keywords: ['进度', '什么时候', '完成', '交付', '上线', '测试'],
    category: '项目进度' as const,
    icon: Clock,
    templates: [
      '目前项目进度{context}，预计{timeframe}可以交付。',
      '这个模块已经{context}，正在进行{nextStep}。',
      '整体进度正常，{context}，如果有变化会及时同步。',
    ],
  },
  // 确认回复类
  {
    keywords: ['好的', '收到', '了解', '明白', '可以', '没问题'],
    category: '确认回复' as const,
    icon: CheckCircle,
    templates: [
      '好的，已确认，{context}。',
      '收到，我这边同步处理，有进展及时反馈。',
      '明白，这个我记下了，{context}。',
    ],
  },
  // 风险提醒类
  {
    keywords: ['延期', '来不及', '做不完', '人不够', '风险', '困难'],
    category: '风险提醒' as const,
    icon: AlertCircle,
    templates: [
      '这边有个情况同步一下：{context}，可能会影响{impact}，建议{ suggestion}。',
      '目前遇到一个问题：{context}，需要{resource}支持，否则可能{risk}。',
      '风险提醒：{context}，建议{ suggestion}，请知悉。',
    ],
  },
];

// 生成模拟话术（实际项目中应调用 AI API）
function generateScripts(messages: ChatMessage[], members: GroupMember[]): ScriptItem[] {
  const scripts: ScriptItem[] = [];
  const recentMessages = messages.slice(-20); // 取最近20条消息

  // 分析最近的消息内容
  const allContent = recentMessages.map(m => m.content).join(' ');
  const memberNames = members.map(m => m.wechatNickname);

  // 需求理解类话术
  if (allContent.includes('需求') || allContent.includes('功能') || allContent.includes('要做')) {
    scripts.push({
      id: 'req-1',
      category: '需求理解',
      title: '需求确认',
      content: `收到您的需求，我整理一下确认：${recentMessages.find(m => m.content.includes('需求') || m.content.includes('功能'))?.content.slice(0, 30)}... 我理解的要点是以上内容，如有遗漏请补充。`,
      confidence: 85,
    });
  }

  // 问题解释类话术
  if (allContent.includes('bug') || allContent.includes('问题') || allContent.includes('报错')) {
    scripts.push({
      id: 'bug-1',
      category: '问题解释',
      title: '问题反馈',
      content: '收到反馈，这个问题我排查了一下，初步判断是前端兼容性问题，预计今天内修复。修复后会第一时间通知您验证。',
      confidence: 80,
    });
  }

  // 项目进度类话术
  scripts.push({
    id: 'progress-1',
    category: '项目进度',
    title: '进度同步',
    content: '目前项目整体进度正常，已完成核心功能开发，正在进行联调测试。预计下周可以提交验收，请知悉。',
    confidence: 90,
  });

  // 确认回复类话术
  scripts.push({
    id: 'confirm-1',
    category: '确认回复',
    title: '标准回复',
    content: '好的，已收到，我这边同步处理。有进展会及时反馈给您。',
    confidence: 95,
  });

  // 风险提醒类话术（条件触发）
  if (allContent.includes('延期') || allContent.includes('来不及') || allContent.includes('做不完')) {
    scripts.push({
      id: 'risk-1',
      category: '风险提醒',
      title: '风险同步',
      content: '这边有个风险同步：由于需求变更较多，当前进度可能会影响原定交付时间。建议我们拉个短会确认优先级，确保核心功能按时上线。',
      confidence: 75,
    });
  }

  // 如果没有匹配到任何规则，显示通用话术
  if (scripts.length === 0) {
    scripts.push(
      {
        id: 'default-1',
        category: '确认回复',
        title: '收到确认',
        content: '好的，已收到您的消息，我这边记录一下，稍后回复您。',
        confidence: 95,
      },
      {
        id: 'default-2',
        category: '需求理解',
        title: '需求确认',
        content: '收到，关于这个需求我确认一下：具体是指哪些方面？我整理好方案后发您确认。',
        confidence: 85,
      },
      {
        id: 'default-3',
        category: '项目进度',
        title: '进度同步',
        content: '目前项目按计划推进中，如有新进展会及时同步，请放心。',
        confidence: 90,
      }
    );
  }

  return scripts;
}

// 分类颜色映射
const categoryColors: Record<string, string> = {
  '需求理解': 'bg-blue-100 text-blue-700',
  '问题解释': 'bg-orange-100 text-orange-700',
  '项目进度': 'bg-green-100 text-green-700',
  '确认回复': 'bg-gray-100 text-gray-700',
  '风险提醒': 'bg-red-100 text-red-700',
};

// 分类图标映射
const categoryIcons: Record<string, typeof MessageSquare> = {
  '需求理解': Lightbulb,
  '问题解释': AlertCircle,
  '项目进度': Clock,
  '确认回复': CheckCircle,
  '风险提醒': AlertCircle,
};

export function ScriptSuggestions({ messages, members }: ScriptSuggestionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 生成话术列表
  const scripts = useMemo(() => generateScripts(messages, members), [messages, members]);

  // 复制话术
  const handleCopy = (script: ScriptItem) => {
    navigator.clipboard.writeText(script.content);
    setCopiedId(script.id);
    toast.success('话术已复制到剪贴板');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 刷新话术（重新生成）
  const handleRefresh = () => {
    toast.success('话术已刷新');
  };

  return (
    <div className="space-y-4">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">智能话术</h3>
          <p className="text-xs text-gray-500 mt-0.5">基于聊天上下文动态生成</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          className="h-7 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          刷新
        </Button>
      </div>

      {/* 话术分类标签 */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(categoryColors).map(category => (
          <Badge
            key={category}
            variant="secondary"
            className={`text-[10px] ${categoryColors[category]}`}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* 话术列表 */}
      <div className="space-y-3">
        {scripts.map(script => {
          const Icon = categoryIcons[script.category] || MessageSquare;
          return (
            <div
              key={script.id}
              className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
            >
              {/* 标题栏 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${categoryColors[script.category]}`}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {script.category}
                  </Badge>
                  <span className="text-xs font-medium text-gray-700">{script.title}</span>
                </div>
                <span className="text-[10px] text-gray-400">
                  置信度: {script.confidence}%
                </span>
              </div>

              {/* 内容 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {script.content}
              </p>

              {/* 操作按钮 */}
              <div className="flex items-center gap-2">
                <Button
                  variant={copiedId === script.id ? 'default' : 'outline'}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => handleCopy(script)}
                >
                  {copiedId === script.id ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      一键复制
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-xs text-blue-700">
            <p className="font-medium mb-1">话术生成说明</p>
            <p className="text-blue-600">
              话术基于最近的聊天上下文动态生成，涵盖需求理解、问题解释、项目进度等场景。
              点击"一键复制"即可粘贴使用，建议根据实际情况微调后发送。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
