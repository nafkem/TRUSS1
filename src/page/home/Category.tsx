import React, { useState } from "react";
import ProductCard from "../../component/homepage/ProductCard";
import { products } from "./data";

const Category = () => {
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search logic placeholder
    console.log("Searching...");
  };

  const [category, setCategory] = useState("all");

  return (
    <section className="px-4 md:px-10 my-10">
      <h1 className="text-neutral-800 capitalize font-semibold text-2xl mb-6 text-center md:text-left">
        {`${category}`} Categories
      </h1>

      <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
        {/* Search form */}
        <form
          onSubmit={handleSearch}
          className="flex w-full md:w-2/4 items-center bg-neutral-200 rounded-full overflow-hidden"
        >
          <input
            type="text"
            placeholder="Search Product"
            className="flex-1 bg-transparent py-3 px-4 text-sm placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/80 transition text-white px-6 py-3 h-full"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border border-neutral-300 text-neutral-700 py-3 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-full md:w-auto"
        >
          <option value="all">All</option>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10">
        {products?.map((product: any, idx: number) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Category;
