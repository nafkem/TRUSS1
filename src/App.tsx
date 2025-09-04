import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { UserProvider } from "./context/userContext";
import { Toaster } from "sonner";

function App() {
  return (
    <UserProvider>
      <Toaster richColors position="top-center" />
      <RouterProvider router={routes} />
    </UserProvider>
  );
}

export default App;
