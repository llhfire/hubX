import { Alert, AlertDescription } from '../../../components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface Props {
  contractAmount: number;
  quoteAmount: number;
  quoteName?: string;
}

export function QuoteMismatchAlert({ contractAmount, quoteAmount, quoteName }: Props) {
  if (!quoteAmount || Math.abs(contractAmount - quoteAmount) < 0.01) return null;
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="size-4" />
      <AlertDescription>
        <span>
          当前合同金额 <strong>&yen;{contractAmount.toLocaleString()}</strong> 与关联报价单
          {quoteName ? `「${quoteName}」` : ''} 金额 <strong>&yen;{quoteAmount.toLocaleString()}</strong> 不一致，请确认是否谈判调整。
        </span>
      </AlertDescription>
    </Alert>
  );
}
