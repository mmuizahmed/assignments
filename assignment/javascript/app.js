// Question 1: Variable Declarations and Initialization
let productName = "Laptop";
let price = 999.99;
let inStock = true;
console.log(productName, price, inStock);

// Question 2: Mathematical Operations
console.log(27 % 4);
console.log(12 ** 2);
let value = 8;
value++;
console.log(value);
let count = 15;
count -= 2;
console.log(count);

// Question 3: String Concatenation and Case Conversion
let firstName = "alex";
let lastName = "SMITH";
let fullName = firstName + " " + lastName;
fullName = fullName.charAt(0).toUpperCase() + fullName.slice(1).toLowerCase();
console.log(fullName);
console.log(fullName.length);

// Question 4: if-else Conditional Logic
let temperature = 25;
if (temperature > 30) {
    console.log("Hot day");
} else if (temperature >= 20 && temperature <= 30) {
    console.log("Pleasant day");
} else {
    console.log("Cold day");
}

// Question 5: Comparison Operators
console.log(15 === "15");
console.log(20 > 15 && 20 < 25);
console.log(10 != 10 || 5 > 3);

// Question 6: Array Manipulation - Basics
let colors = ["red", "green", "blue"];
colors.push("yellow");
colors.shift();
colors.splice(1, 0, "purple");
console.log(colors);
console.log(colors.length);

// Question 7: Array Manipulation - splice()
let fruits = ["apple", "banana", "cherry", "date", "elderberry"];
fruits.splice(2, 1);
fruits.splice(2, 1, "dragonfruit");
let middleThree = fruits.splice(1, 3);
console.log(fruits);
console.log(middleThree);

// Question 8: for Loop - Number Sequence
let sum = 0;
for (let i = 1; i <= 10; i++) {
    if (i === 5) continue;
    if (i === 8) break;
    console.log(i);
    sum += i;
}
console.log(sum);

// Question 9: Nested for Loop - Pattern
for (let i = 1; i <= 5; i++) {
    let row = "";
    for (let j = 1; j <= i; j++) {
        row += "*";
    }
    console.log(row);
}

// Question 10: String Methods - Search and Extract
let text = "The quick brown fox jumps over the lazy dog";
console.log(text.indexOf("fox"));
console.log(text.slice(10, 19));
console.log(text.includes("dog"));
console.log(text.charAt(10));

// Question 11: String Replacement
let sentence = "I love JavaScript and JavaScript is awesome";
console.log(sentence.replace("JavaScript", "coding"));
console.log(sentence.replaceAll("JavaScript", "JS"));
console.log(sentence.replace("awesome", "AWESOME"));

// Question 12: Number Rounding and Formatting
let num = 123.456789;
console.log(num.toFixed(2));
console.log(Math.round(num));
console.log(Math.floor(num));
console.log(Math.ceil(num));
console.log(num.toFixed(4));

// Question 13: Random Number Generation
console.log(Math.floor(Math.random() * 100) + 1);
console.log(Math.random().toFixed(3));
console.log(Math.floor(Math.random() * 26) + 50);

// Question 14: Type Conversion
console.log(Number("123"));
console.log(parseFloat("45.67"));
console.log(String(789));
console.log(typeof Boolean("true"));

// Question 15: Date and Time Operations
let now = new Date();
console.log(now.getFullYear());
console.log(now.getMonth());
console.log(now.getDate());
console.log(now.getHours());
let month = String(now.getMonth() + 1).padStart(2, "0");
let day = String(now.getDate()).padStart(2, "0");
console.log(now.getFullYear() + "-" + month + "-" + day);
let christmas = new Date(2024, 11, 25);
console.log(christmas);

// Question 16: Function - Basic Calculator
function calculate(a, b, operator) {
    if (operator === "+") return a + b;
    if (operator === "-") return a - b;
    if (operator === "*") return a * b;
    if (operator === "/") {
        if (b === 0) return "Error: Division by zero";
        return a / b;
    }
}
console.log(calculate(10, 5, "+"));
console.log(calculate(10, 0, "/"));

// Question 17: Function - Local vs Global Variables
var globalCounter = 0;

function incrementCounter() {
    var globalCounter = 0;
    globalCounter++;
    console.log("Local:", globalCounter);
    window.globalCounter++;
    console.log("Global:", window.globalCounter);
}

incrementCounter();
incrementCounter();

// Question 18: switch Statement - Day of Week
function getDayName(day) {
    switch (day) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        default: return "Invalid day";
    }
}
console.log(getDayName(3));
console.log(getDayName(9));

// Question 19: while Loop - Countdown
let timer = 10;
while (timer >= 1) {
    console.log(timer);
    timer--;
}
console.log("Blast off!");

let n = 5;
let factorial = 1;
while (n > 0) {
    factorial *= n;
    n--;
}
console.log(factorial);

// Question 20: do...while Loop - User Input Simulation
let enteredPassword = "";
let attempts = 0;
let passwords = ["wrong", "nope", "tryagain", "secret123"];

do {
  enteredPassword = passwords[attempts];
  attempts++;
  console.log("Attempt", attempts, ":", enteredPassword);
} while (enteredPassword !== "secret123" && attempts < 5);

// Question 21: Array Methods with for Loop
let numbers = [12, 45, 78, 23, 56, 89, 34];

let max = numbers[0];
for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] > max) max = numbers[i];
}
console.log(max);

let total = 0;
for (let i = 0; i < numbers.length; i++) {
    total += numbers[i];
}
console.log(total / numbers.length);

let above50 = [];
for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] > 50) above50.push(numbers[i]);
}
console.log(above50);

let reversed = [];
for (let i = numbers.length - 1; i >= 0; i--) {
    reversed.push(numbers[i]);
}
console.log(reversed);

// Question 22: Event Handling Simulation
function handleClick() {
    let username = document.getElementById("username").value;
    if (username === "") {
        alert("Please enter a username");
        return;
    }
    document.getElementById("greeting").textContent = "Welcome, " + username + "!";
    document.getElementById("username").value = "";
}

// Question 23: Form Validation Function
function validateForm(email, password) {
    if (!email.includes("@")) {
        console.log("Invalid email: must contain @");
        return false;
    }
    if (password.length < 8) {
        console.log("Invalid password: must be at least 8 characters");
        return false;
    }
    return true;
}
console.log(validateForm("user@test.com", "password123"));
console.log(validateForm("usertest.com", "pass"));
console.log(validateForm("a@b.com", "short"));

// Question 24: Temperature Converter
function convertTemperature(temp, unit) {
    if (unit === "C") {
        return Number(((temp * 9 / 5) + 32).toFixed(1));
    }
    if (unit === "F") {
        return Number(((temp - 32) * 5 / 9).toFixed(1));
    }
}
console.log(convertTemperature(25, "C"));
console.log(convertTemperature(77, "F"));

// Question 25: Shopping Cart Array Operations
let cart = [];

function addItem(name, price) {
    cart.push({ name, price });
}

function removeItem(name) {
    cart = cart.filter(function (item) {
        return item.name !== name;
    });
}

function calculateTotal() {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;
    }
    return total;
}

function applyDiscount(percent) {
    return calculateTotal() - (calculateTotal() * percent / 100);
}

function listItems() {
    return cart.map(function (item) {
        return item.name;
    });
}

addItem("Shirt", 25);
addItem("Jeans", 50);
addItem("Hat", 15);
console.log(calculateTotal());
console.log(applyDiscount(10));
console.log(listItems());
removeItem("Hat");
console.log(listItems());
console.log(calculateTotal());
