// import { footerLinks } from "./data";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <div className="w-full flex p-10 items-start justify-start bg-neutral-100">
//       <div className="w-1/3">
//         <h1 className="text-[4rem] font-bold text-primary">Truss</h1>
//         <p className="mt-5 text-lg text-neutral-600 w-[80%] text-justify">
//           Truss is a decentralize peer-to-peer markeyplace powered by blockchain
//           escrow and on-chain feedback. No middleman, no scam
//         </p>
//       </div>
//       <div className="w-2/3 grid grid-cols-3">
//         {footerLinks?.map((linkData: any, index: number) => {
//           return (
//             <div key={index}>
//               <h1 className="text-neutral-800 text-xl">{linkData?.title}</h1>
//               <ul className="text-md ">
//                 {linkData?.children?.map((childLink: any, index: number) => (
//                   <li className="my-5" key={index}>
//                     <Link
//                       className="text-neutral-500 hover:text-purple-400 mb"
//                       to={childLink?.link}
//                     >
//                       {childLink?.value}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Footer;

// ======= version 2 =======
import { footerLinks } from "./data";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      aria-label="Footer"
      className="w-full flex flex-col md:flex-row gap-10 p-10 bg-neutral-100"
    >
      {/* Logo & Description */}
      <div className="md:w-1/3 w-full">
        <h1 className="text-[3rem] sm:text-[4rem] font-bold text-primary">
          Truss
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-600 max-w-[90%] text-justify">
          Truss is a decentralized peer-to-peer marketplace powered by
          blockchain escrow and on-chain feedback. No middleman, no scam.
        </p>
      </div>

      {/* Footer Links */}
      <div className="md:w-2/3 w-full grid grid-cols-2 sm:grid-cols-3 gap-6">
        {footerLinks?.map((linkData: any, index: number) => (
          <div key={index}>
            <h2 className="text-neutral-800 text-lg font-semibold mb-3">
              {linkData?.title}
            </h2>
            <ul className="space-y-3 text-sm">
              {linkData?.children?.map((childLink: any, i: number) => (
                <li key={i}>
                  <Link
                    to={childLink?.link}
                    className="text-neutral-500 hover:text-purple-500 transition-colors duration-200"
                  >
                    {childLink?.value}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
