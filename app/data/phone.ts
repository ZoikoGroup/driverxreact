const dummyProducts = [
  {
    id: 1,
    brand: "apple",
    name: "iPhone 13 Pro",
    image: "/images/iphone-13-pro-mlvw3hn-a-apple-original-imag6vpcvspnzyfy.png",
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Silver", "Gold", "Graphite"],
      condition: ["A1", "A2", "A3", "B1", "B2", "C1"],
    },
    variants: [
      { storage: "128GB", condition: "A1", price: 500 },
      { storage: "128GB", condition: "A2", price: 480 },
      { storage: "256GB", condition: "A1", price: 550 },
      { storage: "512GB", condition: "A1", price: 600 },
    ],
  },
  {
    id: 2,
    brand: "apple",
    name: "iPhone 12",
    image: "/images/apple-iphone-12-dummyapplefsn-original-imafwg8dkyh2zgrh.png",
    options: {
      storage: ["64GB", "128GB", "256GB"],
      colors: ["Black", "Blue", "White"],
      condition: ["A1", "A2", "B1", "B2", "C1"],
    },
    variants: [
      { storage: "64GB", condition: "A1", price: 300 },
      { storage: "128GB", condition: "A1", price: 340 },
      { storage: "128GB", condition: "B1", price: 310 },
      { storage: "256GB", condition: "A1", price: 380 },
    ],
  },
  {
    id: 3,
    brand: "samsung",
    name: "Galaxy Z Flip 4",
    image: "/images/original-imahfay2yzrfjggn.png",
    options: {
      storage: ["128GB", "256GB", "512GB"],
      colors: ["Purple", "Black"],
      condition: ["A1", "A2", "B1", "C1"],
    },
    variants: [
      { storage: "128GB", condition: "A1", price: 400 },
      { storage: "256GB", condition: "A1", price: 450 },
      { storage: "256GB", condition: "B1", price: 420 },
      { storage: "512GB", condition: "A1", price: 500 },
    ],
  },
];


