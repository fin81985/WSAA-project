let chart = null;
let editId = null;

// -------------------------
// CATEGORY COLORS
// -------------------------
const categoryColors = {
    Food: "#FF6B6B",
    Transport: "#4D96FF",
    Bills: "#6BCB77",
    Shopping: "#FFD93D",
    Entertainment: "#9D4EDD",
    Other: "#ADB5BD",
    Health: "#FF922B",
    Travel: "#20C997",
    Work: "#4C6EF5",
    Gifts: "#F06595",
    Education: "#339AF0",
    Personal: "#845EF7",
    Savings: "#51CF66",
    Utilities: "#FFB703"
};

// -------------------------
// AUTO COLOR GENERATOR
// -------------------------
function getColorForCategory(category) {
    if (categoryColors[category]) {
        return categoryColors[category];
    }

    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
}

// -------------------------
// LOAD EXPENSES
// -------------------------
function loadExpenses() {
    fetch('/expenses')
        .then(res => res.json())
        .then(data => {

            let html = "";
            let total = 0;

            data.forEach(expense => {
                total += parseFloat(expense.amount);

                const color = getColorForCategory(expense.category);

                html += `
                    <div class="card"
                        style="border-left: 6px solid ${color}; background: ${color}20;">

                        <p><b>€${expense.amount}</b></p>

                        <p>
                            <span class="badge" style="background:${color}">
                                ${expense.category}
                            </span>
                        </p>

                        <p>${expense.description}</p>
                        <p>${expense.date}</p>

                        <button onclick="startEdit(
                            ${expense.id},
                            ${expense.amount},
                            '${escapeQuotes(expense.category)}',
                            '${escapeQuotes(expense.description)}',
                            '${expense.date}'
                        )">
                            Edit
                        </button>

                        <button onclick="deleteExpense(${expense.id})">
                            Delete
                        </button>
                    </div>
                `;
            });

            document.getElementById("expenseList").innerHTML = html;
            document.getElementById("total").innerText = total.toFixed(2);

            // -------------------------
            // TOP CATEGORY
            // -------------------------
            const topCategory = getTopCategory(data);

            const cards = document.querySelectorAll(".summary-card");
            if (cards.length >= 3) {
                cards[2].querySelector("p").innerText = topCategory;
            }

            // -------------------------
            // THIS MONTH TOTAL
            // -------------------------
            const thisMonthTotal = getThisMonthTotal(data);

            if (cards.length >= 2) {
                cards[1].querySelector("p").innerText = `€${thisMonthTotal.toFixed(2)}`;
            }

            updateChart(data);
        });
}

// -------------------------
// ADD / UPDATE EXPENSE
// -------------------------
function addExpense() {
    const expense = {
        amount: parseFloat(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value
    };

    if (!expense.amount || !expense.category) return;

    const url = editId !== null ? `/expenses/${editId}` : '/expenses';
    const method = editId !== null ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    }).then(() => {
        resetForm();
        loadExpenses();
    });
}

// -------------------------
// EDIT
// -------------------------
function startEdit(id, amount, category, description, date) {
    editId = id;

    document.getElementById("amount").value = amount;
    document.getElementById("category").value = category;
    document.getElementById("description").value = description;
    document.getElementById("date").value = date;

    document.getElementById("submitBtn").innerText = "Update Expense";
}

// -------------------------
// RESET FORM
// -------------------------
function resetForm() {
    editId = null;

    document.getElementById("amount").value = "";
    document.getElementById("category").value = "Food";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";

    document.getElementById("submitBtn").innerText = "Add Expense";
}

// -------------------------
// DELETE
// -------------------------
function deleteExpense(id) {
    fetch(`/expenses/${id}`, {
        method: 'DELETE'
    }).then(() => loadExpenses());
}

// -------------------------
// PREMIUM DOUGHNUT CHART
// -------------------------
function updateChart(data) {
    const categories = {};

    data.forEach(expense => {
        const cat = expense.category;
        categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount);
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    const colors = labels.map(label => getColorForCategory(label));

    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const total = values.reduce((a, b) => a + b, 0);

    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: "#ffffff",
                borderWidth: 3,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            cutout: "60%",

            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        padding: 18,
                        font: {
                            size: 14
                        }
                    }
                },

                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percent = ((value / total) * 100).toFixed(1);
                            return `€${value} (${percent}%)`;
                        }
                    }
                }
            }
        }
    });
}

// -------------------------
// TOP CATEGORY
// -------------------------
function getTopCategory(data) {
    const categories = {};

    data.forEach(expense => {
        const cat = expense.category;
        categories[cat] = (categories[cat] || 0) + parseFloat(expense.amount);
    });

    let topCategory = "-";
    let max = 0;

    for (let cat in categories) {
        if (categories[cat] > max) {
            max = categories[cat];
            topCategory = cat;
        }
    }

    return topCategory;
}

// -------------------------
// THIS MONTH TOTAL
// -------------------------
function getThisMonthTotal(data) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let total = 0;

    data.forEach(expense => {
        const date = new Date(expense.date);

        if (
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
        ) {
            total += parseFloat(expense.amount);
        }
    });

    return total;
}

// -------------------------
// SAFE STRING HANDLING
// -------------------------
function escapeQuotes(str) {
    return String(str).replace(/'/g, "\\'");
}

// -------------------------
// INIT
// -------------------------
loadExpenses();



