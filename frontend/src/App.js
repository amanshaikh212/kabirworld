import { useContext } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CartScreen from './components/CartScreen';
import HomeScreen from './components/HomeScreen';
import ProductScreen from './components/ProductScreen';
import SigninScreen from './components/SigninScreen';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from './Store';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
  };

  return (
    <BrowserRouter>
      <div className="App container flex flex-col min-h-screen">
        <ToastContainer position="bottom-center" limit={1} />
        <header className="bg-gray-800 p-2">
          <Link className="text-white font-bold " to="/">
            kabirworld
          </Link>
          <Link to="/cart" className="text-orange-400 m-2">
            Cart
            {cart.cartItems.length > 0 && (
              <span class="inline-flex items-center p-1 mr-2 text-sm font-semibold text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div class="dropdown">
              <span className="bg-orange-400 p-1 rounded-md">
                {userInfo.name}
              </span>
              <div class="dropdown-content">
                <p className="mb-2">
                  <Link to="/profile">Profile</Link>
                </p>
                <p className="mb-2">
                  <Link to="/orderhistory">Order History</Link>
                </p>
                <p>
                  <Link
                    className="mt-2 border-1"
                    to="#signout"
                    onClick={signoutHandler}
                  >
                    Signout
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            <Link to="/signin" className="bg-orange-400 p-1 rounded-md">
              Sign In
            </Link>
          )}
        </header>
        <main className="container flex-1">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
