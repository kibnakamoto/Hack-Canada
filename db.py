import mysql.connector
import json

def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="YOUR_PASSWORD",
        database="hc_platform"
    )

# for the website - only fetch company data
def get_business(company_name):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    query = "SELECT * FROM businesses WHERE company_name = %s"
    cursor.execute(query, (company_name,))
    business = cursor.fetchone()

    cursor.close()
    connection.close()

    return business

# fetch everything for the reactiv app
def get_all_businesses_data(company_name):
    connection = get_connection()
    cursor = connection.cursor(dictionary=True)
    business_query = "SELECT * FROM businesses WHERE company_name = %s"
    cursor.execute(business_query, (company_name,))
    business = cursor.fetchone()
    if not business:
        cursor.close()
        connection.close()
        return None
    services = json.loads(business["services_offered"])
    products_query = "SELECT name, description, price, stock_quantity FROM products WHERE business_id = %s"
    cursor.execute(products_query, (business["id"],))
    products = cursor.fetchall()
    cursor.close()
    connection.close()
    return {
        "business": {
            "company_name": business["company_name"],
            "registered_address": business["registered_address"],
            "status": business["status"],
            "start_date": str(business["start_date"])
        },
        "services": services,
        "products": products
    }

# data = get_business_full_data("Lakeshore Bread & Pastry")
# print(data)