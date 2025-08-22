# 🛒 E-commerce Backend API

A comprehensive e-commerce backend API built with Node.js, Express, and MongoDB, featuring user authentication, product management, order processing, and real-time updates with Socket.io.

## 🚀 Features

- **Authentication System**: User registration, login with JWT tokens
- **Product Management**: CRUD operations for products with category support
- **Order Management**: Complete order lifecycle with status tracking
- **Category System**: Organize products by categories
- **Coupon System**: Discount coupon validation and management
- **Admin Panel**: Admin-only routes for management operations
- **Real-time Updates**: Socket.io integration for live updates
- **PDF Reports**: Generate sales reports in PDF format
- **Security**: Protected routes with JWT authentication

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB database
- npm or yarn package manager

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📊 API Documentation

### Base URL
```
http://localhost:5000/api
```

## 🔐 Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```

### Login User
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Get User Profile
- **GET** `/auth/profile`
- **Headers:** `Authorization: Bearer <token>`

### Admin Test Route
- **GET** `/auth/admin-test`
- **Headers:** `Authorization: Bearer <admin-token>`

---

## 📂 Category Endpoints

### Get All Categories
- **GET** `/categories`
- **Public Route**

### Create Category (Admin Only)
- **POST** `/categories`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
  ```json
  {
    "name": "Electronics",
    "description": "Electronic items and gadgets"
  }
  ```

---

## 🛍️ Product Endpoints

### Get All Products
- **GET** `/products`
- **Query Parameters:**
  - `category`: Filter by category ID
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)

### Get Product by ID
- **GET** `/products/:id`

### Create Product (Admin Only)
- **POST** `/products`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
  ```json
  {
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with advanced features",
    "price": 999.99,
    "category": "category_id_here",
    "stock": 50,
    "images": ["image1.jpg", "image2.jpg"],
    "specifications": {
      "brand": "Apple",
      "model": "iPhone 15 Pro",
      "storage": "256GB"
    }
  }
  ```

### Update Product Stock (Admin Only)
- **PUT** `/products/:id/stock`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
  ```json
  {
    "stock": 25
  }
  ```

---

## 📦 Order Endpoints

### Create Order
- **POST** `/orders`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "products": [
      {
        "productId": "product_id_here",
        "quantity": 2,
        "price": 999.99
      },
      {
        "productId": "another_product_id",
        "quantity": 1,
        "price": 599.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "couponCode": "SAVE10"
  }
  ```

### Get My Orders
- **GET** `/orders/my-orders`
- **Headers:** `Authorization: Bearer <token>`

### Get All Orders (Admin Only)
- **GET** `/orders/all`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Query Parameters:**
  - `status`: Filter by order status
  - `page`: Page number
  - `limit`: Items per page

---

## 🎟️ Coupon Endpoints

### Validate Coupon
- **POST** `/coupons/validate`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "code": "SAVE10",
    "orderAmount": 100.00
  }
  ```

### Create Coupon (Admin Only)
- **POST** `/coupons`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
  ```json
  {
    "code": "WELCOME20",
    "discountType": "percentage",
    "discountValue": 20,
    "minimumAmount": 50,
    "expiryDate": "2024-12-31",
    "usageLimit": 100,
    "isActive": true
  }
  ```

---

## 📈 Report Endpoints

### Generate Sales Report (Admin Only)
- **GET** `/reports/sales`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Query Parameters:**
  - `startDate`: Start date for report (YYYY-MM-DD)
  - `endDate`: End date for report (YYYY-MM-DD)
- **Response:** PDF file download

---

## 🧪 Testing with Postman

### Step 1: Import Collection
1. Open Postman
2. Click "Import" button
3. Copy and paste the provided Postman collection JSON
4. The collection will be imported with all API endpoints

### Step 2: Set Environment Variables
1. Create a new environment in Postman
2. Add the following variables:
   ```
   base_url: http://localhost:5000/api
   token: (will be set automatically after login)
   admin_token: (set after admin login)
   ```

### Step 3: Testing Workflow

#### 1. **Register a Regular User**
- Use "Register User" request
- Sample data is already provided
- Note: Default role is "customer"

#### 2. **Register an Admin User**
- Use "Register User" request
- Modify the body to include:
  ```json
  {
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }
  ```

#### 3. **Login and Get Tokens**
- Use "Login User" requests for both users
- Copy the returned JWT tokens
- Set them in environment variables

#### 4. **Test Category Operations**
- Create categories using admin token
- Get categories (public access)

#### 5. **Test Product Operations**
- Create products using admin token
- Get products (public access)
- Update stock using admin token

#### 6. **Test Order Flow**
- Create orders using customer token
- View customer orders
- View all orders using admin token

#### 7. **Test Coupon System**
- Create coupons using admin token
- Validate coupons using customer token

#### 8. **Generate Reports**
- Use admin token to generate PDF reports

### Sample Test Data

#### Categories
```json
[
  {"name": "Electronics", "description": "Electronic devices and accessories"},
  {"name": "Clothing", "description": "Fashion and apparel"},
  {"name": "Books", "description": "Books and educational materials"},
  {"name": "Home & Garden", "description": "Home improvement and gardening"}
]
```

#### Products
```json
[
  {
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with titanium design",
    "price": 999.99,
    "category": "CATEGORY_ID",
    "stock": 50,
    "images": ["iphone15pro.jpg"],
    "specifications": {"storage": "256GB", "color": "Natural Titanium"}
  },
  {
    "name": "Samsung Galaxy S24",
    "description": "Flagship Android smartphone",
    "price": 899.99,
    "category": "CATEGORY_ID",
    "stock": 30,
    "images": ["galaxys24.jpg"],
    "specifications": {"storage": "256GB", "color": "Phantom Black"}
  }
]
```

#### Coupons
```json
[
  {
    "code": "WELCOME20",
    "discountType": "percentage",
    "discountValue": 20,
    "minimumAmount": 100,
    "expiryDate": "2024-12-31",
    "usageLimit": 100
  },
  {
    "code": "FLAT50",
    "discountType": "fixed",
    "discountValue": 50,
    "minimumAmount": 200,
    "expiryDate": "2024-11-30",
    "usageLimit": 50
  }
]
```

## 🔧 Project Structure

```
ecommerce-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── socket.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── categoryModel.js
│   │   ├── couponModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   └── routes/
│       ├── authRoutes.js
│       ├── categoryRoutes.js
│       ├── couponRoutes.js
│       ├── orderRoutes.js
│       ├── productRoutes.js
│       └── reportRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "stack": "Error stack trace (in development mode)"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for password security
- **Protected Routes**: Middleware for route protection
- **Role-based Access**: Admin and customer role separation
- **Input Validation**: Request data validation
- **CORS**: Cross-origin resource sharing configured

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "statusCode": 400
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: your-email@example.com

---

**Happy Coding! 🚀**