# WSAA-project

A Flask-based REST API web application for managing a book collection, built as part of the Web Services and Applications for Data Analytics module at ATU.

## Project Structure

```
project/
│── app.py              # Flask application and REST API routes
│── models.py           # SQLAlchemy database model
│── templates/
│    └── index.html     # Bootstrap 5 frontend
│── static/
│    └── script.js      # Vanilla JS (fetch API) for CRUD operations
│── database.db         # SQLite database (auto-created on first run)
│── requirements.txt    # Python dependencies
│── README.md           # This file
```

## Features

- **Create** – Add a new book via the web form
- **Read** – List all books in a table; fetch a single book for editing
- **Update** – Edit an existing book's details
- **Delete** – Remove a book from the collection

## API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/` | Serve the HTML frontend |
| `GET` | `/books` | Return all books as JSON |
| `GET` | `/books/<id>` | Return a single book as JSON |
| `POST` | `/books` | Create a new book |
| `PUT` | `/books/<id>` | Update an existing book |
| `DELETE` | `/books/<id>` | Delete a book |

## Setup & Running

### Prerequisites

- Python 3.10+

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run the application

```bash
python app.py
```

Open your browser at **http://127.0.0.1:5000**

## Technologies Used

- [Flask](https://flask.palletsprojects.com/) – Python web framework
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/) – ORM for SQLite
- [Bootstrap 5](https://getbootstrap.com/) – Responsive CSS framework
- Vanilla JavaScript (Fetch API) – Dynamic frontend without external JS libraries

## Author

fin81985