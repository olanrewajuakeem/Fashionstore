import { assets } from "../assets/assets";

const productsData = {
  "T-Shirts": [
    { 
      id: 1, 
      name: "Classic Tee", 
      price: 5000, 
      img: assets.classicTee, 
      description: "A soft cotton classic tee perfect for everyday wear.",
      isBestSeller: true,
      category: "T-Shirts"
    },
    { 
      id: 2, 
      name: "Graphic Tee", 
      price: 5500, 
      img: assets.graphicTee, 
      description: "Trendy graphic tee with bold prints for casual vibes.",
      isDiscounted: true,
      oldPrice: 9000, 
      category: "T-Shirts"
    },
  ],
  Shoes: [
    { 
      id: 3, 
      name: "Sneakers", 
      price: 6000,
      img: assets.sneakers, 
      description: "Comfortable sneakers designed for style and durability.",
      isBestSeller: true,
      category: "Shoes"
    },
    { 
      id: 4, 
      name: "Loafers", 
      price: 7000,
      img: assets.loafers, 
      description: "Classic leather loafers that pair well with formal and casual outfits.",
      category: "Shoes"
    },
  ],
  Bags: [
    { 
      id: 5, 
      name: "Backpack", 
      price: 5000,
      img: assets.backpack, 
      description: "Spacious and durable backpack for work, travel, or school.",
       isPromo: true,
    promoTitle: "Buy 1 Get 1 Free",
    promoDescription: "Weekend offer",
      category: "Bags"
    },
    { 
      id: 6, 
      name: "Handbag", 
      price: 7500,
      img: assets.handbag, 
      description: "Elegant handbag with plenty of storage for your essentials.",
      isBestSeller: true,
      isPromo: true,
      promoTitle: "Special Handbag Deal",
      promoDescription: "Limited time only",
      category: "Bags"
    },
  ],
  Hats: [
    { 
      id: 7, 
      name: "Baseball Cap", 
      price: 15000,
      img: assets.cap, 
      description: "Stylish baseball cap to keep you cool and trendy.",
      category: "Hats"
    },
    { 
      id: 8, 
      name: "Cowboy Hat", 
      price: 5000,
      img: assets.cowboyHat, 
      description: "Unique cowboy hat to add character to your outfit.",
      category: "Hats"
    },
  ],
  Accessories: [
    { 
      id: 9, 
      name: "Sunglasses", 
      price: 2000,
      img: assets.sunglasses, 
      description: "Protect your eyes with these stylish UV-protected sunglasses.",
      isBestSeller: true,
      isDiscounted: true,
      oldPrice: 3500,
      isPromo: true,
      promoTitle: "Buy 1 Get 1 Free",
      promoDescription: "On all accessories this weekend only",
      category: "Accessories"
    },
    { 
      id: 10, 
      name: "Wristwatch", 
      price: 5000,
      img: assets.wristwatch, 
      description: "A sleek wristwatch for keeping time in style.",
      category: "Accessories"
    },
  ],
};

export default productsData;
