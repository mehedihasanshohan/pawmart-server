# 🐾 PawMart Server — Backend API

**Live API:** [https://pawmart-server.vercel.app](#)
**Client Repository:** [https://github.com/mehedihasanshohan/pawmart-client](#)
**Server Repository:** [https://github.com/mehedihasanshohan/pawmart-server](#)

---

## 🧠 Overview

This is the **backend server** for **PawMart — Pet Adoption & Supply Portal**, a community-based application that allows users to adopt pets and buy/sell pet-related products.

The server is built with **Node.js**, **Express**, and **MongoDB**, providing RESTful APIs for all CRUD operations such as managing listings, orders, and user data.

---

## 🚀 Key Features

- 🗃️ **MongoDB Database Integration** — Stores all listings and orders
- 📤 **CRUD APIs** — Add, update, delete, and retrieve listings and orders
- 🔐 **Firebase Authentication Integration** — Supports secure access to private routes
- 🧾 **Order Management** — Handles user adoption and purchase requests
- 🛍️ **Category Filtering API** — Retrieve listings by category
- ⚙️ **Environment Configuration** — Using `.env` for sensitive data
- 🌐 **CORS Enabled** — Safe communication between client and server
- 🚀 **Deployed on Vercel**

---

## 🗂️ API Endpoints

### 🐕 Listings Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/listings` | Get all listings |
| `GET` | `/listing/:id` | Get a single listing by ID |
| `POST` | `/listings` | Add a new listing |
| `PUT` | `/listing/:id` | Update a listing |
| `DELETE` | `/listing/:id` | Delete a listing |
| `GET` | `/mylistings/:email` | Get listings created by a specific user |
| `GET` | `/category-filtered-product/:category` | Get listings by category |

### 📦 Orders Routes
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/orders` | Get all orders |
| `GET` | `/myorders/:email` | Get orders by logged-in user |
| `POST` | `/orders` | Place a new order |
| `DELETE` | `/orders/:id` | Delete an order (optional) |

---

## 🧩 Database Structure

### 🐕 Collection: `listings`
```json
{
  "name": "Golden Retriever Puppy",
  "category": "Pets",
  "price": 0,
  "location": "Dhaka",
  "description": "Friendly 2-month-old puppy available for adoption.",
  "image": "https://example.com/golden.jpg",
  "email": "owner@gmail.com",
  "date": "2025-10-27"
}
