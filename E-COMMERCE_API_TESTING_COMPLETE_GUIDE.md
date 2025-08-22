# Postman API Testing Complete Guide with Demo Data

## 🚀 Getting Started with Postman

### Step 1: Install & Setup Postman
1. Download Postman from [postman.com](https://www.postman.com/)
2. Install and create account
3. Open Postman application

### Step 2: Import Collection
1. Click **"Import"** button (top left)
2. Select **"Upload files"** or drag-drop JSON file
3. Click **"Import"** to add collection

## 🌐 Environment Setup

### Create New Environment
1. Click **"Environments"** (left sidebar)
2. Click **"Create Environment"**
3. Name: `E-commerce API Testing`
4. Add variables:

```
Variable Name         | Initial Value              | Current Value
base_url             | http://localhost:5000/api  | http://localhost:5000/api
token                |                           | (auto-filled)
admin_token          |                           | (auto-filled)
product_id           |                           | (manual entry)
category_id          |                           | (manual entry)
electronics_category_id |                        | (manual entry)
```

5. Click **"Save"**
6. Select environment from dropdown (top right)

## 📋 Complete Testing Workflow with Demo Data

### Phase 1: User Registration & Authentication

#### 1.1 Register Admin User
**Request:** `POST {{base_url}}/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "name": "Admin User",
    "email": "admin@ecommerce.com",
    "password": "admin123456",
    "role": "admin"
}
```

**Expected Response:**
```json
{
    "success": true,
    "message": "User registered successfully",
    "user": {
        "id": "admin_user_id",
        "name": "Admin User",
        "email": "admin@ecommerce.com",
        "role": "admin"
    }
}
```

#### 1.2 Login Admin User
**Request:** `POST {{base_url}}/auth/login`

**Body (JSON):**
```json
{
    "email": "admin@ecommerce.com",
    "password": "admin123456"
}
```

**Test Script (Auto-save token):**
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    if (response.success && response.token) {
        pm.environment.set('admin_token', response.token);
        console.log('Admin token saved:', response.token);
    }
}
```

#### 1.3 Register Regular User
**Request:** `POST {{base_url}}/auth/register`

**Body (JSON):**
```json
{
    "name": "John Customer",
    "email": "john@customer.com",
    "password": "customer123",
    "role": "user"
}
```

#### 1.4 Login Regular User
**Request:** `POST {{base_url}}/auth/login`

**Body (JSON):**
```json
{
    "email": "john@customer.com",
    "password": "customer123"
}
```

### Phase 2: Category Management

#### 2.1 Create Electronics Category
**Request:** `POST {{base_url}}/categories`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON):**
```json
{
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "isActive": true
}
```

**Manual Step:** Copy category ID from response and save to environment variable `electronics_category_id`

#### 2.2 Create Clothing Category
**Body (JSON):**
```json
{
    "name": "Clothing",
    "description": "Fashion and apparel items",
    "isActive": true
}
```

#### 2.3 Create Books Category
**Body (JSON):**
```json
{
    "name": "Books",
    "description": "Books and educational materials",
    "isActive": true
}
```

#### 2.4 Get All Categories
**Request:** `GET {{base_url}}/categories`

**Expected Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": "category_id",
            "name": "Electronics",
            "description": "Electronic devices and accessories",
            "isActive": true
        }
    ]
}
```

### Phase 3: Product Management

#### 3.1 Create iPhone Product
**Request:** `POST {{base_url}}/products`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{admin_token}}
```

**Body (JSON):**
```json
{
    "name": "iPhone 15 Pro",
    "description": "Latest iPhone with titanium design and advanced camera system. Features A17 Pro chip, 48MP camera system, and titanium build.",
    "price": 999.99,
    "category": "{{electronics_category_id}}",
    "stock": 50,
    "images": [
        "https://example.com/iphone15pro-1.jpg",
        "https://example.com/iphone15pro-2.jpg"
    ],
    "specifications": {
        "brand": "Apple",
        "model": "iPhone 15 Pro",
        "storage": "256GB",
        "color": "Natural Titanium",
        "display": "6.1-inch Super Retina XDR",
        "camera": "48MP Main Camera",
        "processor": "A17 Pro",
        "battery": "Up to 23 hours video playback",
        "connectivity": "5G, Wi-Fi 6E, Bluetooth 5.3"
    },
    "tags": ["smartphone", "apple", "5g", "premium"],
    "weight": "187g",
    "dimensions": "146.6 × 70.6 × 8.25 mm",
    "isActive": true
}
```

**Manual Step:** Save product ID to environment variable `iphone_product_id`

#### 3.2 Create Samsung Galaxy Product
**Body (JSON):**
```json
{
    "name": "Samsung Galaxy S24 Ultra",
    "description": "Premium Android smartphone with S Pen and advanced AI features. Perfect for productivity and creativity.",
    "price": 1199.99,
    "category": "{{electronics_category_id}}",
    "stock": 30,
    "images": [
        "https://example.com/galaxys24ultra-1.jpg",
        "https://example.com/galaxys24ultra-2.jpg"
    ],
    "specifications": {
        "brand": "Samsung",
        "model": "Galaxy S24 Ultra",
        "storage": "256GB",
        "color": "Titanium Black",
        "display": "6.8-inch Dynamic AMOLED 2X",
        "camera": "200MP Main Camera",
        "processor": "Snapdragon 8 Gen 3",
        "battery": "5000mAh",
        "features": "S Pen included, AI photo editing"
    },
    "tags": ["smartphone", "samsung", "s-pen", "android", "ai"],
    "weight": "232g",
    "dimensions": "162.3 × 79.0 × 8.6 mm",
    "isActive": true
}
```

#### 3.3 Create MacBook Product
**Body (JSON):**
```json
{
    "name": "MacBook Pro 14-inch M3 Pro",
    "description": "Professional laptop with M3 Pro chip for demanding workflows. Perfect for developers, creators, and professionals.",
    "price": 1999.99,
    "category": "{{electronics_category_id}}",
    "stock": 25,
    "images": [
        "https://example.com/macbookpro14-1.jpg",
        "https://example.com/macbookpro14-2.jpg"
    ],
    "specifications": {
        "brand": "Apple",
        "model": "MacBook Pro 14-inch",
        "processor": "Apple M3 Pro (11-core CPU, 14-core GPU)",
        "memory": "18GB Unified Memory",
        "storage": "512GB SSD",
        "display": "14.2-inch Liquid Retina XDR (3024×1964)",
        "color": "Space Black",
        "battery": "Up to 18 hours",
        "ports": "3x Thunderbolt 4, HDMI, SD card, MagSafe 3"
    },
    "tags": ["laptop", "apple", "m3-pro", "professional", "creator"],
    "weight": "1.61kg",
    "dimensions": "31.26 × 22.12 × 1.55 cm",
    "isActive": true
}
```

#### 3.4 Get All Products
**Request:** `GET {{base_url}}/products`

**Query Parameters:**
```
page: 1
limit: 10
category: (optional)
sort: createdAt
order: desc
```

### Phase 4: Coupon Management

#### 4.1 Create Welcome Coupon (Percentage)
**Request:** `POST {{base_url}}/coupons`

**Headers:**
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "code": "WELCOME20",
    "discountType": "percentage",
    "discountValue": 20,
    "minimumAmount": 100,
    "maximumDiscount": 200,
    "expiryDate": "2024-12-31T23:59:59.000Z",
    "usageLimit": 100,
    "usedCount": 0,
    "isActive": true,
    "description": "20% off for new customers (max $200 discount)",
    "applicableCategories": ["{{electronics_category_id}}"],
    "userRestrictions": {
        "firstTimeUsers": true,
        "maxUsagePerUser": 1
    }
}
```

#### 4.2 Create Fixed Amount Coupon
**Body (JSON):**
```json
{
    "code": "FLAT50",
    "discountType": "fixed",
    "discountValue": 50,
    "minimumAmount": 200,
    "expiryDate": "2024-11-30T23:59:59.000Z",
    "usageLimit": 50,
    "usedCount": 0,
    "isActive": true,
    "description": "$50 flat discount on orders above $200",
    "applicableCategories": [],
    "userRestrictions": {
        "maxUsagePerUser": 2
    }
}
```

#### 4.3 Create Holiday Coupon
**Body (JSON):**
```json
{
    "code": "HOLIDAY2024",
    "discountType": "percentage",
    "discountValue": 15,
    "minimumAmount": 150,
    "maximumDiscount": 100,
    "expiryDate": "2024-12-25T23:59:59.000Z",
    "usageLimit": 200,
    "usedCount": 0,
    "isActive": true,
    "description": "Holiday special - 15% off (max $100 discount)",
    "applicableCategories": [],
    "userRestrictions": {
        "maxUsagePerUser": 1
    }
}
```

#### 4.4 Validate Coupon
**Request:** `POST {{base_url}}/coupons/validate`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "code": "WELCOME20",
    "orderAmount": 500.00,
    "products": [
        {
            "productId": "{{iphone_product_id}}",
            "quantity": 1,
            "price": 999.99,
            "categoryId": "{{electronics_category_id}}"
        }
    ]
}
```

### Phase 5: Order Management

#### 5.1 Create Single Product Order
**Request:** `POST {{base_url}}/orders`

**Headers:**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
    "products": [
        {
            "productId": "{{iphone_product_id}}",
            "quantity": 1,
            "price": 999.99
        }
    ],
    "shippingAddress": {
        "firstName": "John",
        "lastName": "Customer",
        "email": "john@customer.com",
        "phone": "+1-555-0123",
        "street": "123 Main Street",
        "apartment": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
    },
    "billingAddress": {
        "firstName": "John",
        "lastName": "Customer",
        "email": "john@customer.com",
        "phone": "+1-555-0123",
        "street": "123 Main Street",
        "apartment": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
    },
    "paymentMethod": "credit_card",
    "paymentDetails": {
        "cardType": "visa",
        "lastFourDigits": "1234"
    },
    "notes": "Please deliver during business hours"
}
```

#### 5.2 Create Order with Multiple Products
**Body (JSON):**
```json
{
    "products": [
        {
            "productId": "{{iphone_product_id}}",
            "quantity": 1,
            "price": 999.99
        },
        {
            "productId": "{{samsung_product_id}}",
            "quantity": 1,
            "price": 1199.99
        }
    ],
    "shippingAddress": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@customer.com",
        "phone": "+1-555-0456",
        "street": "456 Oak Avenue",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    },
    "billingAddress": {
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@customer.com",
        "phone": "+1-555-0456",
        "street": "456 Oak Avenue",
        "city": "Los Angeles",
        "state": "CA",
        "zipCode": "90210",
        "country": "USA"
    },
    "paymentMethod": "paypal",
    "couponCode": "FLAT50"
}
```

#### 5.3 Create Order with Coupon
**Body (JSON):**
```json
{
    "products": [
        {
            "productId": "{{macbook_product_id}}",
            "quantity": 1,
            "price": 1999.99
        }
    ],
    "shippingAddress": {
        "firstName": "Mike",
        "lastName": "Developer",
        "email": "mike@developer.com",
        "phone": "+1-555-0789",
        "street": "789 Pine Street",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601",
        "country": "USA"
    },
    "billingAddress": {
        "firstName": "Mike",
        "lastName": "Developer",
        "email": "mike@developer.com",
        "phone": "+1-555-0789",
        "street": "789 Pine Street",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601",
        "country": "USA"
    },
    "paymentMethod": "credit_card",
    "paymentDetails": {
        "cardType": "mastercard",
        "lastFourDigits": "5678"
    },
    "couponCode": "WELCOME20",
    "notes": "Rush delivery requested"
}
```

#### 5.4 Get Customer Orders
**Request:** `GET {{base_url}}/orders/my-orders`

**Headers:**
```
Authorization: Bearer {{token}}
```

**Query Parameters:**
```
page: 1
limit: 10
status: (optional - pending, confirmed, shipped, delivered, cancelled)
```

#### 5.5 Get All Orders (Admin)
**Request:** `GET {{base_url}}/orders/all`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

**Query Parameters:**
```
page: 1
limit: 10
status: pending
startDate: 2024-01-01
endDate: 2024-12-31
```

### Phase 6: Reports & Analytics

#### 6.1 Generate Current Month Sales Report
**Request:** `GET {{base_url}}/reports/sales`

**Headers:**
```
Authorization: Bearer {{admin_token}}
```

#### 6.2 Generate Custom Date Range Report
**Request:** `GET {{base_url}}/reports/sales`

**Query Parameters:**
```
startDate: 2024-01-01
endDate: 2024-12-31
groupBy: month
includeProducts: true
includeCustomers: true
```

#### 6.3 Generate Product Performance Report
**Request:** `GET {{base_url}}/reports/products`

**Query Parameters:**
```
startDate: 2024-07-01
endDate: 2024-08-22
category: {{electronics_category_id}}
sortBy: revenue
order: desc
limit: 10
```

## 🧪 Error Testing Scenarios

### Test Invalid Token
**Request:** `GET {{base_url}}/auth/profile`

**Headers:**
```
Authorization: Bearer invalid-token-12345
```

**Expected Response:**
```json
{
    "success": false,
    "message": "Invalid or expired token",
    "statusCode": 401
}
```

### Test Non-Admin Access
**Request:** `POST {{base_url}}/products`

**Headers:**
```
Authorization: Bearer {{token}}  // Regular user token
Content-Type: application/json
```

**Expected Response:**
```json
{
    "success": false,
    "message": "Access denied. Admin role required",
    "statusCode": 403
}
```

### Test Invalid Coupon
**Request:** `POST {{base_url}}/coupons/validate`

**Body (JSON):**
```json
{
    "code": "INVALID_COUPON",
    "orderAmount": 100.00
}
```

### Test Insufficient Stock
**Request:** `POST {{base_url}}/orders`

**Body (JSON):**
```json
{
    "products": [
        {
            "productId": "{{iphone_product_id}}",
            "quantity": 999,
            "price": 999.99
        }
    ],
    "shippingAddress": {
        "street": "123 Test Street",
        "city": "Test City",
        "state": "TS",
        "zipCode": "12345",
        "country": "USA"
    }
}
```

## 🔍 Response Validation & Tests

### Example Test Scripts

#### Token Extraction Test
```javascript
pm.test("Login successful and token extracted", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.token).to.exist;
    
    if (response.token) {
        pm.environment.set('token', response.token);
    }
});
```

#### Status Code Test
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('success');
    pm.expect(response).to.have.property('data');
});
```

#### Order Creation Test
```javascript
pm.test("Order created successfully", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data).to.have.property('orderId');
    pm.expect(response.data).to.have.property('totalAmount');
    
    // Save order ID for future tests
    if (response.data.orderId) {
        pm.environment.set('order_id', response.data.orderId);
    }
});
```

## 📊 Monitoring & Debugging

### View Request/Response
1. Click on request in history
2. View **Headers**, **Body**, **Response**
3. Check **Tests** tab for validation results
4. Use **Console** (View → Show Postman Console)

### Common Debugging Steps
1. **Check Environment**: Verify correct environment selected
2. **Validate Token**: Ensure tokens are saved and not expired
3. **Review Headers**: Confirm Content-Type and Authorization
4. **Check Server**: Verify API server is running
5. **Examine Response**: Look for error messages and status codes

## 💡 Pro Tips

### Automation
1. Use **Collection Runner** for automated testing
2. Set up **Pre-request Scripts** for dynamic data
3. Create **Test Suites** for different scenarios

### Data Management
1. Use **Data Files** (CSV/JSON) for bulk testing
2. Implement **Dynamic Variables** for unique data
3. Set up **Mock Servers** for frontend development

### Collaboration
1. **Export Collections** for team sharing
2. Use **Workspaces** for project organization
3. **Publish Documentation** from collections

This comprehensive guide provides everything needed to test your e-commerce API with realistic demo data and proper validation techniques.