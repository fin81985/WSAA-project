import random
from datetime import datetime, timedelta
from app import app, db, Expense

# Realistic categories
categories = [
    "Food", "Transport", "Shopping", "Bills",
    "Entertainment", "Health", "Education", "Travel"
]

descriptions = {
    "Food": ["Lunch", "Dinner", "Coffee", "Groceries"],
    "Transport": ["Bus ticket", "Train", "Taxi", "Fuel"],
    "Shopping": ["Clothes", "Shoes", "Electronics", "Accessories"],
    "Bills": ["Electricity", "Water", "Internet", "Rent"],
    "Entertainment": ["Cinema", "Netflix", "Concert", "Games"],
    "Health": ["Pharmacy", "Doctor visit", "Gym"],
    "Education": ["Books", "Course fee", "Stationery"],
    "Travel": ["Hotel", "Flight", "Food trip", "Tour"]
}

# Generate random date in last 90 days
def random_date():
    start = datetime.now() - timedelta(days=90)
    random_days = random.randint(0, 90)
    return (start + timedelta(days=random_days)).strftime("%Y-%m-%d")

# Number of fake records (change this: 100 / 200 / 500)
NUM_RECORDS = 200

fake_data = []

for _ in range(NUM_RECORDS):
    category = random.choice(categories)

    fake_data.append({
        "amount": round(random.uniform(5, 200), 2),
        "category": category,
        "description": random.choice(descriptions[category]),
        "date": random_date()
    })

# Insert into database
with app.app_context():
    for item in fake_data:
        expense = Expense(
            amount=item["amount"],
            category=item["category"],
            description=item["description"],
            date=item["date"]
        )
        db.session.add(expense)

    db.session.commit()

print(f"✅ {NUM_RECORDS} fake expenses added successfully!")

