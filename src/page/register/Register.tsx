// page/register/Register.tsx (Buyer/Seller Registration)
import { useState } from "react";
import { userService } from "../../contracts/user/userService";
import { useWallet } from "../../context/walletContext";
import { toast } from "sonner";

export default function Register() {
  const { account } = useWallet();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      toast.error("⚠️ Connect wallet first!");
      return;
    }

    try {
      setLoading(true);
      const tx = await userService.registerUser(
        formData.lastName,
        formData.firstName,
        
        //formData.role
      );
      await tx.wait();

      if (formData.role === "buyer") {
        toast.success("✅ Registration successful! You may proceed to view products.");
      } else {
        toast.success("✅ Registration successful! Awaiting admin verification.");
      }

      setFormData({ firstName: "", lastName: "", role: "buyer" });
    } catch (err: any) {
      console.error("Registration failed:", err);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-orange-600">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:bg-orange-300"
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
}
