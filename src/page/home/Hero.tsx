// import { useEffect, useState } from "react";
// import BackgroundImg2 from "../../assets/image/back2.jpg";
// import Shop from "../../assets/image/shop3.jpeg";
// import Shop2 from "../../assets/image/shop2.jpeg";
// import Shop3 from "../../assets/image/order.jpeg";

// const Hero = () => {
//   const shopImages = [Shop, Shop2, Shop3];
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) =>
//         prevIndex === shopImages.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 3000); // Change image every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="w-full">
//       <div
//         className="w-full h-[400px] relative overflow-hidden flex items-center justify-between"
//         style={{
//           backgroundImage: `url(${BackgroundImg2})`,
//           backgroundRepeat: "no-repeat",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* Overlay for better text readability */}
//         <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

//         {/* Left content */}
//         <div className="w-1/2 h-full text-white z-10 flex flex-col items-center justify-center px-6">
//           <h1 className="text-4xl font-bold mb-4">Buy & Sell Freely</h1>
//           <h2 className="text-2xl">Fund, stay safe until delivery</h2>
//         </div>

//         {/* Right image that rotates */}
//         <div
//           className="w-1/2 h-full z-10 transition-all duration-700 ease-in-out"
//           style={{
//             backgroundImage: `url(${shopImages[currentImageIndex]})`,
//             backgroundRepeat: "no-repeat",
//             backgroundSize: "cover",
//             backgroundPosition: "top center",
//           }}
//         ></div>
//       </div>
//     </section>
//   );
// };

// export default Hero;

// ======= version 2 ========
import { useEffect, useState } from "react";
import BackgroundImg2 from "../../assets/image/back2.jpg";
import Shop from "../../assets/image/shop3.jpeg";
import Shop2 from "../../assets/image/shop2.jpeg";
import Shop3 from "../../assets/image/order.jpeg";

const Hero = () => {
  const shopImages = [Shop, Shop2, Shop3];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === shopImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-[400px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${BackgroundImg2})` }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>

      {/* Left Text Section */}
      <div className="w-full md:w-1/2 z-20 text-white flex flex-col items-center justify-center text-center px-6 py-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Buy & Sell Freely
        </h1>
        <h2 className="text-xl md:text-2xl">Fund, stay safe until delivery</h2>
      </div>

      {/* Right Image Rotation */}
      <div
        className="w-full md:w-1/2 h-[250px] md:h-full z-20 transition-all duration-700 ease-in-out bg-cover bg-center"
        style={{ backgroundImage: `url(${shopImages[currentImageIndex]})` }}
      ></div>
    </section>
  );
};

export default Hero;
