// src/shared/contractUtils.ts
import { getUserContract } from '../contracts/user/contract';
import { getEcommerceContract } from '../contracts/ecommerce/contract';
import { getProductContract } from '../contracts/product/contract';
import { getEscrowContract } from '../contracts/escrow/contract';

// Check all contracts are accessible
export async function checkAllContracts(): Promise<boolean> {
  try {
    console.log('🔗 Checking contract connections...');
    
    const userContract = await getUserContract();
    console.log('✅ User contract connected:', await userContract.getAddress());
    
    const ecommerceContract = await getEcommerceContract();
    console.log('✅ Ecommerce contract connected:', await ecommerceContract.getAddress());
    
    const productContract = await getProductContract();
    console.log('✅ Product contract connected:', await productContract.getAddress());
    
    const escrowContract = await getEscrowContract();
    console.log('✅ Escrow contract connected:', await escrowContract.getAddress());
    
    console.log('🎉 All contracts connected successfully!');
    return true;
  } catch (error) {
    console.error('❌ Contract connection failed:', error);
    return false;
  }
}