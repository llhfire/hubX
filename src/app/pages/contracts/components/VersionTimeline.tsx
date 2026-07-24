import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import type { Contract, ContractVersion } from '../types';

interface Props {
  contract: Contract;
  selectedVersionNo: string | null;
  onSelectVersion: (versionNo: string) => void;
}

export function VersionTimeline({ contract, selectedVersionNo, onSelectVersion }: Props) {
  const navigate = useNavigate();
  const versions = contract.versionHistory;

  if (versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>版本历史</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">暂无版本记录</div>
        </CardContent>
      </Card>
    );
  }

  // 倒序展示，最近版本在最前
  const ordered = [...versions].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>版本历史（共 {versions.length} 版）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-0">
          {ordered.map((v, idx) => (
            <div key={v.versionNo} className="relative pb-6 last:pb-0">
              {/* 连接线 */}
              {idx < ordered.length - 1 && (
                <div className="absolute left-[5px] top-4 h-full w-0.5 bg-border" />
              )}
              {/* 圆点 */}
              <div className={`absolute left-0 top-1.5 size-2.5 rounded-full border-2 ${
                v.versionNo === contract.approvedVersionNo
                  ? 'bg-emerald-500 border-emerald-500'
                  : v.versionNo === selectedVersionNo
                    ? 'bg-primary border-primary'
                    : 'bg-background border-muted-foreground'
              }`} />
              {/* 内容 */}
              <div className="ml-2">
                <VersionEntry
                  version={v}
                  isApproved={v.versionNo === contract.approvedVersionNo}
                  isSelected={v.versionNo === selectedVersionNo}
                  onSelect={() => onSelectVersion(v.versionNo)}
                  onCopy={() => navigate(`/contracts/${contract.id}/edit`)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function VersionEntry({
  version,
  isApproved,
  isSelected,
  onSelect,
  onCopy,
}: {
  version: ContractVersion;
  isApproved: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onCopy: () => void;
}) {
  return (
    <div
      className={`p-2 rounded ${
        isSelected ? 'bg-muted' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">{version.versionNo}</span>
        {isApproved && <Badge variant="default" className="bg-emerald-500 text-white">已审批</Badge>}
        {isSelected && <Badge variant="default">当前查看</Badge>}
      </div>
      <div className="text-[13px] text-muted-foreground mt-1">
        {version.label}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">
        {version.createdAt} &middot; {version.createdBy}
      </div>
      <div className="mt-1.5 flex gap-2">
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onSelect} disabled={isSelected}>
          查看此版本
        </Button>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={onCopy}>
          基于此版本编辑
        </Button>
      </div>
    </div>
  );
}
