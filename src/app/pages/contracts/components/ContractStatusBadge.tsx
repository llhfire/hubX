import { Badge } from '../../../components/ui/badge';
import { CONTRACT_STATUS_LABEL } from '../utils';
import type { ContractStatus } from '../types';

const STATUS_VARIANT: Record<ContractStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  draft: 'secondary',
  approving: 'default',
  pending_mail: 'default',
  pending_return: 'default',
  archived: 'default',
  voided: 'destructive',
};

interface Props {
  status: ContractStatus;
  size?: 'small' | 'default' | 'medium' | 'large';
}

export function ContractStatusBadge({ status, size = 'default' }: Props) {
  const sizeClass = size === 'small' ? 'text-[10px] px-1.5 py-0' : undefined;
  return (
    <Badge variant={STATUS_VARIANT[status]} className={sizeClass}>
      {CONTRACT_STATUS_LABEL[status]}
    </Badge>
  );
}
