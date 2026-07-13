import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

import EmployeeTable from './pages/EmployeeTable';
import EmployeeDetails from './pages/EmployeeDetails';

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
