# AgriShop — MongoDB Backend Setup

## Project Structure

```
agrishop-backend/
├── server.js          ← Express app entry point
├── seed.js            ← Seed initial products into MongoDB
├── .env               ← MongoDB URI & port config
├── package.json
├── models/
│   ├── Product.js     ← Product schema
│   ├── Cart.js        ← Cart schema (session-based)
│   └── Order.js       ← Order schema
├── routes/
│   ├── products.js    ← CRUD for products
│   ├── cart.js        ← Cart add/remove/clear
│   └── orders.js      ← Checkout & order history
└── public/
    ├── index.html     ← Your existing HTML (copy here)
    ├── style.css      ← Your existing CSS (copy here)
    └── main.js        ← Updated JS with MongoDB API calls
```

---

## Setup Steps

### 1. Install Node.js & MongoDB
- Node.js: https://nodejs.org
- MongoDB Community: https://www.mongodb.com/try/download/community
  OR use **MongoDB Atlas** (free cloud): https://cloud.mongodb.com

### 2. Install dependencies
```bash
cd agrishop-backend
npm install
```

### 3. Configure .env
```
# Local MongoDB
MONGO_URI=mongodb://localhost:27017/agrishop

# OR MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/agrishop

PORT=5000
```

### 4. Seed products into database
```bash
node seed.js
```

### 5. Copy your frontend files
Copy your `index.html` and `style.css` into the `public/` folder.
The `main.js` in `public/` already has MongoDB API calls built in.

### 6. Start the server
```bash
# Development (auto-restart on change)
npm run dev

# Production
npm start
```

### 7. Open the app
Visit: **http://localhost:5000**

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?tag=Dairy&stock=true` | Filter products |
| GET | `/api/products?minPrice=10&maxPrice=50` | Price range filter |
| POST | `/api/products` | Add a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |
| GET | `/api/cart/:sessionId` | Get user's cart |
| POST | `/api/cart/:sessionId/add` | Add item to cart |
| DELETE | `/api/cart/:sessionId/remove/:productId` | Remove item |
| DELETE | `/api/cart/:sessionId/clear` | Clear entire cart |
| POST | `/api/orders/checkout/:sessionId` | Place order |
| GET | `/api/orders/:sessionId` | Get order history |
| GET | `/api/health` | Check DB connection |

---

## MongoDB Atlas (Cloud) — Quick Setup
1. Go to https://cloud.mongodb.com → Create free account
2. Create a **free M0 cluster**
3. Create a database user (username + password)
4. Click **Connect** → **Drivers** → copy the connection string
5. Replace `<password>` with your password in `.env`