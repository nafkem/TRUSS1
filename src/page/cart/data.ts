import Image1 from "../../assets/image/shop/shop2.jpeg";
import Image2 from "../../assets/image/shop/shop5.jpeg";
import Image3 from "../../assets/image/shop/shop7.jpeg";
export const cartData = [
  {
    id: 1,
    img: Image1,
    title: "Human Verified T-Shirt",
    desc: "Comfortable cotton t-shirt with 'Verified Human' print. Made for real Web3 citizens.",
    price: 25.99,
    quantity: 1,
  },
  {
    id: 2,
    img: Image2,
    title: "Decentralized Mug",
    desc: "Start your day with a hot drink and a reminder of your decentralized identity.",
    price: 14.49,
    quantity: 1,
  },
  {
    id: 3,
    img: Image3,
    title: "NFT Art Print",
    desc: "Limited edition art print for verified humans only. Frame not included.",
    price: 49.99,
    quantity: 1,
  },
];

export const getSelectedItems = (data: any) => {
  return data.filter((dataItem: any) => dataItem?.quantity > 1);
};
