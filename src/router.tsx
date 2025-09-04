import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import Homepage from "./page/home/Homepage";
import Product from "./page/product"; // index.tsx
import Listing from "./page/listing";
import AddProduct from "./page/listing/new";
import Order from "./page/order";
import Cart from "./page/cart";
import Register from "./page/register/Register";
import VerifySeller from "./page/register/VerifySeller";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/product/:productId", element: <Product /> },
      { path: "/listing", element: <Listing /> },
      { path: "/add-listing", element: <AddProduct /> },
      { path: "/order", element: <Order /> },
      { path: "/cart", element: <Cart /> },
      { path: "/register", element: <Register /> },
      { path: "/verify-seller", element: <VerifySeller /> },
    ],
  },
]);

export default routes;
