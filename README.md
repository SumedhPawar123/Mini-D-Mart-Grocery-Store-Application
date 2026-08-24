# 🛒 Mini D-Mart – Grocery Store Application

A full-stack MERN grocery store application that allows customers to browse products, manage their cart, place orders, choose home delivery or store pickup, and request returns or exchanges. The application also includes role-based dashboards for staff and administrators.

## 🚀 Live Demo

- **Live App:** https://mini-d-mart-grocery-store-applicati-seven.vercel.app/
- **GitHub:**  https://github.com/SumedhPawar123/Mini-D-Mart-Grocery-Store-Application

## ✨ Features

- User Registration & Login (JWT Authentication)
- Role-Based Access Control (Customer, Staff, Admin)
- Product & Category Management
- Search and Filter Products
- Shopping Cart & Checkout
- Home Delivery & Store Pickup
- Order Management & Order History
- Return & Exchange Requests
- Inventory & Stock Validation
- Responsive UI

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React + Vite | Node.js + Express | MongoDB |
| Bootstrap / Tailwind | JWT, bcrypt | Mongoose |

## 📁 Project Structure

```text
mini-d-mart/
├── frontend/     # React Frontend
├── backend/     # Express Backend
├── README.md
└── .env.example
```

## ⚙️ Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🔑 Environment Variables

Create a `.env` file in the server folder:

```env
PORT=5000
MONGO_URI=mongodb+srv://psumedh59_db_user:Sumedh4912@cluster0.38xedac.mongodb.net/mini-dmart?appName=Cluster0
CLIENT_URL=https://mini-d-mart-grocery-store-applicati-seven.vercel.app/

```

Frontend (`client/.env`):

```env
VITE_API_URL=https://mini-d-mart-grocery-store-application-1.onrender.com/api
VITE_SOCKET_URL=https://mini-d-mart-grocery-store-application-1.onrender.com

```

## 👥 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.com | Customer@123 |
| Staff | staff@test.com | Staff@123 |
| Admin | admin@test.com | Admin@123 |

## 🔐 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected APIs
- Role-Based Access Control (RBAC)
- Input Validation
- Environment Variables for Secrets

For more details, see **SECURITY.md**.

## 🤖 AI Usage

AI tools (ChatGPT) were used for debugging, code review, implementation guidance, documentation, and testing support.

## 👨‍💻 Author

**Sumedh Pawar**  
MERN Stack Developer
