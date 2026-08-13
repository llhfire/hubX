import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ReminderProvider } from './reminders/ReminderContext';
import { ContractsProvider } from './pages/contracts/ContractsContext';
import { EmployeeProvider } from './pages/employee';
import { WeChatProvider } from './pages/wechat-bot';
import { ChatProvider } from './pages/chat';
import { JobWorkConfigProvider } from './pages/daily-report/JobWorkConfigContext';
import { FeedbackProvider } from './feedback/FeedbackContext';
import { IntegrationProvider } from './integrations/IntegrationContext';
import { ApprovalProvider } from './approvals/ApprovalContext';
import { TodoProvider } from './todos/TodoContext';
import { ProjectInvoiceProvider } from './pages/finance/ProjectInvoiceContext';
import { router } from './routes';

function App() {
  return (
    <IntegrationProvider>
      <ApprovalProvider>
        <TodoProvider>
          <FeedbackProvider>
            <ReminderProvider>
              <EmployeeProvider>
                <JobWorkConfigProvider>
                  <ContractsProvider>
                    <WeChatProvider>
                      <ChatProvider>
                        <ProjectInvoiceProvider>
                          <RouterProvider router={router} />
                          <Toaster position="top-right" richColors />
                        </ProjectInvoiceProvider>
                      </ChatProvider>
                    </WeChatProvider>
                  </ContractsProvider>
                </JobWorkConfigProvider>
              </EmployeeProvider>
            </ReminderProvider>
          </FeedbackProvider>
        </TodoProvider>
      </ApprovalProvider>
    </IntegrationProvider>
  );
}

export default App;
