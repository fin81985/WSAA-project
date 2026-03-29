from flask import Flask
from models import db, Expense
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Create database
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Expense Tracker API is running!"

if __name__ == '__main__':
    app.run(debug=True)


