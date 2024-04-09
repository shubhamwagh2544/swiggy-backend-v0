# Swiggy-v0

## Project Description

Swiggy-v0 is a sophisticated web application designed to revolutionize the food delivery experience, offering users seamless access to a wide range of restaurants and cuisines. With a focus on user convenience and efficiency, Swiggy-v0 provides an intuitive platform for browsing menus, placing orders, and tracking deliveries in real-time.

## Installation

1. Clone the repository:
```
git clone <repository-url>
```
2. Install Dependencies:
```
cd backend && npm install
```
3. Set up ENV variables
4. Start application:
```
cd backend && npm run dev
```

## Key Features

1. **User Authentication:** Swiggy-v0 ensures secure access to user accounts with robust authentication features, including login, logout, and profile management functionalities.

2. **Restaurant Management:** For restaurant owners, Swiggy-v0 offers comprehensive management tools, enabling them to create and manage menus, update restaurant details, and monitor orders effectively.

3. **Order Management:** Swiggy-v0 facilitates seamless order management with features such as order status updates, order items for restaurant cards, and tabs under manage restaurant for efficient operations.

4. **Search and Filtering:** Users can easily discover restaurants based on their preferences using Swiggy-v0's advanced search and filtering capabilities, including cuisine filters, sorting options, and a user-friendly search bar.

5. **Payment Integration:** Swiggy-v0 integrates Stripe for secure payment processing, allowing users to proceed to payment seamlessly and providing custom hooks for checkout sessions.

6. **Notification System:** Swiggy-v0 keeps users informed about important updates and actions with a built-in notification system, featuring toasts for real-time notifications.

## Tech Stack

- **Backend Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Auth0 + JSON Web Tokens (JWT)
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **HTTP Middleware:** CORS
- **Environment Variables Management:** dotenv
- **Validation:** Express Validator
- **Real-time Communication:** Stripe Webhooks
- **Dependency Management:** npm

## Deployment

A live demo of the Swiggy-v0 application is available [here](https://swiggy-v0-server.onrender.com/), providing users with the opportunity to explore its features firsthand.
