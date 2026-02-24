/* helpers.js
   Exported constants + helper functions taken verbatim from your original file.
*/

export const MOCK_PRODUCTS = [
  {
    id: "P001",
    name: "Dog Food Premium",
    brand: "PetCare",
    price: 500,
    discount: 10,
    shortDesc: "Nutritious dog food for daily health.",
    detailedDesc:
      "This is **bold text example**. You can highlight important parts using bold.",
    stock: 15,
    addedDate: "2025-08-15",
    banner: "/images/dogfood-banner.jpg",
    images: ["/images/dogfood-side1.jpg", "/images/dogfood-side2.jpg"],
    petType: "Dogs",
    category: "Food",
  },
  {
    id: "P002",
    name: "Cat Toy Mouse",
    brand: "CatFun",
    price: 200,
    discount: 0,
    shortDesc: "Interactive plush mouse that squeaks on touch.",
    detailedDesc: "Playtime toy for cats. **Durable** and safe.",
    stock: 50,
    addedDate: "2025-08-18",
    banner: "/images/cattoy-banner.jpg",
    images: ["/images/cattoy-1.jpg"],
    petType: "Cats",
    category: "Toys & Entertainment",
  },
  {
    id: "P003",
    name: "Bird Cage XL",
    brand: "FeatherHome",
    price: 1500,
    discount: 5,
    shortDesc: "Spacious, easy-clean cage with accessories.",
    detailedDesc: "**Large cage** suitable for parakeets & cockatiels.",
    stock: 5,
    addedDate: "2025-08-20",
    banner: "/images/birdcage-banner.jpg",
    images: ["/images/birdcage-acc.jpg"],
    petType: "Birds",
    category: "Homes & Beds",
  },
  {
    id: "P004",
    name: "AquaCare Fish Medicine",
    brand: "AquaPlus",
    price: 300,
    discount: 15,
    shortDesc: "Treats common infections in freshwater fish.",
    detailedDesc: "Use for **fin rot**, ick, and mild infections.",
    stock: 25,
    addedDate: "2025-08-22",
    banner: "/images/fishmed-banner.jpg",
    images: [],
    petType: "Fishes",
    category: "Health & Medicine",
  },
  {
    id: "P005",
    name: "Dog Grooming Kit",
    brand: "GroomPro",
    price: 800,
    discount: 20,
    shortDesc: "Brush, shampoo, nail cutter — all in one kit.",
    detailedDesc: "Includes **brush**, shampoo and nail trimmer.",
    stock: 10,
    addedDate: "2025-08-25",
    banner: "/images/doggroom-banner.jpg",
    images: ["/images/doggroom-1.jpg", "/images/doggroom-2.jpg"],
    petType: "Dogs",
    category: "Grooming",
  },
];

export const PET_TYPES = ["Dogs", "Cats", "Fishes", "Birds"];
export const CATEGORIES = [
  "Food",
  "Homes & Beds",
  "Toys & Entertainment",
  "Health & Medicine",
  "Accessories",
  "Grooming",
];

export function getNextProductId(products) {
  const maxNum = products.reduce((max, p) => {
    const n = parseInt(p.id.replace(/\D/g, ""), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  return `P${String(maxNum + 1).padStart(3, "0")}`;
}

export function fileOrUrlToPreview(v) {
  if (!v) return "";
  if (typeof v === "string") return v;
  try {
    return URL.createObjectURL(v); // File -> blob preview
  } catch {
    return "";
  }
}
