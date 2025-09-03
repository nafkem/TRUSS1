// export default Header;

// ==== version 2 ====
import { useState } from "react";
import { BiCart, BiUser, BiChevronDown, BiMenu } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { headerNav, truncateAddress } from "./data";
import { useUser } from "../../context/userContext";
import { toast } from "sonner";
import { CgSpinner } from "react-icons/cg";

const Header = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const disconnectWallet = () => {
    setWalletConnected(false);
    setUser(null);
    setDropdownOpen(false);
  };
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const connectWallet = async () => {
    setLoading(true);
    try {
      if (!window?.ethereum) {
        toast.info("Please install MetaMask!");
        setLoading(false);
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const walletAddress = accounts[0];
      setUser(String(walletAddress));
      setWalletConnected(true);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect wallet");
      setLoading(false);
    }
  };

  return (
    <header className="w-full border-b-2 bg-white z-50 sticky top-0 left-0">
      <div className="py-4 px-6 md:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-3xl md:text-4xl">
          Truss
        </Link>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <BiMenu className="w-7 h-7" />
          </button>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* SELL BUTTON - Added here */}
          <Link
            to="/sell"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
          >
            Sell Product
          </Link>

          {user ? (
            <>
              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="relative flex items-center cursor-pointer"
              >
                <BiCart className="w-6 h-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  0
                </span>
              </button>

              {/* User + Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex bg-neutral-200 text-neutral-700 rounded-full px-4 py-2 items-center gap-2"
                >
                  <BiUser className="w-5 h-5" />
                  <span className="text-sm">{truncateAddress(user)}</span>
                  <BiChevronDown
                    className={`w-4 h-4 transform transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                    {headerNav?.map((eachNav: any, index: number) => (
                      <Link
                        key={index}
                        to={eachNav?.link}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {eachNav?.title}
                      </Link>
                    ))}
                    <button
                      onClick={disconnectWallet}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={connectWallet}
              disabled={loading}
              className={`p-2 px-4 bg-primary text-white rounded-sm flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin w-5 h-5" />
                  <span>Connecting...</span>
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4">
          {/* SELL BUTTON - Mobile */}
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-center hover:bg-green-700 transition-colors duration-200 font-medium"
          >
            Sell Product
          </Link>

          {walletConnected ? (
            <>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => navigate("/cart")}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <BiCart className="w-5 h-5" />
                  <span className="text-sm">Cart (0)</span>
                </button>
              </div>

              {headerNav.map((eachNav: any, index: number) => (
                <Link
                  key={index}
                  to={eachNav.link}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm text-neutral-700 hover:underline"
                >
                  {eachNav.title}
                </Link>
              ))}

              <button
                onClick={disconnectWallet}
                className="text-sm text-red-600 mt-2"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                connectWallet();
                setMobileMenuOpen(false);
              }}
              disabled={loading}
              className={`p-2 bg-primary text-white rounded-sm flex items-center gap-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <CgSpinner className="animate-spin w-5 h-5" />
                  <span>Connecting...</span>
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;