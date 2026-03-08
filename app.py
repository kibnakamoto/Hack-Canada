from flask import Flask, redirect, request, jsonify
from auth import make_auth0
from chatbot import ask_chatbot
import json
import os
import time

app = Flask(__name__)

# Add this route
@app.route("/api/chat", methods=["POST"])
async def chat():
    data = request.json
    user_message = data.get("message", "")
    history = data.get("history", [])
    reply = await ask_chatbot(user_message, history)
    return jsonify({"reply": reply})

@app.route("/login")
async def login():
    redirect_url = await make_auth0().start_interactive_login()
    return redirect(redirect_url)

@app.route("/callback")
async def callback():
    await make_auth0().complete_interactive_login(request.url)
    return redirect("http://localhost:5173/")

@app.route("/logout")
async def logout():
    from auth0_server_python.auth_types import LogoutOptions
    options = LogoutOptions(return_to="http://localhost:5173/")
    logout_url = await make_auth0().logout(options)
    return redirect(logout_url)

@app.route("/profile")
async def profile():
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    return jsonify(session['user'])

USERS_FILE = "users.json"

def load_users():
    if not os.path.exists(USERS_FILE):
        return {}
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)

@app.route("/api/user/profile", methods=["GET", "POST"])
async def user_profile():
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = session['user']['sub']
    users = load_users()
    if request.method == "POST":
        data = request.json
        if user_id not in users:
            users[user_id] = {}
        if "company_name" in data:
            users[user_id]["company_name"] = data.get("company_name")
        if "registered_address" in data:
            users[user_id]["registered_address"] = data.get("registered_address")
        save_users(users)
        return jsonify(users[user_id])
    return jsonify(users.get(user_id, {"company_name": None}))

@app.route("/api/shops")
async def get_shops():
    users = load_users()
    shops = []
    for user_id, profile in users.items():
        if profile.get("company_name"):
            shops.append({
                "auth0_user_id": user_id,
                "company_name": profile.get("company_name"),
                "registered_address": profile.get("registered_address")
            })
    return jsonify(shops)

@app.route("/api/shops/<auth0_user_id>")
async def get_shop(auth0_user_id):
    users = load_users()
    profile = users.get(auth0_user_id, {})
    if not profile.get("company_name"):
        return jsonify({"error": "Shop not found"}), 404
    return jsonify({
        "auth0_user_id": auth0_user_id,
        "company_name": profile.get("company_name"),
        "registered_address": profile.get("registered_address")
    })

PRODUCTS_FILE = "products.json"

def load_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, "r") as f:
        return json.load(f)

def save_products(products):
    with open(PRODUCTS_FILE, "w") as f:
        json.dump(products, f, indent=2)

@app.route("/api/products")
def get_products():
    products = load_products()
    users = load_users()
    auth0_user_id_filter = request.args.get("auth0_user_id")
    if auth0_user_id_filter:
        products = [p for p in products if p.get("auth0_user_id") == auth0_user_id_filter]
    for product in products:
        auth0_user_id = product.get('auth0_user_id')
        if auth0_user_id and auth0_user_id in users:
            if users[auth0_user_id].get('company_name'):
                product['company_name'] = users[auth0_user_id]['company_name']
    return jsonify(products)

@app.route("/api/user/products")
async def get_user_products():
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = session['user']['sub']
    products = load_products()
    return jsonify([p for p in products if p.get('auth0_user_id') == user_id])

@app.route("/api/products", methods=["POST"])
async def add_product():
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user = session['user']
    data = request.json
    products = load_products()
    users = load_users()
    user_profile = users.get(user['sub'], {})
    company_name = user_profile.get('company_name') or user.get('name') or user.get('nickname') or user.get('email')
    new_product = {
        "id": int(time.time()),
        "auth0_user_id": user['sub'],
        "company_name": company_name,
        "name": data.get('name'),
        "price": float(data.get('price')),
        "description": data.get('description'),
        "stock_quantity": int(data.get('stock_quantity', 0)),
        "category": data.get('category'),
        "image": data.get('image') or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        "is_new": True
    }
    products.append(new_product)
    save_products(products)
    return jsonify(new_product), 201

@app.route("/api/products/<int:id>", methods=["DELETE"])
async def delete_product(id):
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = session['user']['sub']
    products = load_products()
    product = next((p for p in products if p['id'] == id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    if product.get('auth0_user_id') != user_id:
        return jsonify({"error": "Forbidden"}), 403
    save_products([p for p in products if p['id'] != id])
    return jsonify({"success": True})

@app.route("/api/products/<int:id>", methods=["PATCH"])
async def update_product(id):
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = session['user']['sub']
    data = request.json
    products = load_products()
    product = next((p for p in products if p['id'] == id), None)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    if product.get('auth0_user_id') != user_id:
        return jsonify({"error": "Forbidden"}), 403
    if "price" in data:
        product["price"] = float(data["price"])
    if "name" in data:
        product["name"] = data["name"]
    if "description" in data:
        product["description"] = data["description"]
    if "stock_quantity" in data:
        product["stock_quantity"] = int(data["stock_quantity"])
    if "category" in data:
        product["category"] = data["category"]
    if "image" in data:
        product["image"] = data["image"]
    save_products(products)
    return jsonify(product)

@app.route("/")
def home():
    return '<a href="/login">Login with Auth0</a>'

if __name__ == "__main__":
    app.run(debug=True, port=5000, host="localhost")
