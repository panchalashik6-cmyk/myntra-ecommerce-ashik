# Myntra Ecommerce - MongoDB Atlas + Admin + Razorpay

This version keeps the existing Myntra-style UI and adds:

- MongoDB Atlas as the product/order database
- Admin dashboard for products, categories and order status
- Add / edit / delete products from Admin
- Add / delete categories from Admin
- Razorpay Standard Checkout for online payments
- Server-side Razorpay signature verification
- COD remains available
- Frontend API URL is configurable with `REACT_APP_API_URL`

## 1. Backend setup

```bash
cd backend
npm install
npm start
```

Copy `.env.example` to `.env` and fill:

- `MONGO_URI` = your MongoDB Atlas connection string
- `JWT_SECRET` = a strong secret
- `EMAIL_USER` / `EMAIL_PASS` = Gmail SMTP credentials if OTP is required
- `ADMIN_SETUP_KEY` = private admin creation key
- `RAZORPAY_KEY_ID` = Razorpay Test/Live Key ID
- `RAZORPAY_KEY_SECRET` = Razorpay Test/Live Key Secret

Never put `RAZORPAY_KEY_SECRET` in the React frontend.

## 2. Frontend setup

```bash
cd frontend/myapp
npm install
npm start
```

For local development:

```env
REACT_APP_API_URL=http://localhost:8080
```

For deployment, change it to the deployed backend URL.

## 3. Create the first admin

Use the existing endpoint:

`POST /user/create-admin`

JSON body:

```json
{
  "setupKey": "YOUR_ADMIN_SETUP_KEY",
  "username": "admin",
  "email": "admin@example.com",
  "password": "YourStrongPassword"
}
```

Then log in with that account. The `ADMIN` button opens `/admin`.

## 4. MongoDB Atlas product flow

Products are loaded with `/products` directly from MongoDB. The Admin dashboard uses the same API to create/update/delete products, so new products appear on the normal Home/Products pages after refresh without adding product data to frontend code.

Categories are stored in MongoDB in the `categories` collection. Products store the category slug.

## 5. Razorpay flow

The frontend never creates a Razorpay order directly.

1. React sends cart product IDs to `POST /payments/razorpay/order`.
2. Backend reads product prices/stock from MongoDB and calculates the final amount.
3. Backend creates a Razorpay order.
4. React opens Razorpay Checkout.
5. Razorpay returns payment ID, order ID and signature.
6. Backend verifies the signature using the secret key.
7. Only after successful verification is the MongoDB order marked paid/placed and stock reduced.

Use Razorpay Test Mode first. Switch to live keys only after testing and configuring payment capture/webhooks in the Razorpay Dashboard.

Deployment configuration updated.

