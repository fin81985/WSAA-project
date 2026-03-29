import os

from flask import Flask, jsonify, request, abort, render_template
from sqlalchemy.exc import IntegrityError
from models import db, Book

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/books", methods=["GET"])
def get_books():
    books = Book.query.all()
    return jsonify([b.to_dict() for b in books])


@app.route("/books/<int:book_id>", methods=["GET"])
def get_book(book_id):
    book = Book.query.get_or_404(book_id)
    return jsonify(book.to_dict())


@app.route("/books", methods=["POST"])
def create_book():
    data = request.get_json()
    if not data or not all(k in data for k in ("title", "author", "year", "isbn")):
        return jsonify({"error": "Missing required fields: title, author, year, isbn"}), 400
    try:
        year = int(data["year"])
    except (ValueError, TypeError):
        return jsonify({"error": "year must be an integer"}), 400
    book = Book(
        title=data["title"],
        author=data["author"],
        year=year,
        isbn=data["isbn"],
    )
    db.session.add(book)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A book with that ISBN already exists"}), 409
    return jsonify(book.to_dict()), 201


@app.route("/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    if "title" in data:
        book.title = data["title"]
    if "author" in data:
        book.author = data["author"]
    if "year" in data:
        try:
            book.year = int(data["year"])
        except (ValueError, TypeError):
            return jsonify({"error": "year must be an integer"}), 400
    if "isbn" in data:
        book.isbn = data["isbn"]
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A book with that ISBN already exists"}), 409
    return jsonify(book.to_dict())


@app.route("/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted"})


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug)
