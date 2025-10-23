import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import Homepage from "./page/home/Homepage";
import Product from "./page/product/ViewProduct";   // ✅ single product view
import ProductList from "./page/product/ProductList"; // ✅ all products
import AddProduct from "./page/product/addProduct";
//import Order from "./page/order";
import Cart from "./page/cart";
import CheckoutPage from "./page/checkout";
import OrderConfirmation from './page/checkout/OrderConfirmation';
import Register from "./page/register/Register";
import DebugViewProduct from "./page/product/DebugViewProduct";
import VerifySeller from "./page/register/VerifySeller";
import { WalletProvider } from "./context/walletContext";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ---------------- Buyer Flow ----------------
      { path: "/", element: <Homepage /> },
      { path: "/products", element: <ProductList /> }, // all products
      { path: "/product/:id", element: <Product /> },  // single product view
      { path: "/debug-view", element: <DebugViewProduct /> },
      { path: "/cart", element: <Cart /> },
      {path: "/checkout", element: <CheckoutPage /> },
      {path: "/order-confirmation", element: <OrderConfirmation /> },
      //{ path: "/order", element: <Order /> },

      // ---------------- Seller Flow ----------------
      {
        path: "/register",
        element: (
          <WalletProvider>
            <Register />
          </WalletProvider>
        ),
      },
      { path: "/verify-seller", element: <VerifySeller /> },
      //{ path: "/listing", element: <Listing /> },        // seller's dashboard
      { path: "/addProduct", element: <AddProduct /> },  // add new product
    ],
  },
]);

export default routes;
