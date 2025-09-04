import { useEffect, useState } from "react";
import { userService } from "../../contracts/user/userService";
import { getCurrentAddress } from "../../shared/providers";

// User interface
interface User {
  userId: number;
  firstName: string;
  lastName: string;
  account: string;
  role: "seller" | "buyer";
  verificationStatus: boolean;
}

export default function VerifySeller() {
  const [sellers, setSellers] = useState<User[]>([]);
  const [wallet, setWallet] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string | null>(null);

  // Get connected wallet
  useEffect(() => {
    (async () => {
      try {
        const addr = await getCurrentAddress();
        setWallet(addr);
      } catch {
        setWallet(null);
      }
    })();
  }, []);

  // Fetch pending sellers
  const fetchSellers = async () => {
    setBusy(true);
    setLog(null);
    try {
      const allUsers = await userService.getUsersSafely();
      const pendingSellers = allUsers.filter(
        (u: User) => u.role === "seller" && !u.verificationStatus
      );
      setSellers(pendingSellers);
    } catch (e: any) {
      setLog(`❌ Failed to fetch sellers: ${e.message ?? String(e)}`);
      setSellers([]);
    } finally {
      setBusy(false); // make sure this always runs
    }
  };

  // Approve or reject a seller (single declaration)
  const verifySeller = async (account: string, approve: boolean) => {
    setBusy(true);
    setLog(null);
    try {
      if (approve) {
        const tx = await userService.verifySeller(account);
        setLog(`✅ Seller approved — tx: ${tx.tx.hash}\nYou have been successfully verified!`);
      } else {
        setLog(`❌ Seller rejected (no on-chain tx)`);
      }
      await fetchSellers();
    } catch (e: any) {
      setLog(`❌ ${e.message ?? String(e)}`);
    } finally {
      setBusy(false);
    }
  };

  // Fetch sellers on wallet connect
  useEffect(() => {
    if (wallet) fetchSellers();
  }, [wallet]);

  if (!wallet) {
    return <div className="p-6 text-red-500">Connect wallet to continue</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-2 text-orange-600">Seller Verification</h2>

      {/* Show connected wallet */}
      <p className="text-sm text-gray-600 mb-4">
        Connected wallet: <span className="break-all">{wallet}</span>
      </p>

      {log && <div className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{log}</div>}

      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          {sellers.length} pending seller{sellers.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={fetchSellers}
          disabled={busy}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {sellers.length === 0 ? (
        <div className="text-gray-500 p-4 text-center border rounded">
          No sellers pending verification
        </div>
      ) : (
        <table className="min-w-full bg-gray-50 border rounded">
          <thead className="bg-orange-100">
            <tr>
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Wallet</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.userId} className="text-center">
                <td className="py-2 px-4 border">{s.firstName} {s.lastName}</td>
                <td className="py-2 px-4 border break-all text-xs">{s.account}</td>
                <td className="py-2 px-4 border flex justify-center gap-2">
                  <button
                    disabled={busy}
                    onClick={() => verifySeller(s.account, true)}
                    className="px-3 py-1 rounded bg-orange-500 text-white hover:opacity-90 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={busy}
                    onClick={() => verifySeller(s.account, false)}
                    className="px-3 py-1 rounded bg-gray-400 text-white hover:opacity-90 disabled:opacity-50"
                  >
                    Reject
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
