from flask import Flask, redirect, request, jsonify
from auth import make_auth0
import json
import os
import time

app = Flask(__name__)

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
        if "storeName" in data:
            users[user_id]["storeName"] = data.get("storeName")
        if "logoUrl" in data:
            users[user_id]["logoUrl"] = data.get("logoUrl")
        if "city" in data:
            users[user_id]["city"] = data.get("city")
        save_users(users)
        return jsonify(users[user_id])
    return jsonify(users.get(user_id, {"storeName": None, "logoUrl": None}))

@app.route("/api/shops")
async def get_shops():
    users = load_users()
    shops = []
    for user_id, profile in users.items():
        if profile.get("storeName"):
            shops.append({
                "vendorId": user_id,
                "storeName": profile.get("storeName"),
                "logoUrl": profile.get("logoUrl"),
                "city": profile.get("city")
            })
    return jsonify(shops)

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
    for product in products:
        vendor_id = product.get('vendorId')
        if vendor_id and vendor_id in users:
            if users[vendor_id].get('storeName'):
                product['vendorName'] = users[vendor_id]['storeName']
            if users[vendor_id].get('logoUrl'):
                product['vendorLogo'] = users[vendor_id]['logoUrl']
    return jsonify(products)

@app.route("/api/user/products")
async def get_user_products():
    session = await make_auth0().get_session()
    if not session:
        return jsonify({"error": "Unauthorized"}), 401
    user_id = session['user']['sub']
    products = load_products()
    return jsonify([p for p in products if p.get('vendorId') == user_id])

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
    store_name = user_profile.get('storeName') or user.get('name') or user.get('nickname') or user.get('email')
    new_product = {
        "id": int(time.time()),
        "vendorId": user['sub'],
        "vendorName": store_name,
        "name": data.get('name'),
        "price": float(data.get('price')),
        "category": data.get('category'),
        "image": data.get('image') or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        "isNew": True
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
    if product.get('vendorId') != user_id:
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
    if product.get('vendorId') != user_id:
        return jsonify({"error": "Forbidden"}), 403
    if "price" in data:
        product["price"] = float(data["price"])
    if "name" in data:
        product["name"] = data["name"]
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
