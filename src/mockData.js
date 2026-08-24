// Lonetex B2B Cleaning Products Catalog - Seed Mock Data

export const initialProducts = [
  {
    id: "LTX-001",
    sku: "LTX-KD-CHK-01",
    name: "Kitchen Duster",
    subcategory: "Kitchen Duster",
    subCategory: "Kitchen Duster",
    category: "Cloths & Dusters",
    price: 35.00,
    costPrice: 15.00,
    wholesalePrice: 35.00,
    uom: "Dozen",
    shelfId: "E-02-A",
    image: "/media/products/kitchen_duster.png",
    stock: {
      "LHR-FAC": 600,
      "LHR-HQ": 120,
      "KSA-HUB": 200
    },
    barcode: "609384918601",
    minThreshold: 100
  },
  {
    id: "LTX-002",
    sku: "LTX-FL-MF-BLU",
    name: "Microfiber Dust Mop",
    subcategory: "Dust/Flat Mops",
    subCategory: "Dust/Flat Mops",
    category: "Flat & Dust Mops",
    price: 14.50,
    costPrice: 6.50,
    wholesalePrice: 14.50,
    uom: "Pieces",
    shelfId: "B-01-A",
    image: "/media/products/microfiber_dust_mop.png",
    stock: {
      "LHR-FAC": 1200,
      "LHR-HQ": 200,
      "KSA-HUB": 450
    },
    barcode: "609384918602",
    minThreshold: 100
  },
  {
    id: "LTX-003",
    sku: "LTX-SP-MOP-SET",
    name: "Spray Mops",
    subcategory: "Product",
    subCategory: "Product",
    category: "Practical Cleaning",
    price: 24.00,
    costPrice: 11.00,
    wholesalePrice: 24.00,
    uom: "Pieces",
    shelfId: "C-01-B",
    image: "/media/products/spray_mops.png",
    stock: {
      "LHR-FAC": 450,
      "LHR-HQ": 80,
      "KSA-HUB": 150
    },
    barcode: "609384918603",
    minThreshold: 50
  },
  {
    id: "LTX-004",
    sku: "LTX-HD-ALU-150",
    name: "Mop Handle Colored With Colored Grip 150cm",
    subcategory: "Aluminium Mop Handles",
    subCategory: "Aluminium Mop Handles",
    category: "Handles & Frames",
    price: 18.00,
    costPrice: 8.00,
    wholesalePrice: 18.00,
    uom: "Pieces",
    shelfId: "D-01-A",
    image: "/media/products/mop_handle_colored.png",
    stock: {
      "LHR-FAC": 850,
      "LHR-HQ": 150,
      "KSA-HUB": 300
    },
    barcode: "609384918604",
    minThreshold: 80
  },
  {
    id: "LTX-005",
    sku: "LTX-HD-IRN-STD",
    name: "Iron Handle",
    subcategory: "Iron Mop Handles",
    subCategory: "Iron Mop Handles",
    category: "Handles & Frames",
    price: 12.00,
    costPrice: 5.00,
    wholesalePrice: 12.00,
    uom: "Pieces",
    shelfId: "D-02-B",
    image: "/media/products/iron_handle.png",
    stock: {
      "LHR-FAC": 700,
      "LHR-HQ": 100,
      "KSA-HUB": 250
    },
    barcode: "609384918605",
    minThreshold: 80
  },
  {
    id: "LTX-006",
    sku: "LTX-SP-BSK-SET",
    name: "Spin Mop Set",
    subcategory: "Product",
    subCategory: "Product",
    category: "Practical Cleaning",
    price: 32.00,
    costPrice: 15.00,
    wholesalePrice: 32.00,
    uom: "Pieces",
    shelfId: "C-02-A",
    image: "/media/products/spin_mop_set.png",
    stock: {
      "LHR-FAC": 380,
      "LHR-HQ": 60,
      "KSA-HUB": 120
    },
    barcode: "609384918606",
    minThreshold: 40
  },
  {
    id: "LTX-007",
    sku: "LTX-KY-COT-WLE",
    name: "Kentucky Mop Cotton White Loop-End",
    subcategory: "Wet/Kentucky Mops",
    subCategory: "Wet/Kentucky Mops",
    category: "Wet/Kentucky Mops",
    price: 6.50,
    costPrice: 2.80,
    wholesalePrice: 6.50,
    uom: "Pieces",
    shelfId: "A-01-A",
    image: "/media/products/kentucky_white_loop.png",
    stock: {
      "LHR-FAC": 2400,
      "LHR-HQ": 350,
      "KSA-HUB": 900
    },
    barcode: "609384918607",
    minThreshold: 200
  },
  {
    id: "LTX-008",
    sku: "LTX-KY-COT-WCE",
    name: "Kentucky Mop Cotton White Cut-End",
    subcategory: "Wet/Kentucky Mops",
    subCategory: "Wet/Kentucky Mops",
    category: "Wet/Kentucky Mops",
    price: 5.80,
    costPrice: 2.50,
    wholesalePrice: 5.80,
    uom: "Pieces",
    shelfId: "A-01-B",
    image: "/media/products/kentucky_white_cut.png",
    stock: {
      "LHR-FAC": 1800,
      "LHR-HQ": 250,
      "KSA-HUB": 600
    },
    barcode: "609384918608",
    minThreshold: 150
  },
  {
    id: "LTX-009",
    sku: "LTX-KY-CLR-YCE",
    name: "Kentucky Mop Colored Cut-End",
    subcategory: "Wet/Kentucky Mops",
    subCategory: "Wet/Kentucky Mops",
    category: "Wet/Kentucky Mops",
    price: 6.20,
    costPrice: 2.85,
    wholesalePrice: 6.20,
    uom: "Pieces",
    shelfId: "A-02-A",
    image: "/media/products/kentucky_yellow_cut.png",
    stock: {
      "LHR-FAC": 1100,
      "LHR-HQ": 180,
      "KSA-HUB": 400
    },
    barcode: "609384918609",
    minThreshold: 150
  },
  {
    id: "LTX-010",
    sku: "LTX-KY-CLR-BLE",
    name: "Kentucky Mop Colored Loop-End",
    subcategory: "Wet/Kentucky Mops",
    subCategory: "Wet/Kentucky Mops",
    category: "Wet/Kentucky Mops",
    price: 6.80,
    costPrice: 3.10,
    wholesalePrice: 6.80,
    uom: "Pieces",
    shelfId: "A-02-B",
    image: "/media/products/kentucky_blue_loop.png",
    stock: {
      "LHR-FAC": 1400,
      "LHR-HQ": 220,
      "KSA-HUB": 500
    },
    barcode: "609384918610",
    minThreshold: 150
  },
  {
    id: "LTX-011",
    sku: "LTX-KY-PLY-WHT",
    name: "Kentucky Mop Polyester",
    subcategory: "Wet/Kentucky Mops",
    subCategory: "Wet/Kentucky Mops",
    category: "Wet/Kentucky Mops",
    price: 7.20,
    costPrice: 3.20,
    wholesalePrice: 7.20,
    uom: "Pieces",
    shelfId: "A-02-C",
    image: "/media/products/kentucky_polyester.png",
    stock: {
      "LHR-FAC": 1000,
      "LHR-HQ": 150,
      "KSA-HUB": 300
    },
    barcode: "609384918611",
    minThreshold: 150
  }
];

export const initialWarehouses = [
  { id: "wh-1", code: "LHR-FAC", name: "Lahore Factory (Main Canal Road)", address: "Main Canal Road, Lahore" },
  { id: "wh-2", code: "LHR-HQ", name: "Lahore Head Office (Gulberg)", address: "Gulberg III, Lahore" },
  { id: "wh-3", code: "KSA-HUB", name: "International Hub (KSA / Dammam)", address: "Dammam Port Free Zone, KSA" }
];

export const initialTransactions = [
  {
    id: "tx-1",
    timestamp: "2026-08-20T10:30:00Z",
    type: "Stock In", // Inward
    sku: "LTX-KY-COT-WLE",
    productName: "Kentucky Mop Cotton White Loop-End",
    warehouseCode: "LHR-FAC",
    qty: 500,
    remarks: "Factory Production intake - Lahore Factory"
  },
  {
    id: "tx-2",
    timestamp: "2026-08-21T14:15:00Z",
    type: "Stock Out", // Outward
    sku: "LTX-FL-MF-BLU",
    productName: "Microfiber Dust Mop",
    warehouseCode: "KSA-HUB",
    qty: -120,
    remarks: "B2B dispatch to KSA Hub"
  },
  {
    id: "tx-3",
    timestamp: "2026-08-22T09:00:00Z",
    type: "Stock Adjustment",
    sku: "LTX-HD-IRN-STD",
    productName: "Iron Handle",
    warehouseCode: "LHR-HQ",
    qty: -2,
    remarks: "Damaged during Gulberg HO showroom setup"
  }
];

export const defaultMockData = {
  products: initialProducts,
  warehouses: initialWarehouses,
  transactions: initialTransactions
};
