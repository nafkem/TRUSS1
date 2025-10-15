import Shop1 from "../../assets/image/shop/shop1.jpeg";
import Shop2 from "../../assets/image/shop/shop2.jpeg";
import Shop3 from "../../assets/image/shop/shop3.jpeg";
import Shop4 from "../../assets/image/shop/shop4.jpeg";
import Shop5 from "../../assets/image/shop/shop5.jpeg";
import Shop6 from "../../assets/image/shop/shop8.jpeg";
import Shop7 from "../../assets/image/shop/shop7.jpeg";
export const products = [
  {
    name: "Crypto Hoodie",
    description: "Comfortable cotton hoodie with blockchain logo.",
    rating: 4.5,
    priceEth: 30,
    image: Shop1,
  },
  {
    name: "Web3 T-Shirt",
    description: "Soft T-shirt made for developers and crypto fans.",
    rating: 4.2,
    priceEth: 20,
    image: Shop2,
  },
  {
    name: "Ethereum Mug",
    description: "Ceramic mug with Ethereum logo and slogan.",
    rating: 4.7,
    priceEth: 10,
    image: Shop3,
  },
  {
    name: "Smart Wallet",
    description: "NFC-enabled wallet with a crypto feel.",
    rating: 4.8,
    priceEth: 50,
    image: Shop4,
  },
  {
    name: "Blockchain Sticker Pack",
    description: "10 assorted stickers of popular crypto logos.",
    rating: 4.0,
    priceEth: 5,
    image: Shop5,
  },
  {
    name: "Solidity Notebook",
    description: "Minimalist coding notebook for Web3 devs.",
    rating: 4.3,
    priceEth: 15,
    image: Shop6,
  },
  {
    name: "Decentralized Cap",
    description: "Trendy cap with embroidered DAO insignia.",
    rating: 4.6,
    priceEth: 25,
    image: Shop7,
  },
];

export const getParginatedItem = (startIndex: number, endIndex: number) => {
  return products?.slice(startIndex, endIndex);
};
