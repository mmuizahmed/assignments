var totalBudget = 0;
var expenses    = [];

window.onload = function () {

    var savedBudget = localStorage.getItem("muiz_budget");
    if (savedBudget !== null) {
        totalBudget = parseFloat(savedBudget);
    }

    var savedRaw = localStorage.getItem("muiz_expenses");
    if (savedRaw !== null && savedRaw !== "") {
        var entries = savedRaw.split("~~");
        for (var i = 0; i < entries.length; i++) {
            if (entries[i] !== "") {
                var parts = entries[i].split("|");
                expenses.push({ name: parts[0], price: parts[1] });
            }
        }
    }

    updateDisplay();
    renderList();
};


function saveData() {
    localStorage.setItem("muiz_budget", totalBudget);
    var str = "";
    for (var i = 0; i < expenses.length; i++) {
        str = str + expenses[i].name + "|" + expenses[i].price + "~~";
    }
    localStorage.setItem("muiz_expenses", str);
}


function setBudgetAmount(amount, silent) {
    var val = parseFloat(String(amount).replace(/,/g, ""));

    if (isNaN(val) || val <= 0) {
        if (!silent) alert("Budget must be greater than zero.");
        return { ok: false, error: "Budget must be greater than zero." };
    }

    totalBudget = val;
    var input = document.getElementById("budgetInput");
    if (input) input.value = "";

    saveData();
    updateDisplay();
    return { ok: true };
}

function setBudget() {
    var input = document.getElementById("budgetInput");
    if (!input) return;

    var val = input.value;
    if (val === "" || val === null) {
        alert("Please enter a budget amount.");
        return;
    }

    if (!isNaN(input.valueAsNumber) && input.valueAsNumber > 0) {
        val = input.valueAsNumber;
    }

    setBudgetAmount(val);
}


function findExpenseIndex(title) {
    var search = (title || "").trim().toLowerCase();
    if (!search) return -1;

    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].name.toLowerCase() === search) return i;
    }
    for (var j = 0; j < expenses.length; j++) {
        if (expenses[j].name.toLowerCase().indexOf(search) !== -1) return j;
    }
    return -1;
}

function addExpenseItem(title, cost, silent) {
    var name = (title || "").trim();
    var price = parseFloat(cost);

    if (!name || isNaN(price)) {
        if (!silent) alert("Please fill in both the title and cost.");
        return { ok: false, error: "Please fill in both the title and cost." };
    }
    if (price <= 0) {
        if (!silent) alert("Cost must be greater than zero.");
        return { ok: false, error: "Cost must be greater than zero." };
    }
    if (totalBudget === 0) {
        if (!silent) alert("Please set a budget first.");
        return { ok: false, error: "Please set a budget first." };
    }

    expenses.push({ name: name, price: String(price) });

    var titleInput = document.getElementById("expenseTitle");
    var costInput = document.getElementById("expenseCost");
    if (titleInput) titleInput.value = "";
    if (costInput) costInput.value = "";

    saveData();
    updateDisplay();
    renderList();
    return { ok: true };
}

function addExpenseItems(items, silent) {
    if (!items || !items.length) {
        if (!silent) alert("No expenses to add.");
        return { ok: false, error: "No expenses to add." };
    }
    if (totalBudget === 0) {
        if (!silent) alert("Please set a budget first.");
        return { ok: false, error: "Please set a budget first." };
    }

    var added = [];
    var pending = [];

    for (var i = 0; i < items.length; i++) {
        var name = (items[i].title || "").trim();
        var price = parseFloat(items[i].amount);

        if (!name || isNaN(price) || price <= 0) {
            if (!silent) alert("Please fill in both the title and cost.");
            return { ok: false, error: "Invalid item: " + (name || "unknown"), added: added };
        }

        pending.push({ name: name, price: String(price) });
        added.push({ title: name, amount: price });
    }

    for (var j = 0; j < pending.length; j++) {
        expenses.push(pending[j]);
    }

    var titleInput = document.getElementById("expenseTitle");
    var costInput = document.getElementById("expenseCost");
    if (titleInput) titleInput.value = "";
    if (costInput) costInput.value = "";

    saveData();
    updateDisplay();
    renderList();
    return { ok: true, added: added, count: added.length };
}

function addExpense() {
    var title = document.getElementById("expenseTitle").value;
    var cost  = document.getElementById("expenseCost").value;
    addExpenseItem(title, cost);
}

function editExpenseItem(currentTitle, newTitle, newAmount, silent) {
    var idx = findExpenseIndex(currentTitle);
    if (idx === -1) {
        if (!silent) alert("Expense not found.");
        return { ok: false, error: "Could not find \"" + currentTitle + "\"." };
    }

    var name = expenses[idx].name;
    var price = parseFloat(expenses[idx].price);

    if (newTitle != null && String(newTitle).trim() !== "") {
        name = String(newTitle).trim();
    }
    if (newAmount != null && newAmount !== "") {
        price = parseFloat(newAmount);
    }

    if (!name) {
        if (!silent) alert("Title cannot be empty.");
        return { ok: false, error: "Title cannot be empty." };
    }
    if (isNaN(price) || price <= 0) {
        if (!silent) alert("Please enter a valid cost.");
        return { ok: false, error: "Cost must be greater than zero." };
    }

    expenses[idx].name = name;
    expenses[idx].price = String(price);

    saveData();
    updateDisplay();
    renderList();
    return { ok: true, old_title: currentTitle, new_title: name, new_amount: price };
}

function deleteExpense(index) {
    if (confirm("Delete \"" + expenses[index].name + "\"?")) {
        expenses.splice(index, 1);
        saveData();
        updateDisplay();
        renderList();
    }
}


function editExpense(index) {
    var newName = prompt("Edit title:", expenses[index].name);
    if (newName === null) { return; }

    var newPrice = prompt("Edit cost:", expenses[index].price);
    if (newPrice === null) { return; }

    editExpenseItem(expenses[index].name, newName, newPrice);
}


function calcTotalExpenses() {
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
        total = total + parseFloat(expenses[i].price);
    }
    return total;
}


function updateDisplay() {
    var spent   = calcTotalExpenses();
    var balance = totalBudget - spent;

    document.getElementById("displayBudget").innerHTML   = totalBudget.toFixed(0);
    document.getElementById("displayExpenses").innerHTML = spent.toFixed(0);
    document.getElementById("displayBalance").innerHTML  = balance.toFixed(0);

    var balEl = document.getElementById("displayBalance");
    if (balance < 0) {
        balEl.className = "stat-value over-budget";
    } else {
        balEl.className = "stat-value";
    }
}


function renderList() {
    var container = document.getElementById("expenseList");

    if (expenses.length === 0) {
        container.innerHTML = "<p class='empty-msg'>No expenses added yet.</p>";
        return;
    }

    container.innerHTML = "";

    for (var i = 0; i < expenses.length; i++) {

        if (i > 0) {
            var divider = document.createElement("div");
            divider.className = "row-divider";
            container.appendChild(divider);
        }

        var row = document.createElement("div");
        row.className = "expense-row";

        var nameEl = document.createElement("span");
        nameEl.className = "exp-name";
        nameEl.innerHTML = expenses[i].name;

        var amtEl = document.createElement("span");
        amtEl.className = "exp-amount";
        amtEl.innerHTML = parseFloat(expenses[i].price).toFixed(0);

        var actions = document.createElement("div");
        actions.className = "exp-actions";

        var editBtn = document.createElement("button");
        editBtn.className = "btn-icon";
        editBtn.title = "Edit";
        editBtn.setAttribute("onclick", "editExpense(" + i + ")");
        editBtn.innerHTML =
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<path d="M11 4H7C5.9 4 5 4.9 5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V13" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
            + '<path d="M17.5 2.5C18.3 1.7 19.7 1.7 20.5 2.5C21.3 3.3 21.3 4.7 20.5 5.5L12 14L9 15L10 12L17.5 2.5Z" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
            + '</svg>';

        var delBtn = document.createElement("button");
        delBtn.className = "btn-icon";
        delBtn.title = "Delete";
        delBtn.setAttribute("onclick", "deleteExpense(" + i + ")");
        delBtn.innerHTML =
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<path d="M3 6H5H21" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
            + '<path d="M8 6V4C8 3.4 8.4 3 9 3H15C15.6 3 16 3.4 16 4V6M19 6L18 20C18 20.6 17.6 21 17 21H7C6.4 21 6 20.6 6 20L5 6H19Z" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
            + '<path d="M10 11V17" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round"/>'
            + '<path d="M14 11V17" stroke="#5b6df0" stroke-width="1.8" stroke-linecap="round"/>'
            + '</svg>';

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        row.appendChild(nameEl);
        row.appendChild(amtEl);
        row.appendChild(actions);

        container.appendChild(row);
    }
}

function getSummary() {
    var spent = calcTotalExpenses();
    var balance = totalBudget - spent;
    var items = expenses.map(function (e, i) {
        return {
            index: i + 1,
            name: e.name,
            amount: parseFloat(e.price)
        };
    });
    var list = items.map(function (e) {
        return e.name + " (" + e.amount + ")";
    }).join(", ");

    return {
        budget: totalBudget,
        expenses: spent,
        balance: balance,
        expenseList: list || "none",
        expenseCount: expenses.length,
        items: items,
        hasBudget: totalBudget > 0,
        overBudget: balance < 0,
        remainingPercent: totalBudget > 0 ? Math.round((balance / totalBudget) * 100) : 0
    };
}

function saveAndRefresh() {
    saveData();
    updateDisplay();
    renderList();
}

window.setBudget = setBudget;
window.addExpense = addExpense;
window.editExpense = editExpense;
window.deleteExpense = deleteExpense;

window.BudgetApp = {
    setBudgetAmount: setBudgetAmount,
    addExpenseItem: addExpenseItem,
    addExpenseItems: addExpenseItems,
    editExpenseItem: editExpenseItem,
    getSummary: getSummary,
    saveAndRefresh: saveAndRefresh
};
