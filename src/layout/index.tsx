import Header from "../component/common/Header";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";


const Layout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;