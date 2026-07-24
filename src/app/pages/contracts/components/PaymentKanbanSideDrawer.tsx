import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../../components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { ScrollArea } from '../../../components/ui/scroll-area';
import type { Contract } from '../types';
import { PaymentTimeline } from './PaymentTimeline';
import { ContractTextViewer } from './ContractTextViewer';
import { BlockerDunningPanel } from './BlockerDunningPanel';

interface Props {
  visible: boolean;
  contract: Contract | null;
  onClose: () => void;
}

export function PaymentKanbanSideDrawer({ visible, contract, onClose }: Props) {
  const [activeTab, setActiveTab] = useState('timeline');

  if (!contract) return null;

  return (
    <Sheet open={visible} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent className="w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>{contract.contractNo} &middot; {contract.current.customerName}</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4 flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList>
              <TabsTrigger value="timeline">回款时间线</TabsTrigger>
              <TabsTrigger value="contract">合同文本</TabsTrigger>
              <TabsTrigger value="blockers">卡点 / 催款</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="flex-1 overflow-auto mt-2">
              <ScrollArea className="h-[calc(100vh-180px)]">
                <PaymentTimeline contract={contract} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="contract" className="flex-1 overflow-auto mt-2">
              <ContractTextViewer contract={contract} />
            </TabsContent>
            <TabsContent value="blockers" className="flex-1 overflow-auto mt-2">
              <BlockerDunningPanel contract={contract} />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
