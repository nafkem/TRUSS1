import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { UserProvider } from "./context/userContext";
import { WalletProvider } from "./context/walletContext"; // ADD THIS IMPORT
import { Toaster } from "sonner";

function App() {
  return (
    <UserProvider>
      <WalletProvider> {/* ADD THIS WRAPPER */}
        <Toaster richColors position="top-center" />
        <RouterProvider router={routes} />
      </WalletProvider > {/* ADD THIS WRAPPER */}
    </UserProvider>
      );
}

export default App;
