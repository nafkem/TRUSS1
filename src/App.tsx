import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { UserProvider } from "./context/userContext";
import RoleSelector from './component/RoleSelector';
import { Toaster } from "sonner";

function App() {
  return (
    <UserProvider>
      <Toaster richColors position="top-center" />
      <RouterProvider router={routes} />
      <RoleSelector />
      {/* Remove DeveloperPanel from here */}
    </UserProvider>
  );
}

export default App;