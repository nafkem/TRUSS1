// import { BiMinus, BiPlus } from "react-icons/bi";
// import { cartData, getSelectedItems } from "./data";
// import { useState } from "react";
// import {
//   SelfQRcodeWrapper,
//   SelfAppBuilder,
//   type SelfApp,
// } from "@selfxyz/qrcode";
// import { ethers } from "ethers";

// const Cart = () => {
//   const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
//   const [universalLink, setUniversalLink] = useState("");
//   const [userId] = useState(ethers.ZeroAddress);
//   const [paymentrequested, setPaymentrequested] = useState<boolean>(false);

//   const totalPrice = () => {
//     return cartItemData?.reduce(
//       (sum, item) => sum + item?.price * item?.quantity,
//       0
//     );
//   };
//   const [cartItemData, setCartItemData] = useState(cartData);

//   const handleAdd = (id: number) => {
//     const updatedCart = cartItemData.map((item) =>
//       item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//     );
//     setCartItemData(updatedCart);
//   };

//   const handleSub = (id: number) => {
//     const updatedCart = cartItemData.map((item) =>
//       item.id === id && item?.quantity > 1
//         ? { ...item, quantity: item.quantity - 1 }
//         : item
//     );
//     setCartItemData(updatedCart);
//   };

//   const handlePayment = () => {
//     try {
//       const app = new SelfAppBuilder({
//         version: 2,
//         appName: import.meta.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
//         scope: import.meta.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
//         endpoint: `${import.meta.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
//         logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
//         userId: userId,
//         endpointType: "staging_https",
//         userIdType: "hex",
//         userDefinedData: "Bonjour Cannes!",
//         disclosures: {
//           /* 1. what you want to verify from users' identity */
//           minimumAge: 18,
//           // ofac: false,
//           // excludedCountries: [countries.BELGIUM],

//           /* 2. what you want users to reveal */
//           // name: false,
//           // issuing_state: true,
//           nationality: true,
//           // date_of_birth: true,
//           // passport_number: false,
//           gender: true,
//           // expiry_date: false,
//         },
//       }).build();

//       setSelfApp(app);
//       // setUniversalLink(getUniversalLink(app));
//     } catch (error) {
//       console.error("Failed to initialize Self app:", error);
//     }
//   };

//   const handleSuccessfulVerification = (data: any) => {
//     alert("success");
//     console.log(data);
//   };

//   return (
//     <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
//       <h1 className="text-4xl font-light text-gray-800 mb-8">Your Cart</h1>
//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="w-full lg:w-2/3">
//           {cartItemData?.map((data: any) => (
//             <div
//               key={data.id}
//               className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   className="w-20 h-20 object-cover rounded-md shadow-sm"
//                   src={data?.img}
//                   alt={data?.title}
//                 />
//                 <h2 className="text-lg font-medium text-gray-700">
//                   {data?.title}
//                 </h2>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   ETH {data?.price.toFixed(2)}
//                 </h2>
//               </div>
//               <div className="flex items-center justify-center gap-3">
//                 <button
//                   onClick={() => handleSub(data?.id)}
//                   className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   <BiMinus className="text-gray-600" />
//                 </button>
//                 <p className="text-lg font-medium">{data?.quantity}</p>
//                 <button
//                   onClick={() => handleAdd(data?.id)}
//                   className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//                 >
//                   <BiPlus className="text-gray-600" />
//                 </button>
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   ETH {(data?.price * data?.quantity).toFixed(2)}
//                 </h2>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="w-full lg:w-1/3">
//           <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md">
//             <h1 className="text-2xl font-light text-gray-800 border-b border-gray-200 pb-4 mb-4">
//               Cart Summary
//             </h1>
//             <div className="space-y-3">
//               {getSelectedItems(cartItemData)?.map((data: any) => (
//                 <div
//                   key={data.id}
//                   className="flex items-center justify-between"
//                 >
//                   <h3 className="text-base font-medium text-gray-600">
//                     {data?.title}
//                   </h3>
//                   <p className="text-lg font-semibold text-gray-800">
//                     ETH {data?.price.toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//               <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//                 <h3 className="text-base font-medium text-gray-600">
//                   Shipping Fee
//                 </h3>
//                 <p className="text-lg font-semibold text-gray-800">ETH 20.00</p>
//               </div>
//               <div className="flex items-center justify-between pt-3 border-t border-gray-200">
//                 <h3 className="text-lg font-bold text-gray-800">Total</h3>
//                 <p className="text-xl font-bold text-green-600">
//                   ETH {(totalPrice() + 20).toFixed(2)}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={handlePayment}
//               className="w-full mt-6 py-3 px-6 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//             >
//               {paymentrequested ? (
//                 <SelfQRcodeWrapper
//                   selfApp={selfApp as SelfApp}
//                   onSuccess={handleSuccessfulVerification}
//                   onError={() => {
//                     console.error("Error: Failed to verify identity");
//                   }}
//                 />
//               ) : (
//                 "Proceed to Payment"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

// ==== version 2 ====
import { BiMinus, BiPlus } from "react-icons/bi";
import { cartData, getSelectedItems } from "./data";
import { useState } from "react";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,


































































































































































































































































































































































































































































































































































































































































































































































  type SelfApp,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";

const Cart = () => {
  const [cartItemData, setCartItemData] = useState(cartData);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);
  const [paymentRequested, setPaymentRequested] = useState(false);

  const [userId] = useState(ethers.ZeroAddress);

  const totalPrice = () => {
    return cartItemData.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const handleAdd = (id: number) => {
    setCartItemData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleSub = (id: number) => {
    setCartItemData((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handlePayment = () => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: import.meta.env.NEXT_PUBLIC_SELF_APP_NAME || "Self Workshop",
        scope: import.meta.env.NEXT_PUBLIC_SELF_SCOPE || "self-workshop",
        endpoint: `${import.meta.env.NEXT_PUBLIC_SELF_ENDPOINT}`,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: userId,
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Bonjour Cannes!",
        disclosures: {
          minimumAge: 18,
          nationality: true,
          gender: true,
        },
      }).build();

      setSelfApp(app);
      setPaymentRequested(true); // ✅ Show the QR code wrapper
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  };

  const handleSuccessfulVerification = (data: any) => {
    alert("Payment Successful");
    console.log("Verification data:", data);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
      <h1 className="text-4xl font-light text-gray-800 mb-8">Your Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          {cartItemData.map((data) => (
            <div
              key={data.id}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  className="w-20 h-20 object-cover rounded-md shadow-sm"
                  src={data.img}
                  alt={data.title}
                />
                <h2 className="text-lg font-medium text-gray-700">
                  {data.title}
                </h2>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  ETH {data.price.toFixed(2)}
                </h2>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleSub(data.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <BiMinus className="text-gray-600" />
                </button>
                <p className="text-lg font-medium">{data.quantity}</p>
                <button
                  onClick={() => handleAdd(data.id)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <BiPlus className="text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  ETH {(data.price * data.quantity).toFixed(2)}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Summary + Payment */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4 bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-light text-gray-800 border-b border-gray-200 pb-4 mb-4">
              Cart Summary
            </h1>
            <div className="space-y-3">
              {getSelectedItems(cartItemData).map((data: any) => (
                <div
                  key={data.id}
                  className="flex items-center justify-between"
                >
                  <h3 className="text-base font-medium text-gray-600">
                    {data.title}
                  </h3>
                  <p className="text-lg font-semibold text-gray-800">
                    ETH {data.price.toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <h3 className="text-base font-medium text-gray-600">
                  Shipping Fee
                </h3>
                <p className="text-lg font-semibold text-gray-800">ETH 20.00</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">Total</h3>
                <p className="text-xl font-bold text-green-600">
                  ETH {(totalPrice() + 20).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Payment Button */}
            {!paymentRequested ? (
              <button
                onClick={handlePayment}
                className="w-full mt-6 py-3 px-6 rounded-md bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors focus:outline-none"
              >
                Proceed to Payment
              </button>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-4">
                {paymentRequested && selfApp ? (
                  <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={() => handleSuccessfulVerification}
                    onError={() => {
                      console.error("Error: Failed to verify identity");
                    }}
                  />
                ) : (
                  "Proceed to Payment"
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
