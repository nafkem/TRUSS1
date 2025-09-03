// src/test-connection.ts
import { getBrowserProvider } from './shared/providers'; // ← CORRECT PATH
import { checkAllContracts } from './shared/contractUtils'; // ← CORRECT PATH

async function testConnections() {
  console.log('🔗 Testing blockchain connections...');
  
  try {
    // Test provider
    const provider = getBrowserProvider();
    const network = await provider.getNetwork();
    console.log('✅ Network:', network.name, '(ID:', network.chainId, ')');
    
    // Test signer
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    console.log('✅ Connected address:', address);
    
    // Test all contracts
    const success = await checkAllContracts();
    
    if (success) {
      console.log('🎉 ALL CONTRACTS CONNECTED SUCCESSFULLY!');
      console.log('📋 Contract Addresses:');
      console.log('   - User:', '0xE4b7Ff08bDA75541620356d283eb10E3DB44EeDB');
      console.log('   - Product:', '0x1fa790Bf376013277B8Aa7506D330c417A1dc155');
      console.log('   - Ecommerce:', '0x09EB12CbCDa3E5ad65874bc54330782fa8d51DD9');
      console.log('   - Escrow:', '0x2163fee47139C909ad093e4E0eE22A119B5Df206');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    console.log('🔧 Troubleshooting:');
    console.log('   - Check MetaMask is connected to Base Sepolia');
    console.log('   - Ensure you have test ETH');
    console.log('   - Verify contract addresses');
  }
}

testConnections();