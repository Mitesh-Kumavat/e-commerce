# E-Commerce Platform

A full-featured **E-Commerce Web Application** with secure user authentication, admin and user dashboards, product management, search, filtering, sorting, and cart/checkout functionality. Built with a modern tech stack and JWT-based authentication for secure access.

---

## 🌐 Live Project

- **Frontend (Vercel):** [E-Commerce App](https://e-commerce-delta-khaki.vercel.app/)  
- **Backend (Render):** Hosted on Render (⚠️ **Important Note**: Since the backend is deployed on Render free tier, the server may take **1–2 minutes to boot** after inactivity. Please wait patiently after opening the frontend or making your first request.)  
- **Database:** MongoDB Atlas  

---

## Features

### **Authentication**
- User signup and login.
- Password hashing with bcrypt.
- JWT-based token authentication for secure access.
- Role-based access: **Admin** and **User**.

### **Admin Dashboard**
- Add, update, and delete products.
- View product stock and inventory.
- Manage user accounts (view and delete users).
- Monitor overall platform statistics (products, users, orders).
- Change **order status** (e.g., Pending → Shipped → Delivered).

### **User Dashboard**
- Search products by name.
- Sort products by:
  - Latest
  - Price (High → Low)
  - Price (Low → High)
- Add products to cart.
- Checkout products and make orders.
- Cancel orders if needed.

### **Product Management**
- Admin can manage products with full CRUD functionality.
- Product details include: Name, Description, Price, Category, and Stock quantity.

### **Cart & Orders**
- Users can add multiple products to cart.
- Checkout orders with proper validation.
- Cancel orders before processing.
- Order history for users.
- Admin can update the **status of orders**.

---
