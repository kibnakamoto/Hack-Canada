# CanaLocal

During Hack-Canada we decided to fight a major Canadian problem, the dying local businesses replaced by international business tycoons. Introducing CanaLocal, a website as well as a reactiv appclip built for a wide range of Canadian businesses for making their products easier to find. Simply scan a QR code and see all their products and check availability.
Canalocal is a marketplace for local Canadian businesses. Browse shops, add stuff to your cart, and buy from shops in your area. Businesses get a storefront to list products and manage their shop.

Built for Hack Canada 2026.

---

## What it does

- **Shoppers** – Discover shops by location, browse products, add to cart
- **Vendors** – Create a store profile, add products, set prices, manage your listings
- **AI helper** – A chatbot that helps business owners figure out how to use the platform (especially handy if you’re not super tech-savvy)

We use Auth0 for login so that sellers can sign in safely and store business information such as services/products and their costs

---

## How to run it

**Backend** (Flask):
h
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip3 install -r requirements.txt
in project home folder:
python3 app.py

in ecommerce-app:
npm install # to setup
npm run dev # to run project