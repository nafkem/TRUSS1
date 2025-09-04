import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { UserProvider } from "./context/userContext";
import RoleSelector from './component/RoleSelector';
import { Toaster } from "sonner";
import { ContractTester } from '../src/ContractTester';

function App() {
  return (
    <UserProvider>
      <Toaster richColors position="top-center" />
      <RouterProvider router={routes} />
      <RoleSelector />
      <ContractTester />
      {/* Remove DeveloperPanel from here */}
    </UserProvider>
  );
}

export default App;