export const headerNav = [
  {
    title: "My listing",
    link: "/listing",
  },
  {
    title: "My order",
    link: "/order",
  },
  {title:"Sell Product",
    link:"/add-listing"
  }
];

export const footerLinks = [
  {
    title: "Explore",
    children: [
      {
        value: "Marketplace",
        link: "#",
      },
      {
        value: "List Product",
        link: "#",
      },
      {
        value: "Cart",
        link: "#",
      },
    ],
  },
  {
    title: "Legal",
    children: [
      {
        value: "Terms and Condition",
        link: "#",
      },
      {
        value: "Privacy Policy",
        link: "#",
      },
      {
        value: "Escrow Policy",
        link: "#",
      },
    ],
  },
  {
    title: "Security and Web3 info",
    children: [
      {
        value: "Polygon",
        link: "#",
      },
      {
        value: "Ethereum",
        link: "#",
      },
      {
        value: "Metamask",
        link: "#",
      },
    ],
  },
];

export const truncateAddress = (address: string) => {
  return address.slice(0, 5) + "...";
};
