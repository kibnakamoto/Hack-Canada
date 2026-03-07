from flask import Flask, redirect, request, jsonify
from auth import auth0
import asyncio

app = Flask(__name__)

# Helper to run async Auth0 calls in Flask (which is sync by default)
def run_async(coro):
    return asyncio.run(coro)

@app.route("/login")
def login():
    redirect_url = run_async(auth0.start_interactive_login())
    return redirect(redirect_url)

@app.route("/callback")
def callback():
    run_async(auth0.complete_interactive_login(request.url))
    return redirect("/profile")

@app.route("/logout")
def logout():
    return redirect(run_async(auth0.logout()))

@app.route("/profile")
def profile():
    session = run_async(auth0.get_session())
    if not session:
        return redirect("/login")
    return jsonify(session['user'])

@app.route("/")
def home():
    return '<a href="/login">Login with Auth0</a>'

if __name__ == "__main__":
    app.run(debug=True, port=5000)
