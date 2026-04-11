let chart = null;
let editId = null;

// Load all expenses
function loadExpenses() {
    fetch('/expenses')
        .then(res => res.json())
        .then(data => {
            let html = "";
            let total = 0;

            data.forEach(expense => {
                total += parseFloat(expense.amount);

                html += `
                    <div class="card">
                        <p><b>€${expense.amount}</b></p>
                        <p>${expense.category}</p>
                        <p>${expense.description}</p>
                        <p>${expense.date}</p>

                        <button onclick="startEdit(${expense.id}, ${expense.amount}, '${expense.category}', '${expense.description}', '${expense.date}')">
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

            updateChart(data);
        });
}

// Add or UPDATE expense
function addExpense() {
    const expense = {
        amount: parseFloat(document.getElementById("amount").value),
        category: document.getElementById("category").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value
    };

    if (editId !== null) {
        fetch(`/expenses/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        }).then(() => {
            resetForm();
            loadExpenses();
        });

    } else {
        fetch('/expenses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
        }).then(() => {
            resetForm();
            loadExpenses();
        });
    }
}

// Start editing
function startEdit(id, amount, category, description, date) {
    editId = id;

    document.getElementById("amount").value = amount;
    document.getElementById("category").value = category;
    document.getElementById("description").value = description;
    document.getElementById("date").value = date;

    document.getElementById("submitBtn").innerText = "Update Expense";
}

// Reset form
function resetForm() {
    editId = null;

    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";

    document.getElementById("submitBtn").innerText = "Add Expense";
}

// Delete expense
function deleteExpense(id) {
    fetch(`/expenses/${id}`, {
        method: 'DELETE'
    }).then(() => loadExpenses());
}

// Chart
function updateChart(data) {
    const categories = {};

    data.forEach(expense => {
        const cat = expense.category;

        if (categories[cat]) {
            categories[cat] += parseFloat(expense.amount);
        } else {
            categories[cat] = parseFloat(expense.amount);
        }
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    const canvas = document.getElementById('expenseChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values
            }]
        }
    });
}

// Load on start
loadExpenses();
