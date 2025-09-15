# E-Commerce Platform

A full-featured **E-Commerce Web Application** with secure user authentication, admin and user dashboards, product management, search, filtering, sorting, and cart/checkout functionality. Built with a modern tech stack and JWT-based authentication for secure access.

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

### **User Dashboard**
- Search products by name.
- Sort products by:
    - Latest
    - Price (High → Low)
    - Price (Low → High)
- Filter products by category.
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
