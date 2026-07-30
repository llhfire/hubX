// 活跃度指示器组件
import { ActivityLevel, activityLevelConfig } from '../types';

interface ActivityIndicatorProps {
  level: ActivityLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export function ActivityIndicator({ level, showLabel = true, size = 'md' }: ActivityIndicatorProps) {
  const config = activityLevelConfig[level];
  const barHeight = size === 'sm' ? 'h-1.5' : 'h-2';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 ${barHeight} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${barHeight} rounded-full transition-all duration-500`}
          style={{
            width: `${config.percentage}%`,
            backgroundColor: `var(--${config.color}-500, #6b7280)`,
          }}
        />
      </div>
      {showLabel && (
        <span className={`${textSize} font-medium`} style={{ color: `var(--${config.color}-600, #374151)` }}>
          {config.label}
        </span>
      )}
    </div>
  );
}
