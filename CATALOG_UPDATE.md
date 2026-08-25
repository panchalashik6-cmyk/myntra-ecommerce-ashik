# Catalog update

This version prevents duplicate product cards and adds multiple gallery images to selected products.

## 1. Clean existing MongoDB duplicates and update the catalog

Open PowerShell in the `backend` folder and run:

```powershell
npm run sync-catalog
```

This command:
- removes duplicate products by product name;
- keeps one record for each product;
- updates the demo catalog;
- adds multiple images to selected products.

## 2. Start backend

```powershell
npm start
```

## 3. Start frontend

Open a second PowerShell window:

```powershell
cd frontend\myapp
npm start
```

After the sync, refresh the browser with `Ctrl + Shift + R`.
