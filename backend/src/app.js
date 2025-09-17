import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import orderRoutes from './routes/order.route.js';
import userRoutes from './routes/user.route.js';
import dashboardRoutes from './routes/dashboard.route.js';

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (_req, res) => {
    res.send('E-commerce API is running');
});

export { app };