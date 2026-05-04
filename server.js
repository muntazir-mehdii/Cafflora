const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// This line imports db.js which immediately tests the DB connection
const db = require('./config/db');

// Connect to MongoDB for Reviews (Polyglot Persistence)
const connectMongoDB = require('./config/mongo');
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Serve Static HTML Files from /public ────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Page Routes (so /home works instead of /home.html) ──
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, 'public', 'home.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, 'public', 'menu.html')));
app.get('/shop', (req, res) => res.sendFile(path.join(__dirname, 'public', 'shop.html')));
app.get('/coffee', (req, res) => res.sendFile(path.join(__dirname, 'public', 'coffee-station.html')));
app.get('/flowers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'flower-boutique.html')));
app.get('/books', (req, res) => res.sendFile(path.join(__dirname, 'public', 'book-corner.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/discounts', (req, res) => res.sendFile(path.join(__dirname, 'public', 'discounts.html')));
app.get('/sign-in', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sign-in.html')));
app.get('/sign-up', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sign-up.html')));
app.get('/checkout', (req, res) => res.sendFile(path.join(__dirname, 'public', 'checkout.html')));
app.get('/cart',    (req, res) => res.sendFile(path.join(__dirname, 'public', 'cart-upsell.html')));
app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'profile.html')));
// ─── API Routes (we will fill these in next phases) ──────
// Simulated OAuth entry points must be registered BEFORE app.use('/api/auth', ...) so GET requests
// are not swallowed by the auth router (which only defines POST /login and POST /register).
// Real Google OAuth: redirect to https://accounts.google.com/o/oauth2/v2/auth with query params:
//   client_id, redirect_uri, response_type=code, scope=openid email profile, state, etc.
// Real Sign in with Apple: redirect to https://appleid.apple.com/auth/authorize with:
//   client_id (Services ID), redirect_uri, response_type, scope, response_mode (form_post or query), state, nonce.
app.get('/api/auth/google/login', (req, res) => {
    res.redirect(302, '/google-login.html');
});
app.get('/api/auth/apple/login', (req, res) => {
    res.redirect(302, '/apple-login.html');
});
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart',     require('./routes/cart'));
app.use('/api/discounts', require('./routes/discounts'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/contact',  require('./routes/contact'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/reviews',   require('./routes/reviews'));
// app.use('/api/admin',    require('./routes/admin'));

// ─── Health Check Route ───────────────────────────────────
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1');
        res.json({
            status: 'ok',
            message: '✅ Cafflora server is running',
            database: '✅ MySQL connected'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            database: '❌ MySQL not connected',
            error: err.message
        });
    }
});

// ─── 404 Fallback ─────────────────────────────────────────
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'home.html'));
});

// ─── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🌸 Cafflora server running at http://localhost:${PORT}`);
});