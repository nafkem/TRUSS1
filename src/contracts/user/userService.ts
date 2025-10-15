// src/contracts/user/service.ts
import { ContractTransactionResponse } from "ethers";
import { getUserContract } from "./contract";

// Define the user interface
interface User {
  userId: number;
  firstName: string;
  lastName: string;
  account: string;
  role: "seller" | "buyer";
  verificationStatus: boolean;
}

// Define the service interface
interface UserService {
  getPendingSellers: any;
  getUserDataSafely: any;
  registerUser(firstName: string, lastName: string): Promise<ContractTransactionResponse>;
  verifySeller(account: string): Promise<ContractTransactionResponse>;
  getUserData(account: string): Promise<User>;
  getUsers(start: number, end: number): Promise<User[]>;
  getUsersSafely(): Promise<User[]>;
  isUserRegistered(address: string): Promise<boolean>;
}

export const userService: UserService = {
  /** Register a new Buyer or Seller */
  async registerUser(lastName: string, firstName: string) {
    const contract = await getUserContract();
    const tx = await contract.register(lastName, firstName);
    return tx ;
  },

  /** Fetch all pending sellers */
async getPendingSellers() {
  const contract = await getUserContract();

  // Example: fetch first 100 users (you may need pagination if users grow large)
  const users = await contract.getUsers(0, 100);

  // Filter pending (unverified) sellers
  return users.filter((u: any) => Number(u.verificationStatus) === 0);
},

  /** Admin verifies a seller by wallet address */
  async verifySeller(account: string) {
    const contract = await getUserContract();
    const tx = await contract.verifySeller(account);
    return tx ;
  },

  /** Check if a user is registered (non-admin function) */
  async isUserRegistered(address: string): Promise<boolean> {
    try {
      const contract = await getUserContract();
      // This should be a public view function in your contract
      const user = await contract.getUserData(address); // Changed to getUserData
      return user.userId !== 0; // ← THIS IS THE KEY LINE
    } catch (error) {
      console.error('Error checking user registration:', error);
      return false;
    }
  },

  /** Get user data by wallet */
  async getUserData(account: string) {
    const contract = await getUserContract();
    return await contract.getUserData(account);
  },


  /** Get all registered users (optional for admin dashboard) */
  async getUsers(start: number, end: number) {
    const contract = await getUserContract();
    return await contract.getUsers(start, end);
  },

  /** Safe method to get all users without out of bounds errors */
  async getUsersSafely(): Promise<User[]> {
    try {
      const allUsers: User[] = [];
      const batchSize = 10;
      let startIndex = 0;
      let hasMoreUsers = true;

      while (hasMoreUsers) {
        try {
          const batch = await this.getUsers(startIndex, startIndex + batchSize - 1);
          if (batch.length === 0) {
            hasMoreUsers = false;
          } else {
            allUsers.push(...batch);
            startIndex += batchSize;
          }
        } catch (error: any) {
          // If we get an out of bounds error, we've reached the end
          if (error.message?.includes("out of bounds") || error.message?.includes("End index")) {
            hasMoreUsers = false;
          } else {
            // Re-throw other errors
            throw error;
          }
        }
      }

      return allUsers;
    } catch (error) {
      console.error("Error fetching users safely:", error);
      return [];
    }
  },
  getUserDataSafely: undefined,
  //getPendingSellers: undefined
};
















// // src/contracts/user/service.ts
// import { getUserContract } from "./contract";

// // Define the user interface
// interface User {
//   userId: number;
//   firstName: string;
//   lastName: string;
//   account: string;
//   role: "seller" | "buyer";
//   verificationStatus: boolean;
// }

// // Define the service interface
// interface UserService {
//   registerUser(lastName: string, firstName: string): Promise<{ tx: any }>;
//   verifySeller(account: string): Promise<{ tx: any }>;
//   getUserData(account: string): Promise<User>;
//   getUsers(start: number, end: number): Promise<User[]>;
//   getUsersSafely(): Promise<User[]>;
// }

// export const userService: UserService = {
//   /** Register a new Buyer or Seller */
//   async registerUser(lastName: string, firstName: string) {
//     const contract = await getUserContract();
//     const tx = await contract.register(lastName, firstName);
//     return { tx };
//   },

//   /** Admin verifies a seller by wallet address */
//   async verifySeller(account: string) {
//     const contract = await getUserContract();
//     const tx = await contract.verifySeller(account);
//     return { tx };
//   },
  

//   /** Get user data by wallet */
//   async getUserData(account: string) {
//     const contract = await getUserContract();
//     return await contract.getUserData(account);
//   },
  

//   /** Get all registered users (optional for admin dashboard) */
//   async getUsers(start: number, end: number) {
//     const contract = await getUserContract();
//     return await contract.getUsers(start, end);
//   },

//   /** Safe method to get all users without out of bounds errors */
//   async getUsersSafely(): Promise<User[]> {
//     try {
//       const allUsers: User[] = [];
//       const batchSize = 10;
//       let startIndex = 0;
//       let hasMoreUsers = true;

//       while (hasMoreUsers) {
//         try {
//           const batch = await this.getUsers(startIndex, startIndex + batchSize - 1);
//           if (batch.length === 0) {
//             hasMoreUsers = false;
//           } else {
//             allUsers.push(...batch);
//             startIndex += batchSize;
//           }
//         } catch (error: any) {
//           // If we get an out of bounds error, we've reached the end
//           if (error.message?.includes("out of bounds") || error.message?.includes("End index")) {
//             hasMoreUsers = false;
//           } else {
//             // Re-throw other errors
//             throw error;
//           }
//         }
//       }

//       return allUsers;
//     } catch (error) {
//       console.error("Error fetching users safely:", error);
//       return [];
//     }
//   },
// };