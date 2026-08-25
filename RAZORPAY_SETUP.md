# Razorpay Setup

## 1. Backend `.env`
Add your Razorpay **test** keys in `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

Do not put `RAZORPAY_KEY_SECRET` in the React/frontend `.env`.

## 2. Start backend

```bash
cd backend
npm install
npm start
```

On startup you should see:

```text
Razorpay keys loaded successfully
```

If you see the warning about missing keys, check the variable names exactly.

## 3. Start frontend

```bash
cd frontend/myapp
npm install
npm start
```

## 4. Test payment

1. Login to the app.
2. Add a product to cart.
3. Open Checkout.
4. Select **Online Payment (Razorpay)**.
5. Click **PAY ... WITH RAZORPAY**.
6. The app loads Razorpay Checkout automatically; a slow initial load is retried when the button is clicked.
7. Use Razorpay Test Mode credentials/payment methods from your Razorpay Dashboard.

## If Razorpay still does not open

Open this URL in the same browser:

https://checkout.razorpay.com/v1/checkout.js

If it is blocked, disable ad-block/privacy extensions for localhost or try another browser/network.
