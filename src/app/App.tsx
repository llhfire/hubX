import { RouterProvider } from 'react-router';
import { ReminderProvider } from './reminders/ReminderContext';
import { ContractsProvider } from './pages/contracts/ContractsContext';
import { EmployeeProvider } from './pages/employee';
import { router } from './routes';

function App() {
  return (
    <ReminderProvider>
      <EmployeeProvider>
        <ContractsProvider>
          <RouterProvider router={router} />
        </ContractsProvider>
      </EmployeeProvider>
    </ReminderProvider>
  );
}

export default App;
