// page/register/VerifySeller.tsx - FIXED
import { useEffect, useState } from "react";
import { userService } from "../../contracts/user/userService";
import { useWallet } from "../../context/walletContext";
import { toast } from "sonner";

export default function VerifySeller() {
  const { account } = useWallet();
  const [pendingSellers, setPendingSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualAddress, setManualAddress] = useState("");

  // Fetch sellers (reusable function)
  const fetchSellers = async () => {
    try {
      const sellers = await userService.getPendingSellers();
      setPendingSellers(sellers);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Verify seller
  const handleVerify = async (sellerAddress: string) => {
    if (!account) {
      toast.error("❌ Connect your admin wallet first!");
      return;
    }

    try {
      setLoading(true);
      const tx  = await userService.verifySeller(sellerAddress);
      await tx.wait();

      toast.success("✅ Seller verified! They can now proceed to list products.");

      // Refresh seller list
      setPendingSellers((prev) =>
        prev.filter((s) => s.wallet !== sellerAddress)
      );
    } catch (err: any) {
      console.error("Error verifying seller:", err);
      toast.error(`❌ Verification failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Manual verification
  const handleManualVerify = async () => {
    if (!manualAddress) {
      toast.error("⚠️ Enter a wallet address first!");
      return;
    }
    await handleVerify(manualAddress);
    setManualAddress("");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
        Seller Verification Dashboard
      </h2>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ Only the admin wallet can verify sellers. Make sure you are
          connected with the correct wallet.
        </p>
      </div>

      {/* Manual verify */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Manual Verification</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter seller wallet address"
            value={manualAddress}
            onChange={(e) => setManualAddress(e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={handleManualVerify}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 disabled:bg-orange-300"
          >
            Verify
          </button>
        </div>
      </div>

      {/* Pending sellers */}
      <h3 className="text-lg font-semibold mb-3">Pending Sellers</h3>
      {pendingSellers.length === 0 ? (
        <p className="text-sm text-gray-500">No sellers pending verification.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">Name</th>
              <th className="border border-gray-200 p-2 text-left">Wallet</th>
              <th className="border border-gray-200 p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingSellers.map((seller) => (
              <tr key={seller.wallet}>
                <td className="border border-gray-200 p-2">
                  {seller.firstName} {seller.lastName}
                </td>
                <td className="border border-gray-200 p-2 font-mono">
                  {seller.wallet.slice(0, 6)}...{seller.wallet.slice(-4)}
                </td>
                <td className="border border-gray-200 p-2 text-center">
                  <button
                    onClick={() => handleVerify(seller.wallet)}
                    disabled={loading}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:bg-green-300"
                  >
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
