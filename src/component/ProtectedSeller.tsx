// src/component/ProtectedSeller.tsx
import { ReactNode, useEffect, useState } from "react";
import { userService } from "../contracts/user/userService";
import { getCurrentAddress } from "../shared/providers";

interface Props {
  children: ReactNode;
}

export default function ProtectedSeller({ children }: Props) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const addr = await getCurrentAddress();
        const user = await userService.getUserData(addr);
        if (user && user.role === "seller" && user.verificationStatus) {
          setVerified(true);
        }
      } catch {
        setVerified(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!verified) return <div className="p-6 text-red-500">You must be a verified seller to access this page.</div>;

  return <>{children}</>;
}
