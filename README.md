# 📄 Expense Tracker – Project Report (WSAA)

---

## 1. Project Title
**Expense Tracker Web Application using Flask REST API**

## 2. Introduction
This project is a full-stack web application that allows users to track personal expenses. It demonstrates the creation and consumption of a **RESTful API** using **Flask**, along with a frontend built using **HTML, CSS, and JavaScript**.

The system supports full **CRUD** (Create, Read, Update, Delete) operations and stores data in a **SQLite** database.

## 3. Objectives
* Build a RESTful API using Flask
* Perform CRUD operations on expense data
* Store data in a SQLite database
* Create a frontend that communicates with the API
* Visualize data using charts
* Demonstrate full-stack development skills

## 4. Technologies Used

### Backend
* **Python**
* **Flask**
* **Flask-SQLAlchemy**
* **Flask-CORS**
* **SQLite**

### Frontend
* **HTML**
* **CSS**
* **JavaScript** (Fetch API)
* **Chart.js**

---

## 5. System Features
*  Add new expenses
*  View all expenses
*  Update existing expenses
*  Delete expenses
*  Display total spending
*  Visualize expenses using a pie chart
*  Responsive user interface

## 6. System Architecture
The application follows a **client-server architecture**:

1.  **Frontend (Client):** HTML/CSS/JavaScript interface that sends requests to the backend API.
2.  **Backend (Server):** Flask REST API that handles requests and interacts with the database.
3.  **Database:** SQLite database stores all expense records.

---

## 7. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/expenses` | Get all expenses |
| **GET** | `/expenses/<id>` | Get single expense |
| **POST** | `/expenses` | Add new expense |
| **PUT** | `/expenses/<id>` | Update expense |
| **DELETE** | `/expenses/<id>` | Delete expense |

## 8. Database Design

### Expense Table
| Field | Type |
| :--- | :--- |
| `id` | Integer (Primary Key) |
| `amount` | Float |
| `category` | String |
| `description` | String |
| `date` | String |

---

## 9. How to Run the Project

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
2.  **Run the Flask server:**
    ```bash
    python app.py
    ```
3. **Open browser:**

Open your browser and visit:

[http://127.0.0.1:5000/](http://127.0.0.1:5000/)


## 10. Testing
Testing was conducted using:
* **Browser:** Frontend interaction and UI responsiveness.
* **Postman:** API endpoint validation and payload testing.
* **Manual:** Input validation and data persistence checks.


---

## 12. Conclusion
This project successfully demonstrates a full-stack web application using Flask REST API, SQLite database, and a JavaScript frontend. It validates a core understanding of backend development, API design, and seamless frontend integration.

## 13. References
* [Flask Documentation](https://flask.palletsprojects.com/)
* [SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)
* [MDN Web Docs](https://developer.mozilla.org/)
* [Chart.js](https://www.chartjs.org/)


