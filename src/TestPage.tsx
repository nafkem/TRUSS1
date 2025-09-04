// src/TestPage.tsx
import { useState } from 'react';
import { getBrowserProvider } from './shared/providers';
import { checkAllContracts } from './shared/contractUtils';

export function TestPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const testConnection = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🚀 Starting connection test...');
    
    try {
      // Test 1: Basic provider
      addResult('1. Testing provider connection...');
      const provider = getBrowserProvider();
      const network = await provider.getNetwork();
      addResult(`✅ Network: ${network.name} (Chain ID: ${network.chainId})`);

      // Test 2: Signer
      addResult('2. Testing signer...');
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      addResult(`✅ Connected address: ${address}`);

      // Test 3: Check all contracts
      addResult('3. Testing contract connections...');
      const success = await checkAllContracts();
      
      if (success) {
        addResult('🎉 ALL CONTRACTS CONNECTED SUCCESSFULLY!');
        addResult('\n📋 Contract Addresses:');
        addResult('   - User: 0xE4b7Ff08bDA75541620356d283eb10E3DB44EeDB');
        addResult('   - Product: 0x1fa790Bf376013277B8Aa7506D330c417A1dc155');
        addResult('   - Ecommerce: 0x09EB12CbCDa3E5ad65874bc54330782fa8d51DD9');
        addResult('   - Escrow: 0x2163fee47139C909ad093e4E0eE22A119B5Df206');
      } else {
        addResult('❌ Some contracts failed to connect');
      }

    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`);
      addResult('\n🔧 Troubleshooting:');
      addResult('   - Make sure MetaMask is connected to Base Sepolia');
      addResult('   - Check that you have test ETH');
      addResult('   - Ensure contract addresses are correct');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      maxWidth: '800px', 
      margin: '0 auto' 
    }}>
      <h1>🛠️ Contract Connection Tester</h1>
      
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{ 
          padding: '15px 30px', 
          fontSize: '18px', 
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '🔄 Testing...' : '🚀 Test Connections'}
      </button>

      <div style={{ 
        marginTop: '20px', 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '5px',
        border: '1px solid #ddd'
      }}>
        <h3>Test Results:</h3>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {results.length === 0 ? 'Click the button to start test...' : results.join('\n')}
        </pre>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', background: '#fff3cd', borderRadius: '5px' }}>
        <h3>📍 Before Testing:</h3>
        <ul>
          <li>Ensure MetaMask is unlocked</li>
          <li>Connected to <strong>Base Sepolia</strong> network</li>
          <li>Have test ETH from faucet</li>
          <li>This page must be opened in browser</li>
        </ul>
      </div>
    </div>
  );
}