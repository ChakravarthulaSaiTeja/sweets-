# API Documentation - Kotaiah's Sweets & Foods

This document provides comprehensive API documentation for the Kotaiah's Sweets & Foods e-commerce platform.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

Most API endpoints require authentication. Include the session cookie or JWT token in your requests.

### Authentication Methods

1. **Session-based**: Uses NextAuth.js session cookies
2. **JWT Token**: Include in Authorization header: `Bearer <token>`

## API Endpoints

### Products

#### Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `category` (string): Filter by category slug
- `search` (string): Search in product name and description
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (name, price, createdAt)
- `sortOrder` (string): Sort order (asc, desc)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `featured` (boolean): Filter featured products
- `bestSeller` (boolean): Filter best seller products

**Response:**
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string",
      "shortDescription": "string",
      "price": 280.00,
      "originalPrice": 320.00,
      "sku": "string",
      "images": ["string"],
      "ingredients": ["string"],
      "shelfLife": 3,
      "weight": "500g",
      "packSize": "1 Box",
      "taxPercent": 18.00,
      "inventoryQty": 50,
      "isPerishable": true,
      "isBestSeller": true,
      "isFeatured": true,
      "shippingRegions": ["500001", "500002"],
      "category": {
        "id": "string",
        "name": "string",
        "slug": "string"
      },
      "averageRating": 4.8,
      "reviewCount": 25
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

#### Get Product by Slug
```http
GET /api/products/[slug]
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "description": "string",
  "shortDescription": "string",
  "price": 280.00,
  "originalPrice": 320.00,
  "sku": "string",
  "images": ["string"],
  "ingredients": ["string"],
  "shelfLife": 3,
  "weight": "500g",
  "packSize": "1 Box",
  "taxPercent": 18.00,
  "inventoryQty": 50,
  "isPerishable": true,
  "isBestSeller": true,
  "isFeatured": true,
  "shippingRegions": ["500001", "500002"],
  "category": {
    "id": "string",
    "name": "string",
    "slug": "string"
  },
  "averageRating": 4.8,
  "reviewCount": 25,
  "reviews": [
    {
      "id": "string",
      "rating": 5,
      "title": "string",
      "comment": "string",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "user": {
        "name": "string"
      }
    }
  ],
  "relatedProducts": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": 280.00,
      "images": ["string"],
      "category": {
        "name": "string",
        "slug": "string"
      }
    }
  ]
}
```

### Cart Management

#### Get Cart Items
```http
GET /api/cart
```

**Headers:**
- `Cookie`: Session cookie (required)

**Response:**
```json
[
  {
    "id": "string",
    "userId": "string",
    "productId": "string",
    "quantity": 2,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "product": {
      "id": "string",
      "name": "string",
      "price": 280.00,
      "images": ["string"],
      "slug": "string",
      "inventoryQty": 50,
      "isActive": true
    }
  }
]
```

#### Add Item to Cart
```http
POST /api/cart
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "productId": "string",
  "quantity": 1
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "quantity": 2,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "product": {
    "id": "string",
    "name": "string",
    "price": 280.00,
    "images": ["string"],
    "slug": "string"
  }
}
```

#### Update Cart Item Quantity
```http
PUT /api/cart/[productId]
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "quantity": 3
}
```

**Response:**
```json
{
  "id": "string",
  "userId": "string",
  "productId": "string",
  "quantity": 3,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "product": {
    "id": "string",
    "name": "string",
    "price": 280.00,
    "images": ["string"],
    "slug": "string"
  }
}
```

#### Remove Item from Cart
```http
DELETE /api/cart/[productId]
```

**Headers:**
- `Cookie`: Session cookie (required)

**Response:**
```json
{
  "message": "Item removed from cart"
}
```

#### Clear Cart
```http
DELETE /api/cart
```

**Headers:**
- `Cookie`: Session cookie (required)

**Response:**
```json
{
  "message": "Cart cleared"
}
```

### Orders

#### Create Order
```http
POST /api/orders
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "addressId": "string",
  "paymentMethod": "RAZORPAY",
  "deliveryDate": "2024-01-15T00:00:00Z",
  "deliverySlot": "09:00-12:00",
  "couponCode": "WELCOME10",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "orderNumber": "KS123456789",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "RAZORPAY",
  "subtotal": 560.00,
  "taxAmount": 100.80,
  "shippingAmount": 0.00,
  "discountAmount": 56.00,
  "totalAmount": 604.80,
  "deliveryDate": "2024-01-15T00:00:00Z",
  "deliverySlot": "09:00-12:00",
  "createdAt": "2024-01-01T00:00:00Z",
  "razorpayOrderId": "order_123456789",
  "items": [
    {
      "id": "string",
      "productId": "string",
      "quantity": 2,
      "price": 280.00,
      "product": {
        "name": "string",
        "images": ["string"]
      }
    }
  ]
}
```

#### Get Order by ID
```http
GET /api/orders/[orderId]
```

**Headers:**
- `Cookie`: Session cookie (required)

**Response:**
```json
{
  "id": "string",
  "orderNumber": "KS123456789",
  "status": "CONFIRMED",
  "paymentStatus": "PAID",
  "paymentMethod": "RAZORPAY",
  "paymentId": "pay_123456789",
  "subtotal": 560.00,
  "taxAmount": 100.80,
  "shippingAmount": 0.00,
  "discountAmount": 56.00,
  "totalAmount": 604.80,
  "deliveryDate": "2024-01-15T00:00:00Z",
  "deliverySlot": "09:00-12:00",
  "trackingNumber": "TRK123456789",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "address": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "pincode": "string",
    "landmark": "string"
  },
  "items": [
    {
      "id": "string",
      "productId": "string",
      "quantity": 2,
      "price": 280.00,
      "product": {
        "name": "string",
        "images": ["string"],
        "slug": "string"
      }
    }
  ],
  "coupon": {
    "code": "WELCOME10",
    "type": "PERCENTAGE",
    "value": 10.00
  }
}
```

#### Get User Orders
```http
GET /api/orders
```

**Headers:**
- `Cookie`: Session cookie (required)

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by order status

**Response:**
```json
{
  "orders": [
    {
      "id": "string",
      "orderNumber": "KS123456789",
      "status": "CONFIRMED",
      "paymentStatus": "PAID",
      "totalAmount": 604.80,
      "deliveryDate": "2024-01-15T00:00:00Z",
      "createdAt": "2024-01-01T00:00:00Z",
      "items": [
        {
          "product": {
            "name": "string",
            "images": ["string"]
          },
          "quantity": 2,
          "price": 280.00
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Payment

#### Create Razorpay Order
```http
POST /api/payments/create-order
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "orderId": "string",
  "amount": 60480
}
```

**Response:**
```json
{
  "id": "order_123456789",
  "amount": 60480,
  "currency": "INR",
  "receipt": "KS123456789",
  "status": "created",
  "created_at": 1640995200
}
```

#### Verify Payment
```http
POST /api/payments/verify
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "razorpay_order_id": "order_123456789",
  "razorpay_payment_id": "pay_123456789",
  "razorpay_signature": "signature_string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "orderId": "string"
}
```

### Delivery Slots

#### Get Available Delivery Slots
```http
GET /api/delivery-slots
```

**Query Parameters:**
- `date` (string): Date in YYYY-MM-DD format
- `pincode` (string): Delivery pincode

**Response:**
```json
[
  {
    "id": "string",
    "date": "2024-01-15",
    "startTime": "09:00",
    "endTime": "12:00",
    "maxOrders": 50,
    "currentOrders": 25,
    "isActive": true,
    "available": true
  },
  {
    "id": "string",
    "date": "2024-01-15",
    "startTime": "16:00",
    "endTime": "19:00",
    "maxOrders": 50,
    "currentOrders": 40,
    "isActive": true,
    "available": true
  }
]
```

### Coupons

#### Validate Coupon
```http
POST /api/coupons/validate
```

**Headers:**
- `Cookie`: Session cookie (required)
- `Content-Type`: application/json

**Body:**
```json
{
  "code": "WELCOME10",
  "orderAmount": 1000
}
```

**Response:**
```json
{
  "valid": true,
  "coupon": {
    "code": "WELCOME10",
    "type": "PERCENTAGE",
    "value": 10.00,
    "minOrderValue": 500.00,
    "maxDiscount": 200.00
  },
  "discountAmount": 100.00,
  "finalAmount": 900.00
}
```

## Error Responses

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Error Codes

- `INVALID_INPUT` - Invalid request data
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INSUFFICIENT_INVENTORY` - Not enough stock
- `INVALID_COUPON` - Coupon code invalid
- `PAYMENT_FAILED` - Payment processing failed
- `SHIPPING_NOT_AVAILABLE` - Shipping not available for location

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **Payment endpoints**: 5 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Time when the rate limit resets

## Webhooks

### Razorpay Payment Webhook

**Endpoint**: `POST /api/webhooks/razorpay`

**Headers:**
- `X-Razorpay-Signature`: Webhook signature for verification

**Payload**: Razorpay webhook payload

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
// Fetch products
const response = await fetch('/api/products?category=sweets&page=1&limit=12');
const data = await response.json();

// Add to cart
const addToCart = async (productId: string, quantity: number) => {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return response.json();
};

// Create order
const createOrder = async (orderData: any) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });
  return response.json();
};
```

### cURL Examples

```bash
# Get products
curl -X GET "http://localhost:3000/api/products?category=sweets" \
  -H "Cookie: next-auth.session-token=your-session-token"

# Add to cart
curl -X POST "http://localhost:3000/api/cart" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{"productId": "product-id", "quantity": 1}'

# Create order
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=your-session-token" \
  -d '{"addressId": "address-id", "paymentMethod": "RAZORPAY"}'
```

## Testing

Use the provided Postman collection or test the API endpoints using the examples above. Make sure to:

1. Set up authentication (login first)
2. Use proper headers and content types
3. Handle error responses appropriately
4. Respect rate limits

## Support

For API support and questions:
- Email: api-support@kotaiahsweets.com
- Documentation: [Link to detailed docs]
- Issues: [GitHub Issues]
