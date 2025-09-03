import Header from "../component/common/Header";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";
import DeveloperPanel from "../component/DeveloperPanel"; // Add this import

const Layout = () => {
  return (
    <div className="w-full">
      <Header />
      <Outlet />
      <Footer />
      <DeveloperPanel /> {/* Add DeveloperPanel here */}
    </div>
  );
};

export default Layout;