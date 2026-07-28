import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { AlertTriangle, CheckCircle2, XCircle, Shield } from 'lucide-react';

interface TravelRuleEngineProps {
  departureCity: string;
  destinationCity: string;
  department: string;
  travelDays: number;
  companions: { name: string; gender: 'male' | 'female' }[];
  transportType: 'high_speed_rail' | 'bullet_train' | 'airplane' | 'self_drive' | 'bus' | 'other';
  hasApprovalScreenshot: boolean;
}

type RuleLevel = 'error' | 'warning' | 'info';

interface RuleResult {
  id: string;
  level: RuleLevel;
  ruleName: string;
  message: string;
  suggestion?: string;
}

const CITY_TIERS: Record<string, 'first' | 'new_first' | 'second' | 'third'> = {
  '北京': 'first',
  '上海': 'first',
  '广州': 'first',
  '深圳': 'first',
  '成都': 'new_first',
  '杭州': 'new_first',
  '重庆': 'new_first',
  '武汉': 'new_first',
  '苏州': 'new_first',
  '西安': 'new_first',
  '南京': 'new_first',
  '天津': 'new_first',
  '长沙': 'new_first',
  '郑州': 'new_first',
  '东莞': 'new_first',
  '青岛': 'new_first',
  '昆明': 'new_first',
  '宁波': 'new_first',
  '合肥': 'new_first',
  '大连': 'new_first',
  '福州': 'new_first',
  '厦门': 'new_first',
  '哈尔滨': 'new_first',
  '济南': 'new_first',
  '佛山': 'new_first',
  '沈阳': 'new_first',
  '无锡': 'new_first',
  '贵阳': 'second',
  '南宁': 'second',
  '太原': 'second',
  '石家庄': 'second',
  '南昌': 'second',
  '兰州': 'second',
  '珠海': 'second',
  '惠州': 'second',
  '常州': 'second',
  '温州': 'second',
  '烟台': 'second',
  '海口': 'second',
};

function getCityTier(city: string): 'first' | 'new_first' | 'second' | 'third' {
  return CITY_TIERS[city] || 'third';
}

function getHotelLimit(city: string): number {
  const tier = getCityTier(city);
  switch (tier) {
    case 'first':
    case 'new_first':
      return 220;
    case 'second':
      return 180;
    case 'third':
      return 150;
  }
}

function getLocalTransportLimit(city: string): number {
  const tier = getCityTier(city);
  switch (tier) {
    case 'first':
    case 'new_first':
      return 50;
    case 'second':
      return 40;
    case 'third':
      return 30;
  }
}

function getCityTierLabel(tier: string): string {
  switch (tier) {
    case 'first': return '一线';
    case 'new_first': return '新一线';
    case 'second': return '二线';
    case 'third': return '三线及以下';
    default: return '未知';
  }
}

export function TravelRuleEngine({
  departureCity,
  destinationCity,
  department,
  travelDays,
  companions,
  transportType,
  hasApprovalScreenshot,
}: TravelRuleEngineProps) {
  const results = useMemo<RuleResult[]>(() => {
    const rules: RuleResult[] = [];
    const isSales = department.includes('销售');
    const isSoftware = department.includes('软件');
    const isFunctional = department.includes('职能') || department.includes('人事') || department.includes('财务') || department.includes('行政');
    const cityTier = getCityTier(destinationCity);
    const hotelLimit = getHotelLimit(destinationCity);
    const localLimit = getLocalTransportLimit(destinationCity);

    rules.push({
      id: 'accommodation-standard',
      level: 'info',
      ruleName: '住宿标准',
      message: `${getCityTierLabel(cityTier)}城市（${destinationCity}）住宿上限为 ${hotelLimit} 元/天`,
      suggestion: `请选择不超过 ${hotelLimit} 元/晚的酒店`,
    });

    if (companions.length > 0) {
      const genders = companions.map(c => c.gender);
      const hasMale = genders.includes('male');
      const hasFemale = genders.includes('female');
      if (hasMale && hasFemale) {
        rules.push({
          id: 'accommodation-mixed',
          level: 'info',
          ruleName: '合住校验',
          message: '同行人员包含异性，无需强制合住',
        });
      } else {
        rules.push({
          id: 'accommodation-same-gender',
          level: 'warning',
          ruleName: '合住校验',
          message: `同行 ${companions.length} 人为同性别，须安排合住`,
          suggestion: '同性别同事必须合住，未合住不予报销',
        });
      }
    }

    if (isSales && travelDays >= 7) {
      rules.push({
        id: 'long-trip-discount',
        level: 'warning',
        ruleName: '长差折扣',
        message: `销售出差 ${travelDays} 天（>=7天），住宿标准下调 10%`,
        suggestion: `实际住宿上限调整为 ${Math.floor(hotelLimit * 0.9)} 元/天`,
      });
    }

    if (travelDays > 7) {
      rules.push({
        id: 'long-stay-gm',
        level: 'error',
        ruleName: '长期驻场',
        message: `出差 ${travelDays} 天（>7天），须总经理安排住宿`,
        suggestion: '请提前联系总经理办公室安排驻场住宿事宜',
      });
    }

    if (isFunctional) {
      if (transportType === 'airplane') {
        rules.push({
          id: 'transport-functional-plane',
          level: 'warning',
          ruleName: '交通限制',
          message: '职能部门乘坐飞机，仅限经济舱',
          suggestion: '请选择经济舱，商务舱/头等舱不予报销',
        });
      }
      if (transportType === 'high_speed_rail') {
        rules.push({
          id: 'transport-functional-train',
          level: 'warning',
          ruleName: '交通限制',
          message: '职能部门乘坐高铁，仅限二等座',
          suggestion: '请选择二等座，一等座/商务座不予报销',
        });
      }
    }

    if (isSales && (transportType === 'high_speed_rail' || transportType === 'airplane')) {
      if (!hasApprovalScreenshot) {
        rules.push({
          id: 'approval-screenshot',
          level: 'error',
          ruleName: '报备要求',
          message: '销售出差乘坐高铁/飞机，须上传报备截图',
          suggestion: '请在报销前上传主管报备审批截图',
        });
      } else {
        rules.push({
          id: 'approval-screenshot-ok',
          level: 'info',
          ruleName: '报备要求',
          message: '已上传报备截图，符合要求',
        });
      }
    }

    rules.push({
      id: 'local-transport',
      level: 'info',
      ruleName: '市内交通',
      message: `${getCityTierLabel(cityTier)}城市（${destinationCity}）市内交通上限 ${localLimit} 元/天`,
      suggestion: `出差 ${travelDays} 天，市内交通总额上限 ${localLimit * travelDays} 元`,
    });

    rules.push({
      id: 'meal-allowance',
      level: 'info',
      ruleName: '餐补标准',
      message: '餐补标准为 40 元/天',
      suggestion: `出差 ${travelDays} 天，路途当日无补贴，预计餐补 ${(travelDays - 1) * 40} 元`,
    });

    if (isSoftware) {
      rules.push({
        id: 'software-return',
        level: 'error',
        ruleName: '软件事业部',
        message: '软件事业部驻场未结束，禁止私自返程',
        suggestion: '如需提前返程，须获得项目经理书面同意',
      });
    }

    return rules;
  }, [departureCity, destinationCity, department, travelDays, companions, transportType, hasApprovalScreenshot]);

  const errorCount = results.filter(r => r.level === 'error').length;
  const warningCount = results.filter(r => r.level === 'warning').length;
  const passCount = results.filter(r => r.level === 'info').length;

  const levelIcon = (level: RuleLevel) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
  };

  const levelBadge = (level: RuleLevel) => {
    switch (level) {
      case 'error':
        return <Badge variant="destructive">阻断</Badge>;
      case 'warning':
        return <Badge className="bg-amber-500 hover:bg-amber-600">警告</Badge>;
      case 'info':
        return <Badge variant="secondary">通过</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>AI 规则引擎校验</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {errorCount > 0 && (
              <Badge variant="destructive">{errorCount} 项阻断</Badge>
            )}
            {warningCount > 0 && (
              <Badge className="bg-amber-500 hover:bg-amber-600">{warningCount} 项警告</Badge>
            )}
            <Badge variant="secondary">{passCount} 项通过</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className={`flex items-start gap-3 rounded-lg border p-3 ${
                result.level === 'error'
                  ? 'border-red-200 bg-red-50'
                  : result.level === 'warning'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-green-200 bg-green-50'
              }`}
            >
              <div className="mt-0.5">{levelIcon(result.level)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{result.ruleName}</span>
                  {levelBadge(result.level)}
                </div>
                <p className="text-sm text-gray-700">{result.message}</p>
                {result.suggestion && (
                  <p className="text-xs text-gray-500 mt-1">{result.suggestion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
