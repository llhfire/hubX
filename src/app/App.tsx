import { RouterProvider } from 'react-router';
import { ReminderProvider } from './reminders/ReminderContext';
import { ContractsProvider } from './pages/contracts/ContractsContext';
import { router } from './routes';

function App() {
  return (
    <ReminderProvider>
      <ContractsProvider>
        <RouterProvider router={router} />
      </ContractsProvider>
    </ReminderProvider>
  );
}

export default App;
