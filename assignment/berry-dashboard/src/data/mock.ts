// Chart decoration and the color dots on the products page.
// Products, users, and orders now come from the backend.

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
