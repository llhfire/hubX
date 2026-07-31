import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ReminderProvider } from './reminders/ReminderContext';
import { ContractsProvider } from './pages/contracts/ContractsContext';
import { EmployeeProvider } from './pages/employee';
import { WeChatProvider } from './pages/wechat-bot';
import { ChatProvider } from './pages/chat';
import { router } from './routes';

function App() {
  return (
    <ReminderProvider>
      <EmployeeProvider>
        <ContractsProvider>
          <WeChatProvider>
            <ChatProvider>
              <RouterProvider router={router} />
              <Toaster position="top-right" richColors />
            </ChatProvider>
          </WeChatProvider>
        </ContractsProvider>
      </EmployeeProvider>
    </ReminderProvider>
  );
}

export default App;
