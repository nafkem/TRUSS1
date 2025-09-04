// src/ContractTester.tsx
import { useState } from "react";
import { getBrowserProvider } from "./shared/providers";
import { checkAllContracts } from "./shared/contractUtils";
import { switchToNetwork, isNetwork, NETWORKS } from "./shared/networkUtils";

export function ContractTester() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof NETWORKS>("baseSepolia");

  const addResult = (message: string) => {
    setResults((prev) => [...prev, message]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);

    addResult("🚀 Starting connection test...");

    try {
      // Step 1: Switch to chosen network
      addResult(`1. Switching to ${NETWORKS[selectedNetwork].name}...`);
      await switchToNetwork(selectedNetwork);
      addResult("✅ Network switch requested");

      // Step 2: Verify network
      addResult("2. Verifying network...");
      const isCorrectNetwork = await isNetwork(selectedNetwork);
      if (!isCorrectNetwork) {
        throw new Error(`Failed to switch to ${NETWORKS[selectedNetwork].name}`);
      }
      addResult(`✅ Connected to ${NETWORKS[selectedNetwork].name}`);

      // Step 3: Test provider
      addResult("3. Testing provider connection...");
      const provider = getBrowserProvider();
      const network = await provider.getNetwork();
      addResult(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`);

      // Step 4: Test signer
      addResult("4. Testing signer...");
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      addResult(`✅ Connected address: ${address}`);

      // Step 5: Test all contracts
      addResult("5. Testing contract connections...");
      const success = await checkAllContracts();

      if (success) {
        addResult("🎉 ALL CONTRACTS CONNECTED SUCCESSFULLY!");
        addResult("\n📋 Contract Addresses:");
        addResult("   - User: 0xE4b7Ff08bDA75541620356d283eb10E3DB44EeDB");
        addResult("   - Product: 0x1fa790Bf376013277B8Aa7506D330c417A1dc155");
        addResult("   - Ecommerce: 0x09EB12CbCDa3E5ad65874bc54330782fa8d51DD9");
        addResult("   - Escrow: 0x2163fee47139C909ad093e4E0eE22A119B5Df206");
      } else {
        addResult("❌ Some contracts failed to connect");
      }
    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
      addResult("\n🔧 Troubleshooting:");
      addResult("   - Approve network switch in MetaMask");
      addResult("   - Check that you have test ETH");
      addResult("   - Ensure contract addresses are correct");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
        padding: "15px",
        background: "white",
        border: "2px solid #007bff",
        borderRadius: "10px",
        fontFamily: "monospace",
        maxWidth: "400px",
        maxHeight: "400px",
        overflow: "auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <h3 style={{ margin: "0 0 10px 0" }}>🛠️ Dev Tools</h3>

      {/* Network Selector */}
      <select
        value={selectedNetwork}
        onChange={(e) => setSelectedNetwork(e.target.value as keyof typeof NETWORKS)}
        style={{
          marginBottom: "10px",
          padding: "5px",
          fontSize: "13px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "100%",
        }}
      >
        {Object.keys(NETWORKS).map((net) => (
          <option key={net} value={net}>
            {NETWORKS[net].name}
          </option>
        ))}
      </select>

      <button
        onClick={testConnection}
        disabled={loading}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          background: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "10px",
          width: "100%",
        }}
      >
        {loading ? "🔄 Testing..." : "🚀 Test Contracts"}
      </button>

      <div
        style={{
          background: "#f8f9fa",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
          fontSize: "12px",
          lineHeight: "1.3",
        }}
      >
        <strong>Results:</strong>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: "5px 0 0 0",
            fontSize: "11px",
          }}
        >
          {results.length === 0 ? "Click to test..." : results.join("\n")}
        </pre>
      </div>
    </div>
  );
}
