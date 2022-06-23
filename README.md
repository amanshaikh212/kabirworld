# MERN KABIR world

# Stages

# Install Tools

# Create React App

# Create Git Repository

5. List Products
   # create product array
   # add product images
   # render products
   # style products
6. Add routing

   1. npm i react-router-dom
   2. create route for home-screen
   3. create route for product-screen

7. Create Node.js Server

   1. run npm init in root folder
   2. update package.json set type: module
   3. Add .js to imports
   4. npm install express
   5. create server.js
   6. add start command as backend/server.js
   7. require express
   8. create route for / return backend is ready
   9. move products.js from frontend to backend
   10. create route for /api/products
   11. return products
   12. run npm start

8. Fetch Products from Backend

   1. set proxy in package.json
   2. npm install axios
   3. use state hook
   4. use effect hook
   5. use reducer hook

9. Manage state by reducer hook
   1. Define reducer
   2. update fetch data
   3. get state from useReducer
10. Add tailwind //done

11. Create Product and Rating component

    1. create rating component
    2. create product component
    3. use rating component in product component

12. Create Product Screen

    1. fetch product from Backend
    2. create 3 cols for image, info and action

13. Create Loading and Message component

    1. create loading component
    2. use spinner component
    3. create message component
    4. create utils.js to define getError function

14. Implement Add to Cart

    1. Create React context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler

15. Complete Add to Cart

    1. check exist item in the cart
    2. check count in stock in backend

16. Create Cart Screen

    1. create 2 cols
    2. display items list
    3. create action col

17. Complete Cart screen

    1. click handler for inc/dec item
    2. click handler for remove item
    3. click handler for checkout

18. Create sign in screen

    1. create sign in form
    2. add email and password
    3. add signin button

19. connect to mongodb database

    1. create atlas mongodb database
    2. install local mongodb database
    3. npm install mongoose
    4. connect to mongodb database

20. Seed Sample Data

    1. create product model
    2. create user model
    3. create seed route
    4. use route in server.js
    5. seed sample product

21. Seed Sample Users

    1. create user model
    2. seed sample users
    3. create user routes

22. Create sign in backend api

    1. create sign in api
    2. npm install jsonwebtoken
    3. define generateToken

23. complete sign in Screen

    1. handle submit
    2. save token in store and local storage
    3. show username in header

24. Create Shipping Screen
    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar
25. Create Sign up screen

    1. create input forms
    2. handle submit
    3. create backend api

26. Select payment method screen

    1. create input forms
    2. handle submit

27. Create Place order Screen

    1. show cart items, payment and address
    2. handle place order action
    3. create order api

28. Create Order Screen

    1. create backend api for order/:id
    2. fetch order api in frontend
    3. show order information in 2 cols

29. Pay Order by Paypal

    1. generate paypal client id
    2. create api to return client id
    3. install react-paypal-js
    4. use PayPalScriptProvider in index.js
    5. use usePayPalScriptReducer in Order screen
    6. implement loadPayPalScript function
    7. render PayPal button
    8. implement onApprove payment Function
    9. create pay order api in backend

30. Display Order History
    1. create order screen
    2. create order history api
    3. use api in the frontend
31. Create Profile screen
    1. get user info from context
    2. show user information
    3. create user update api
    4. update user info
