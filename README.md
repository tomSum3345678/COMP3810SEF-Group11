# Node.js-App

Supermarket Web Application

# curl -X POST link/api/products \
     -F "productId=PROD123" \
     -F "productName=Sample Widget" \
     -F "category=Electronics" \
     -F "price=49.99" \
     -F "stock=150" \
     -F "description=A description of the widget." \
     -F "productImage=@/path/to/your/image.jpg"


# curl -X POST link/api/products -F "productId=PROD009" -F "productName=Banana" -F "category=Food" -F "price=10" -F "stock=150" -F "description=A fresh yellow banana, great source of potassium." -F "productImage=@D:\study\Server-side & Cloud\image\banana.jpg"

# curl -X PUT http://localhost:8099/api/products/update/PROD009 -F "price=12.50" -F "description=Freshly updated price for this tasty banana."

# curl -X GET "link/api/products?category=Food"

# curl -X DELETE link/api/products/delete/(productID)



MongoDB Database Tools (Use mongodump.exe)
# Export
.\mongodump --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --out=D:\xampp\htdocs\Node.js-App

# import
.\mongorestore --uri="mongodb+srv://<username>:<passward>@cluster0.sdtvkpd.mongodb.net/supermarket_db" --dir="D:\xampp\htdocs\Node.js-App\supermarket_db"