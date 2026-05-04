# 🌸 Cafflora – Botanical Café & Atelier

> A full-stack e-commerce platform celebrating the intersection of artisanal coffee, botanical artistry, and curated literature. Built with a luxury "Parisian sanctuary" aesthetic and powered by modern web technologies.

---

## 📋 Status & Badges

![Node.js](https://img.shields.io/badge/Node.js-v22+-2ea44f?style=flat-square&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express-v5.2+-000000?style=flat-square&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-v8+-0051ba?style=flat-square&logo=mysql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v3+-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Security-E7165F?style=flat-square&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)

---

## 🏛 Architecture: Polyglot Persistence

Cafflora leverages a **Polyglot Persistence** architecture, strategically utilizing multiple database technologies to handle different data shapes and requirements. By pairing **MySQL** and **MongoDB**, we achieve the perfect balance of structural integrity and scalable flexibility:

- **MySQL (Primary Database):** Ensures strict ACID compliance for our transactional and relational data. It acts as the source of truth for Users, Products, Categories, and Orders—guaranteeing data consistency where it matters most.
- **MongoDB (Secondary Database):** Provides the schema flexibility needed for dynamic, user-generated content. We use MongoDB (via Mongoose) to handle high-volume, unstructured data like **Product Reviews & Ratings**. This keeps our relational schema lean and performant while allowing reviews to scale and evolve independently without complex migrations.

---

## 🎯 Key Features

### 🛒 **Dynamic Cart & Checkout System**
- Real-time cart management with global state management
- Persistent shopping cart across sessions
- Seamless checkout experience with order confirmation
- **UI Toast Notifications** – Beautiful, non-intrusive alerts for user feedback (success, errors, confirmations)

### 🌿 **Multi-Category Browsing**
- **Coffee Station** – Premium coffee beans and blends (categories: Coffee, Menu)
- **Flower Boutique** – Fresh and curated botanical arrangements
- **Book Corner** – Curated collection of literature, art books, and wellness reads
- Client-side filtering for instant category switching
- Featured products showcase on home page

### ⭐ **Dynamic Product Reviews (MongoDB)**
- **Polyglot Integration** – Reviews are powered by MongoDB and Mongoose, intrinsically linked to MySQL product and user IDs.
- **Interactive Feedback** – Users can leave 1-5 star ratings and rich text comments on individual curations.
- **Real-Time Rendering** – Reviews are dynamically fetched and elegantly displayed on product views, adding social proof and community interaction.

### 🔐 **Secure Authentication**
- JWT-based authentication system
- Password hashing with **bcryptjs** (10-salt rounds)
- User registration & login endpoints
- Protected API routes for authenticated operations
- Support for OAuth integration (Google & Apple sign-in placeholders)

### 📦 **Order Management**
- Secure order placement with validation
- Order history retrieval (authenticated users only)
- Order tracking with order numbers and timestamps
- Support for multiple payment methods

### 💌 **Customer Engagement**
- Contact form for inquiries
- Newsletter subscription system
- Discount management & promotional codes
- User profile management

### 🎨 **Editorial Design System**
- **Material Design tokens** for semantic color usage
- Luxury Parisian sanctuary aesthetic
- Custom typographic scale (Noto Serif + Plus Jakarta Sans)
- No-line design philosophy (section boundaries via tonal shifts)
- Glassmorphism effects for floating UI elements
- Responsive mobile-first architecture with Tailwind CSS

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3 / Tailwind CSS** | Responsive styling with utility-first approach |
| **Vanilla JavaScript** | Client-side interactivity & API communication |
| **Material Symbols** | Consistent icon library |
| **Responsive Design** | Mobile, tablet, and desktop optimization |

### **Backend**
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Lightweight web framework & routing |
| **JWT (jsonwebtoken)** | Stateless authentication & authorization |
| **bcryptjs** | Password hashing & security |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |

### **Database (Polyglot Persistence)**
| Technology | Purpose |
|-----------|---------|
| **MySQL 8+** | Primary Database: Handles strict relational data (Users, Products, Orders) |
| **MongoDB** | Secondary Database: Handles unstructured, high-volume data (Reviews) |
| **mysql2 / Mongoose** | Connection pooling and ORM/ODM integration |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| **nodemon** | Auto-restart server during development |
| **npm** | Package management |

---

## 📁 Folder Structure

```
cafflora/
│
├── 📄 server.js                    # Express app initialization & route registration
├── 📄 package.json                 # Project dependencies & scripts
├── 📄 .env                         # Environment variables (not committed)
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # This file
│
├── 📂 config/
│   └── db.js                       # MySQL connection pool configuration & initialization
│
├── 📂 routes/                      # API endpoint handlers
│   ├── auth.js                     # User registration, login, JWT token generation
│   ├── products.js                 # Product catalog with filtering (coffee/flowers/books)
│   ├── cart.js                     # Cart operations (add, remove, update quantities)
│   ├── orders.js                   # Order creation, retrieval, validation
│   ├── discounts.js                # Promo code validation & discount calculations
│   ├── contact.js                  # Contact form submissions
│   └── subscribe.js                # Newsletter subscription management
│
├── 📂 middleware/                  # Custom middleware (JWT verification, validation, etc.)
│   └── (Future: auth guards, error handlers)
│
├── 📂 public/                      # Static frontend assets
│   ├── 📄 index.html               # (Redirect to home)
│   ├── 📄 home.html                # Landing page with featured products
│   ├── 📄 menu.html                # Coffee & beverage menu
│   ├── 📄 shop.html                # General shop aggregator
│   ├── 📄 coffee-station.html      # Coffee category showcase
│   ├── 📄 flower-boutique.html     # Botanical arrangement showcase
│   ├── 📄 book-corner.html         # Literature & art books showcase
│   ├── 📄 about.html               # Brand story & mission
│   ├── 📄 contact.html             # Contact form page
│   ├── 📄 discounts.html           # Promotions & discount codes
│   ├── 📄 sign-up.html             # User registration form
│   ├── 📄 sign-in.html             # User login form
│   ├── 📄 google-login.html        # Google OAuth callback handler
│   ├── 📄 apple-login.html         # Apple Sign-In callback handler
│   ├── 📄 profile.html             # User profile & order history
│   ├── 📄 cart-upsell.html         # Shopping cart & checkout page
│   │
│   └── 📂 js/
│       ├── cart-global.js          # Global cart state & local storage management
│       └── ui-toast.js             # App-wide notification system
│
├── 📂 docs/
│   └── DESIGN.md                   # Design system documentation & brand guidelines
│
└── 📂 node_modules/                # Installed dependencies (not committed)
```

---

## 🚀 Getting Started (Local Development)

### **Prerequisites**
Before you begin, ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher) – [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) – Comes with Node.js
- **MySQL Server** (v8.0 or higher) – [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** – [Download](https://git-scm.com/)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/yourusername/cafflora.git
cd cafflora
```

### **Step 2: Install Dependencies**
```bash
npm install
```

This will install all required Node.js packages:
- `express` – Web framework
- `mysql2` – Database driver with promise support
- `jsonwebtoken` – JWT authentication
- `bcryptjs` – Password hashing
- `cors` – CORS middleware
- `dotenv` – Environment variable loader
- `nodemon` – Development auto-reload (dev only)

### **Step 3: Set Up Environment Variables**
Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=cafflora

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_chars
JWT_EXPIRY=7d

# Email Configuration (Optional - for future contact form integration)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# MongoDB Connection (Secondary Database for Reviews)
MONGO_URI=mongodb://127.0.0.1:27017/cafflora
```

**⚠️ Important:** Never commit `.env` to version control. It's listed in `.gitignore` for security.

### **Step 4: Database Setup**

#### **Create Database & Tables**
Open MySQL and execute the following SQL script:

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS cafflora;
USE cafflora;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    stock_qty INT DEFAULT 0,
    category_id INT,
    tag VARCHAR(50),
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    delivery_address TEXT,
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Order items table
CREATE TABLE order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Contact messages table
CREATE TABLE contact_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(120) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter subscriptions table
CREATE TABLE subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active TINYINT DEFAULT 1
);

-- Discounts / Promo codes table
CREATE TABLE discounts (
    discount_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    discount_value DECIMAL(10, 2) NOT NULL,
    max_uses INT,
    current_uses INT DEFAULT 0,
    expiry_date DATE,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **Seed Sample Data (Optional)**
To populate the database with sample products:

```sql
-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Coffee', 'Premium coffee beans and blends'),
('Menu', 'Beverages and prepared drinks'),
('Flowers', 'Fresh botanical arrangements'),
('Books', 'Curated literature and art books'),
('Accessories', 'Café and home accessories');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, stock_qty, category_id, tag, is_active) VALUES
('Ethiopian Yirgacheffe', 'Bright, fruity single-origin espresso', 14.99, '/images/yirgacheffe.jpg', 50, 1, 'FEATURED', 1),
('Café Au Lait', 'Creamy French-style coffee with milk', 6.50, '/images/au-lait.jpg', 100, 2, NULL, 1),
('Peony Arrangement', 'Luxe pink peonies in a ceramic vase', 45.00, '/images/peonies.jpg', 20, 3, 'FEATURED', 1),
('Design of Everyday Things', 'Iconic UX/design philosophy book', 18.99, '/images/don-norman.jpg', 30, 4, NULL, 1);

#### **Setup Secondary Database (MongoDB for Reviews)**
Ensure you have MongoDB running locally (via MongoDB Compass or CLI). 
Mongoose will automatically create the `cafflora` database and the `reviews` collection upon the first review submission, provided your `MONGO_URI` is set correctly in the `.env` file. No manual schema creation is required!
```

### **Step 5: Run the Server**

#### **Development Mode (with Auto-Reload)**
```bash
npm run dev
```

#### **Production Mode**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your `PORT` env variable).

You should see:
```
✅ MySQL connected successfully
🌸 Cafflora server running at http://localhost:3000
```

### **Step 6: Verify Installation**
Open your browser and navigate to:
- **Home Page:** `http://localhost:3000/home`
- **Health Check:** `http://localhost:3000/api/health`

The health check endpoint should return:
```json
{
  "status": "ok",
  "message": "✅ Cafflora server is running",
  "database": "✅ MySQL connected"
}
```

---

## 📡 API Endpoints

### **Authentication Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/auth/register` | Register a new user | ❌ No |
| `POST` | `/api/auth/login` | Login & receive JWT token | ❌ No |

**Example Request (Login):**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

**Example Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

### **Products Routes**
| Method | Endpoint | Description | Auth Required | Query Parameters |
|--------|----------|-------------|----------------|------------------|
| `GET` | `/api/products` | Fetch all products | ❌ No | `filter`, `tag` |

**Example Requests:**
```bash
# Get all products
curl http://localhost:3000/api/products

# Get featured products only
curl "http://localhost:3000/api/products?tag=FEATURED"

# Filter by category (coffee, menu, shop)
curl "http://localhost:3000/api/products?filter=coffee"
```

### **Cart Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/cart/add` | Add item to cart | ❌ No |
| `POST` | `/api/cart/remove` | Remove item from cart | ❌ No |
| `POST` | `/api/cart/update` | Update item quantity | ❌ No |
| `GET` | `/api/cart` | Get current cart | ❌ No |

### **Orders Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/orders/create` | Create a new order | ✅ Yes |
| `GET` | `/api/orders/my-orders` | Retrieve user's orders | ✅ Yes |
| `GET` | `/api/orders/:orderId` | Get specific order details | ✅ Yes |

### **Reviews Routes (MongoDB)**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET`  | `/api/reviews/:productId` | Fetch all reviews for a product | ❌ No |
| `POST` | `/api/reviews` | Submit a new product review | ✅ Yes |

**Example Request (Create Order):**
```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "quantity": 2},
      {"product_id": 3, "quantity": 1}
    ],
    "delivery_address": "123 Main St, Anytown, USA",
    "payment_method": "credit_card"
  }'
```

### **Discounts Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/discounts/validate` | Validate promo code | ❌ No |

### **Contact Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/contact` | Submit contact form | ❌ No |

**Example Request:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I love Cafflora!"
  }'
```

### **Newsletter Routes**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `POST` | `/api/subscribe` | Subscribe to newsletter | ❌ No |

### **Health Check Route**
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| `GET` | `/api/health` | Verify server & DB status | ❌ No |

---

## 🎨 UI/UX Highlights

### **Design Philosophy: "The Curated Sanctuary"**
Cafflora's interface is inspired by luxury lifestyle magazines and Parisian boutiques. Every detail is intentional.

#### **Color Palette**
| Color | Hex | Usage |
|-------|-----|-------|
| **Primary (Dusty Rose)** | `#78555D` | Brand warmth, CTAs, primary actions |
| **Secondary (Sage Green)** | `#4B6546` | Growth-oriented elements, botanical cues |
| **Tertiary (Muted Terracotta)** | `#8F4D27` | Highlights, artisanal warmth |
| **Espresso** | `#1C1C18` | Text, depth, emphasis |
| **Cream** | `#FDF9F3` | Clean backgrounds, breathing room |

#### **Typography**
- **Headlines:** Noto Serif (elegant, editorial)
- **Body & Labels:** Plus Jakarta Sans (modern, readable)
- **Typographic Scale:** Material Design-inspired for hierarchy

#### **Key UI Features**
✨ **Toast Notifications** – Non-intrusive, animated feedback system
- Success messages (e.g., "Item added to cart")
- Error alerts (e.g., "Out of stock")
- Custom styling: dusty rose background, auto-dismiss after 3.2 seconds

✨ **Responsive Layouts**
- Mobile-first design with Tailwind CSS breakpoints
- Hamburger navigation for small screens
- Touch-friendly buttons and spacing

✨ **No-Line Design**
- Section boundaries defined by tonal color shifts, not borders
- Glassmorphic floating elements with backdrop blur
- Soft rounded corners (1.5rem) mimicking organic shapes

✨ **Product Cards**
- Smooth image transitions & hover effects
- Clear pricing & category badges
- Quick-add-to-cart functionality

✨ **Botanical Aesthetic**
- Extensive use of white space (breathing room)
- Subtle botanical imagery & patterns
- Warm, inviting color transitions

### **Page Highlights**
- **Home Page:** Featured products showcase with hero banner
- **Coffee Station:** Coffee category with brewing guides
- **Flower Boutique:** Botanical arrangements with seasonal collections
- **Book Corner:** Curated literature with reading lists
- **Shop:** Unified shopping experience across all categories
- **Cart Page:** Visual summary with order review & checkout
- **Profile:** Order history & account management
- **Contact:** Elegant inquiry form with validation

---

## 🔐 Security Features

✅ **Password Security**
- Passwords hashed with bcryptjs (10-salt rounds)
- Never stored in plain text
- Compared using constant-time comparison

✅ **JWT Authentication**
- Stateless token-based authentication
- Configurable expiry time (default: 7 days)
- Bearer token scheme with Authorization header

✅ **Input Validation**
- Email format validation (RFC 5322 pattern)
- Length constraints on text fields
- SQL injection prevention via parameterized queries

✅ **CORS Protection**
- Cross-origin requests properly configured
- Protected API endpoints require authentication

✅ **Database Security**
- Connection pooling prevents resource exhaustion
- Prepared statements for all queries
- Environment variables for sensitive credentials

---

## 🧪 Testing the Application

### **Manual Testing Checklist**

#### **Authentication**
- [ ] Register a new user with valid credentials
- [ ] Attempt registration with duplicate email (should fail)
- [ ] Login with correct credentials
- [ ] Attempt login with incorrect password (should fail)
- [ ] Verify JWT token in browser localStorage
- [ ] Logout and verify token removal

#### **Products & Filtering**
- [ ] View all products on shop page
- [ ] Filter by "Coffee Station"
- [ ] Filter by "Flower Boutique"
- [ ] Filter by "Book Corner"
- [ ] Click featured product
- [ ] Verify product details display correctly

#### **Shopping Cart**
- [ ] Add item to cart from product page
- [ ] Verify toast notification appears
- [ ] View cart & confirm items listed
- [ ] Update quantity in cart
- [ ] Remove item from cart
- [ ] Verify cart persists on page refresh (localStorage)

#### **Checkout & Orders**
- [ ] Navigate to checkout page
- [ ] Review order summary
- [ ] Apply promo code (if valid)
- [ ] Place order (must be logged in)
- [ ] Verify order confirmation
- [ ] Check order in user profile

#### **Contact & Newsletter**
- [ ] Submit contact form with valid data
- [ ] Attempt submission with invalid email (should fail)
- [ ] Subscribe to newsletter
- [ ] Verify subscription confirmation

#### **Responsive Design**
- [ ] Test on mobile device (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Verify navigation adapts to screen size
- [ ] Confirm touch targets are adequate (48px+)

### **Browser Compatibility**
Tested and supported on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📚 Project Documentation

- **Design System:** See [docs/DESIGN.md](docs/DESIGN.md) for comprehensive design guidelines, color tokens, typography rules, and component specifications.
- **API Documentation:** Detailed endpoint documentation above.
- **Database Schema:** See database setup section for full SQL schema.

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request with a clear description

### **Code Standards**
- Use consistent indentation (2 spaces)
- Follow existing code style
- Write meaningful commit messages
- Comment complex logic

---

## 📝 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `DB_HOST` | `localhost` | MySQL hostname |
| `DB_PORT` | `3306` | MySQL port |
| `DB_USER` | `root` | MySQL username |
| `DB_PASS` | — | MySQL password |
| `DB_NAME` | `cafflora` | Database name |
| `JWT_SECRET` | — | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRY` | `7d` | JWT token expiration |

---

## 🚨 Troubleshooting

### **"MySQL connection failed"**
- Verify MySQL server is running (`brew services start mysql` on macOS)
- Check `.env` credentials match your MySQL setup
- Ensure database `cafflora` exists
- Verify user has proper permissions

### **"Cannot find module 'express'"**
- Run `npm install` to install dependencies
- Verify `node_modules/` directory exists

### **"JWT verification failed"**
- Ensure `JWT_SECRET` is set in `.env`
- Check token isn't expired (compare with `JWT_EXPIRY`)
- Verify token format: `Bearer <token>`

### **Port already in use**
- Change `PORT` in `.env` to an available port
- Or kill the process: `lsof -i :3000` then `kill -9 <PID>`

### **CORS errors**
- Verify CORS middleware is enabled in `server.js`
- Check frontend request includes proper headers
- Whitelist your frontend URL in production

---

## 📦 Deployment

### **Recommended Platforms**
- **Backend:** Heroku, Railway, Render, AWS EC2
- **Database:** Heroku Postgres, AWS RDS, DigitalOcean
- **Frontend:** Vercel, Netlify, AWS S3 + CloudFront

### **Pre-Deployment Checklist**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters, randomized)
- [ ] Enable HTTPS/SSL
- [ ] Configure production database
- [ ] Set secure CORS origin
- [ ] Enable rate limiting
- [ ] Add error logging & monitoring
- [ ] Create database backups

---

## 📞 Support & Contact

For questions, suggestions, or issues:
- 📧 Email: support@cafflora.com
- 🌐 Website: [Coming Soon]
- 💬 Contact Form: Available at `/contact`

---

## 📄 License

This project is licensed under the **ISC License** – see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Material Design System** – Color tokens & design philosophy
- **Tailwind CSS** – Utility-first styling framework
- **Express.js** – Lightweight web framework
- **MySQL Community** – Reliable relational database
- **Open Source Community** – For amazing tools & libraries

---

## 🌸 Thank You!

Thank you for exploring Cafflora. We hope this blend of technology, design, and botanical inspiration creates a beautiful shopping experience.

**Happy brewing, arranging, and reading! ☕🌹📚**

---

<div align="center">

**[Back to Top](#-cafflora--botanical-café--atelier)**

Made with ❤️ for coffee lovers, flower enthusiasts, and book collectors.

</div>
