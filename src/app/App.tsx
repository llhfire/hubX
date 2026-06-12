import { RouterProvider } from 'react-router';
import { ReminderProvider } from './reminders/ReminderContext';
import { router } from './routes';

function App() {
  return (
    <ReminderProvider>
      <RouterProvider router={router} />
    </ReminderProvider>
  );
}

export default App;
