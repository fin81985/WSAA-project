const API = "/books";

function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(String(text)));
    return div.innerHTML;
}

function showAlert(message, type = "success") {
    const area = document.getElementById("alertArea");
    area.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
    setTimeout(() => { area.innerHTML = ""; }, 3000);
}

async function loadBooks() {
    const res = await fetch(API);
    if (!res.ok) {
        showAlert("Failed to load books.", "danger");
        return;
    }
    const books = await res.json();
    const tbody = document.getElementById("bookTableBody");
    tbody.innerHTML = books.map(b => `
        <tr id="row-${b.id}">
            <td>${escapeHtml(b.id)}</td>
            <td>${escapeHtml(b.title)}</td>
            <td>${escapeHtml(b.author)}</td>
            <td>${escapeHtml(b.year)}</td>
            <td>${escapeHtml(b.isbn)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editBook(${b.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteBook(${b.id})">Delete</button>
            </td>
        </tr>`).join("");
}

async function deleteBook(id) {
    if (!confirm("Delete this book?")) return;
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (res.ok) {
        showAlert("Book deleted.");
        loadBooks();
    } else {
        showAlert("Failed to delete book.", "danger");
    }
}

async function editBook(id) {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) {
        showAlert("Failed to load book details.", "danger");
        return;
    }
    const b = await res.json();
    document.getElementById("bookId").value = b.id;
    document.getElementById("title").value = b.title;
    document.getElementById("author").value = b.author;
    document.getElementById("year").value = b.year;
    document.getElementById("isbn").value = b.isbn;
    document.getElementById("formTitle").textContent = "Edit Book";
    document.getElementById("cancelBtn").classList.remove("d-none");
}

function resetForm() {
    document.getElementById("bookForm").reset();
    document.getElementById("bookId").value = "";
    document.getElementById("formTitle").textContent = "Add New Book";
    document.getElementById("cancelBtn").classList.add("d-none");
}

document.getElementById("cancelBtn").addEventListener("click", resetForm);

document.getElementById("bookForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = document.getElementById("bookId").value;
    const payload = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: parseInt(document.getElementById("year").value),
        isbn: document.getElementById("isbn").value,
    };
    const url = id ? `${API}/${id}` : API;
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (res.ok) {
        showAlert(id ? "Book updated." : "Book added.");
        resetForm();
        loadBooks();
    } else {
        const err = await res.json().catch(() => ({}));
        showAlert(err.error || "Failed to save book.", "danger");
    }
});

loadBooks();
