import { useLocation, useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fullPath = location.pathname + location.search;
  const userType = location.pathname?.split("/")?.[1];
  const loginBase = userType === "admin" ? "/admin-login" : "/login";

  const logout = async (shouldReturn?: boolean) => {
    try {
      localStorage.removeItem("_dl_token");
      localStorage.removeItem("companyData");
      // setUserInfo({});
      navigate(shouldReturn ? loginBase + "?from=" + fullPath : loginBase);
    } catch (err) {
      console.log(err);
    }
  };

  return logout;
};

export default useLogout;
