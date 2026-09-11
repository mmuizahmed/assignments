export type UserStatus = "Active" | "Pending" | "Rejected";

export const users = [
  { id: "01", name: "Curtis", email: "wiegand@hotmail.com", country: "Saucerize", friends: 834, followers: 3645, status: "Active" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-1-Dja0YEDP.png", verified: true },
  { id: "02", name: "Xavier", email: "tyrell86@company.com", country: "South Bradfordstad", friends: 634, followers: 2345, status: "Pending" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-2-F9B2bxNX.png", verified: false },
  { id: "03", name: "Lola", email: "aufderhar56@yahoo.com", country: "North Tannermouth", friends: 164, followers: 9345, status: "Rejected" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-3-DAakmaVf.png", verified: false },
  { id: "04", name: "Milton", email: "dikinson49@hotmail.com", country: "North Anika", friends: 684, followers: 3654, status: "Pending" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-4-DbzFqBg_.png", verified: false },
  { id: "05", name: "Lysanne", email: "zack.turner49@company.com", country: "Betteland", friends: 842, followers: 5863, status: "Active" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-5-B8s6xDjX.png", verified: true },
  { id: "06", name: "Bonita", email: "keebler57@company.com", country: "Alexburgh", friends: 543, followers: 8965, status: "Rejected" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-6-Cz0KtcHl.png", verified: false },
  { id: "07", name: "Retta", email: "mathew92@yahoo.com", country: "East Bryceland", friends: 871, followers: 9321, status: "Active" as UserStatus, avatar: "https://berrydashboard.com/assets/avatar-7-RXq1VyZy.png", verified: true },
  { id: "08", name: "Zoie", email: "hulda1@hotmail.com", country: "Beattytown", friends: 354, followers: 1686, status: "Pending" as UserStatus, avatar: "/users/avatar-8.png", verified: false },
  { id: "09", name: "Easton", email: "hilpert66@hotmail.com", country: "North Pedromouth", friends: 546, followers: 9562, status: "Active" as UserStatus, avatar: "/users/avatar-9.png", verified: true },
  { id: "10", name: "Brianne", email: "noe45@hotmail.com", country: "New Alexanderborough", friends: 1482, followers: 10865, status: "Active" as UserStatus, avatar: "/users/avatar-10.png", verified: true },
];

export const products = [
  { id: 1, name: "Apple Series 4 GPS A38 MM Space", description: "Apple Watch SE Smartwatch", image: "https://berrydashboard.com/assets/prod-1-HZVVZx_S.png", price: 275, original: null as number | null, rating: 4, reviews: 275, gender: "Male", category: "Fashion", colors: ["black", "grey", "yellow"] },
  { id: 2, name: "Boat On-Ear Wireless", description: "Mic(Bluetooth 4.2, Rockerz 450R...", image: "https://berrydashboard.com/assets/prod-2-Du1XTQ2F.png", price: 81.99, original: null as number | null, rating: 3.5, reviews: 82, gender: "Kids", category: "Electronics", colors: ["black", "grey"] },
  { id: 3, name: "Fitbit MX30 Smart Watch", description: "(MX30- waterproof) watch", image: "https://berrydashboard.com/assets/prod-3-BWUks3T1.png", price: 49.9, original: 85, rating: 4.5, reviews: 50, gender: "Male", category: "Fashion", colors: ["red", "darkRed"] },
  { id: 4, name: "Luxury Watches Centrix Gold", description: "7655 Couple (Refurbished)...", image: "https://berrydashboard.com/assets/prod-4-DwdasrVz.png", price: 29.99, original: 36, rating: 4, reviews: 30, gender: "Kids", category: "Fashion", colors: ["black", "yellow"] },
  { id: 5, name: "Canon EOS 1500D 24.1 Digital SLR", description: "SLR Camera (Black) with EF S18-55...", image: "https://berrydashboard.com/assets/prod-5-Cl9js1ye.png", price: 12.99, original: 15.99, rating: 3.5, reviews: 13, gender: "Male", category: "Electronics", colors: ["grey", "black"] },
  { id: 6, name: "Apple iPhone 13 Mini", description: "13 cm (5.4-inch) Super", image: "https://berrydashboard.com/assets/prod-6-xAq4opmM.png", price: 86.99, original: null as number | null, rating: 4.5, reviews: 87, gender: "Female", category: "Electronics", colors: ["red", "darkRed"] },
  { id: 7, name: "Apple MacBook Pro with Iphone", description: "11th Generation Intel® Core™ i5-11320H ...", image: "https://berrydashboard.com/assets/prod-7-L09j58z4.png", price: 14.59, original: null as number | null, rating: 4, reviews: 15, gender: "Male", category: "Electronics", colors: ["yellow", "black"] },
  { id: 8, name: "Apple iPhone 13 Pro", description: "(512GB ROM, MLLH3HN/A,..", image: "https://berrydashboard.com/assets/prod-8-RXCiLo2k.png", price: 100, original: 129.99, rating: 4.5, reviews: 100, gender: "Female", category: "Electronics", colors: ["red", "orange"] },
  { id: 9, name: "Canon EOS 1500D 24.1 Digital", description: "(512GB ROM, MLLH3HN/A,..", image: "https://berrydashboard.com/assets/prod-9-CBJwxhUX.png", price: 399, original: null as number | null, rating: 4, reviews: 399, gender: "Female", category: "Electronics", colors: ["yellow", "green", "orange"] },
];

export const productColors = [
  { id: "lightPrimary", label: "Light Primary", hex: "#1e88e5" },
  { id: "darkPrimary", label: "Dark Primary", hex: "#90caf9" },
  { id: "lightSecondary", label: "Light Secondary", hex: "#651fff" },
  { id: "secondary", label: "Secondary", hex: "#7c4dff" },
  { id: "lightGreen", label: "Light Green", hex: "#04923f" },
  { id: "green", label: "Green", hex: "#11c86f" },
  { id: "darkGreen", label: "Dark Green", hex: "#61ffb2" },
  { id: "lightRed", label: "Light Red", hex: "#a21313" },
  { id: "red", label: "Red", hex: "#f44336" },
  { id: "darkRed", label: "Dark Red", hex: "#ef9a9a" },
  { id: "yellow", label: "Yellow", hex: "#f8bb05" },
  { id: "darkYellow", label: "Dark Yellow", hex: "#ffe479" },
  { id: "orange", label: "Orange", hex: "#ff8000" },
  { id: "darkOrange", label: "Dark Orange", hex: "#ffb266" },
  { id: "grey", label: "Grey", hex: "#bdc8f0" },
  { id: "black", label: "Black", hex: "#29314f" },
];

export type OrderStatus = "Complete" | "Pending" | "Cancel" | "Hold";
export type Payment = "Card" | "UPI" | "COD";

export const orders = [
  { id: "790955", customer: "Joseph William", branch: "USA", payment: "Card" as Payment, qty: 6, date: "10 Sept 2026", status: "Pending" as OrderStatus },
  { id: "790956", customer: "Emma Watson", branch: "Canada", payment: "Card" as Payment, qty: 1, date: "09 Sept 2026", status: "Complete" as OrderStatus },
  { id: "790957", customer: "Rahul Sharma", branch: "India", payment: "UPI" as Payment, qty: 2, date: "08 Sept 2026", status: "Pending" as OrderStatus },
  { id: "790958", customer: "Oliver Smith", branch: "UK", payment: "COD" as Payment, qty: 1, date: "07 Sept 2026", status: "Cancel" as OrderStatus },
  { id: "790959", customer: "Liam Brown", branch: "Australia", payment: "Card" as Payment, qty: 1, date: "06 Sept 2026", status: "Hold" as OrderStatus },
  { id: "790960", customer: "Hans Muller", branch: "USA", payment: "UPI" as Payment, qty: 1, date: "05 Sept 2026", status: "Pending" as OrderStatus },
  { id: "790961", customer: "Jean Dupont", branch: "USA", payment: "Card" as Payment, qty: 1, date: "04 Sept 2026", status: "Hold" as OrderStatus },
  { id: "790962", customer: "Yuki Tanaka", branch: "UK", payment: "UPI" as Payment, qty: 2, date: "03 Sept 2026", status: "Pending" as OrderStatus },
  { id: "790963", customer: "Ahmed Khan", branch: "USA", payment: "COD" as Payment, qty: 1, date: "02 Sept 2026", status: "Complete" as OrderStatus },
  { id: "790964", customer: "Wei Lim", branch: "UK", payment: "Card" as Payment, qty: 2, date: "01 Sept 2026", status: "Pending" as OrderStatus },
  { id: "790965", customer: "Carlos Silva", branch: "USA", payment: "UPI" as Payment, qty: 1, date: "31 Aug 2026", status: "Complete" as OrderStatus },
  { id: "790966", customer: "Thabo Nkosi", branch: "UK", payment: "COD" as Payment, qty: 1, date: "30 Aug 2026", status: "Pending" as OrderStatus },
  { id: "790967", customer: "Marco Rossi", branch: "USA", payment: "Card" as Payment, qty: 1, date: "29 Aug 2026", status: "Complete" as OrderStatus },
];

export const growthSeries = {
  investment: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75],
  loss: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75],
  profit: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
  maintenance: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0],
};

export const orderSparkline = {
  month: [45, 66, 41, 89, 25, 44, 9, 54],
  year: [35, 44, 9, 54, 45, 66, 41, 69],
};

export const bajajArea = [0, 15, 10, 50, 30, 40, 25];

export const stocks = [
  { name: "Bajaj Finserv", change: "10% Profit", value: "$1839.00", up: true },
  { name: "TTML", change: "10% Loss", value: "$100.00", up: false },
  { name: "Reliance", change: "10% Profit", value: "$200.00", up: true },
  { name: "TTML", change: "10% Loss", value: "$189.00", up: false },
  { name: "Stolon", change: "10% Loss", value: "$189.00", up: false },
];
