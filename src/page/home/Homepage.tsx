// import Category from "./Category";
// import Hero from "./Hero";

// const Homepage = () => {
//   return (
//     <div className="w-full border-2 px-10">
//       <Hero />
//       <Category />
//     </div>
//   );
// };

// export default Homepage;

// ====== version 2 ========
import Category from "./Category";
import Hero from "./Hero";

const Homepage = () => {
  return (
    <main className="w-full px-4 sm:px-10">
      <Hero />
      <Category />
    </main>
  );
};

export default Homepage;
