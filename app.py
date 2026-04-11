from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from models import db, Expense

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create database
with app.app_context():
    db.create_all()

# FRONTEND ROUTE
@app.route('/')
def home():
    return render_template('index.html')

# CREATE
@app.route('/expenses', methods=['POST'])
def add_expense():
    data = request.json

    new_expense = Expense(
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        date=data.get('date', '')
    )

    db.session.add(new_expense)
    db.session.commit()

    return jsonify(new_expense.to_dict()), 201

# READ ALL
@app.route('/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([e.to_dict() for e in expenses])

# READ ONE
@app.route('/expenses/<int:id>', methods=['GET'])
def get_expense(id):
    expense = Expense.query.get_or_404(id)
    return jsonify(expense.to_dict())

# UPDATE
@app.route('/expenses/<int:id>', methods=['PUT'])
def update_expense(id):
    expense = Expense.query.get_or_404(id)
    data = request.json

    expense.amount = data.get('amount', expense.amount)
    expense.category = data.get('category', expense.category)
    expense.description = data.get('description', expense.description)
    expense.date = data.get('date', expense.date)

    db.session.commit()

    return jsonify(expense.to_dict())

# DELETE
@app.route('/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)

    db.session.delete(expense)
    db.session.commit()

    return jsonify({"message": "Deleted successfully"})

# RUN APP (ALWAYS LAST)
if __name__ == '__main__':
    app.run(debug=True)

