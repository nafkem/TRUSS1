// App.js - FIXED VERSION
import { RouterProvider } from "react-router-dom";
import routes from "./router";
import { UserProvider } from "./context/userContext";
import { CartProvider } from "./context/CartContext";
import { WalletProvider } from "./context/walletContext";
import { Toaster } from "sonner";

function App() {
  return (
    <UserProvider>
      <WalletProvider>
        <CartProvider>
          <Toaster richColors position="top-center" />
          <RouterProvider router={routes} />
        </CartProvider>
      </WalletProvider>
    </UserProvider>
  );
}

export default App;