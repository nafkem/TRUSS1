// src/components/TestEthers.tsx
import { useEffect } from 'react';
import { getBrowserProvider } from '../shared/providers.js';

export function TestEthers() {
  useEffect(() => {
    const testEthers = async () => {
      try {
        const provider = getBrowserProvider();
        const network = await provider.getNetwork();
        console.log('Network:', network);
        
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log('Connected address:', address);
        
      } catch (error) {
        console.error('Ethers test failed:', error);
      }
    };

    testEthers();
  }, []);

  return <div>Testing ethers.js connection...</div>;
}