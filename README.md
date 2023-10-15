# Ecommerce-Store

Ecommerce-Store to add, update, remove product, apply discount into cart and checkout the cart amd view statistic.

This code calculates and retrieves applicable discount codes for users in an e-commerce store based on their order history and previously applied discounts. It begins by computing the count of discount codes accessible to a user, considering the number of orders they've placed and the discounts they've already used. If the user is eligible for discounts (accessibleDiscountCodeCount > 0), the code iterates through available discounts, adding those the user hasn't previously used to an array. The loop continues until the user has obtained the required number of discounts or all discounts have been checked. The applicable discount codes are then returned, or an empty array if there are no applicable discounts. This logic ensures users can access discounts in line with the specified order multiple (nthOrder) and their previous discount usage.

# Contents

-   [App Structure](#app-structure)
-   [Install, Configure & Run](#install-configure--run)
-   [List of Routes](#list-of-routes)

# App Structure

```bash
├── dist
├── src
|   ├── assets
│   │   └── products.json
│   ├── errors
|   |   └── customError.ts
│   ├── routes
│   │   ├── admin.ts
│   │   ├── api.ts
│   │   └── cart.ts
│   ├── services
│   │   ├── cart.ts
│   │   ├── product.ts
│   │   ├── store.ts
│   │   ├── userStore.ts
│   │   └── discount.ts
│   ├── tests
|   |   └── services
│   │   │   ├── cart.test.ts
│   │   │   ├── discount.test.ts
│   │   │   ├── product.test.ts
│   │   │   ├── store.test.ts
│   │   │   └── userStore.test.ts
│   └── index.ts
├── .env
├── .gitignore
├── .nvmrc
├── .prettierrc
├── jest.config.js
├── nodemon.json
├── package.json
├── README.md
└── tsconfig.json
```

# Install, Configure & Run

Below mentioned are the steps to install, configure & run on your platform.

```bash
# Clone the repo.
git clone git@github.com:jackavins/ecommerce-store.git;

# Goto the cloned project folder.
cd ecommerce-store;
```

```bash
# Install NPM dependencies.
npm install;

# Build and Run app
npm run build;
npm start;

# Run the app locally
npm run dev;
```

Testing:

```bash
# run all tests
npm run test
```

# List of Routes

```sh
# API Routes:

+--------+-------------------------------------------------------------------------------------------------------------+
  Method  | URI                             | Description
+--------+-------------------------------------------------------------------------------------------------------------+
  GET     | /_health                        | to check server health
  GET     | /api/products                   | to get the products
  GET     | /api/discount                   | to get discount that can be applied based on user
  POST    | /api/checkout                   | to checkout the cart content
  GET     | /api/cart                       | to fetch the cart details
  POST    | /api/cart/product               | to add product to the cart
  PUT     | /api/cart/product/:productId    | to update product in the cart
  DELETE  | /api/cart/product/:productId    | to remove product from the cart
  POST    | /api/cart/discount              | to apply discount code on cart
  DELETE  | /api/cart/discount              | to remove discount code from cart
  POST    | /api/admin/discount             | to add discount code
  GET     | /api/admin/statistics           | to view statistics like - Lists count of items purchased, total purchase amount, etc.
+--------+-------------------------+
```
