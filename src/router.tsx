import { createBrowserRouter } from "react-router-dom";
import Layout from "./layout";
import Homepage from "./page/home/Homepage";
import Product from "./page/product"; // This imports from index.tsx
import Listing from "./page/listing";
import AddProduct from "./page/listing/new";
import Order from "./page/order";
import Cart from "./page/cart";
import SellProductPage from "./page/product/SellProductPage"; // Correct import path

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Homepage /> },
      { path: "/product/:productId", element: <Product /> },
      { path: "/listing", element: <Listing /> },
      { path: "/add-listing", element: <AddProduct /> },
      { path: "/sell", element: <SellProductPage /> }, // This should work now
      { path: "/order", element: <Order /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
]);

export default routes;