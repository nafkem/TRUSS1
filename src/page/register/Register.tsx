import { useState, useEffect } from "react";
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

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [wallet, setWallet] = useState<string | null>(null);
  const [existingUser, setExistingUser] = useState<User | null>(null);

  // Detect connected wallet
  useEffect(() => {
    (async () => {
      try {
        const addr = await getCurrentAddress();
        setWallet(addr);

        // Check if wallet already registered
        const allUsers = await userService.getUsersSafely();
        const user = allUsers.find((u: User) => u.account.toLowerCase() === addr.toLowerCase());
        setExistingUser(user || null);
      } catch {
        setWallet(null);
      }
    })();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return alert("Connect your wallet first!");

    setBusy(true);
    setMessage("");

    try {
      if (existingUser) {
        setMessage("❌ You are already registered!");
        return;
      }

      // Fix applied here: pass only lastName and firstName (2 arguments)
      const result = await userService.registerUser(lastName, firstName);
      setMessage(`✅ Registration successful! TX: ${result.tx.hash}`);

      // Reset form
      setFirstName("");
      setLastName("");
      setRole("buyer");

      // Store role locally for UI display
      setExistingUser({ account: wallet, firstName, lastName, role, userId: 0, verificationStatus: false });
    } catch (error: any) {
      setMessage(`❌ Error: ${error?.message ?? String(error)}`);
    } finally {
      setBusy(false);
    }
  };

  if (!wallet) {
    return <div className="p-6 text-red-500">Connect wallet to continue</div>;
  }

  if (existingUser) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow text-center">
      <p className="text-gray-700">
        You are already registered as <strong>{existingUser.role}</strong>.
      </p>
      <p className="text-green-600 mt-2 font-medium">
        ✅ You have been registered! You may now proceed.
      </p>
    </div>
  );
}


  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-orange-600">Register</h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "buyer" | "seller")}
            className="w-full p-2 border rounded focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {busy ? "Registering..." : "Register"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.includes("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
