import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CartScreen from './components/CartScreen';
import HomeScreen from './components/HomeScreen';
import ProductScreen from './components/ProductScreen';
import SigninScreen from './components/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from './Store';
import ShippingAdress from './components/ShippingAdress';
import SignupScreen from './components/SignupScreen';
import PaymentMethodScreen from './components/PaymentMethodScreen';
import PlaceOrderScreen from './components/PlaceOrderScreen';
import OrderScreen from './components/OrderScreen';
import OrderHistoryScreen from './components/OrderHistoryScreen';
import ProfileScreen from './components/ProfileScreen';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './components/SearchScreen';
function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    toast.success('Logged Out Successfully!');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? 'App container flex flex-col min-h-screen active-cont'
            : 'App container flex flex-col min-h-screen'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header className="bg-black shadow-lg p-2 h-[60px] sticky top-0 ">
          <div className="flex justify-between ">
            <button className="" onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
              <i className="fas fa-bars text-white"></i>
            </button>
            <div className="">

            <SearchBox />
            </div>
            <div className="flex items-center">
              <Link className="text-white font-bold text-xl left-0" to="/">
                KABIRWORLD
              </Link>
            </div>
            
            <div className="flex items-center mx-4 ">
              
              <div className="mr-4">
                {userInfo ? (
                  <div class="dropdown">
                    <span className="text-gray-100 p-2 font-semibold">
                      {userInfo.name}
                    </span>
                    <i className="fas fa-caret-down text-gray-100 dd-icon"></i>
                    <div className="dropdown-content">
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
                  <Link
                    to="/signin"
                    className="bg-black p-1 w-[100px]  shadow-md font-semibold  text-gray-200 hover:bg-gray-900"
                  >
                    Sign In
                  </Link>
                )}
              </div>
              <Link to="/cart" className="text-white font-semibold m-2">
                CART
                <i className="fas fa-cart-arrow-down text-gray-100 ml-2"></i>
                {cart.cartItems.length > 0 && (
                  <span className="absolute min-w-[1.2em] top-[1em] left-[116em] h-[1.2em] rounded-[0.8em] border-[0.05em] border-white bg-gray-100 flex justify-center items-center text-[0.8em] text-gray-900">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <div className="flex flex-col text-white w-100 p-2">
            <div className="flex justify-between">
              <strong>Categories</strong>
              <div>
                <button onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                  <i className="fas fa-bars text-white"></i>
                </button>
              </div>
            </div>

            {categories.map((category) => (
              <div key={category}>
                <div>
                  <Link
                    to={`/search?category=${category}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {category}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <main className="container flex-1">
          <Routes>
            <Route path="/product/:slug" element={<ProductScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/search" element={<SearchScreen />}/>
            <Route path="/signin" element={<SigninScreen />} />
            <Route path="/signup" element={<SignupScreen />} />

            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/orderhistory" element={<OrderHistoryScreen />} />
            <Route path="/shipping" element={<ShippingAdress />} />
            <Route path="/payment" element={<PaymentMethodScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />

            <Route path="/" element={<HomeScreen />} />
          </Routes>
        </main>
        <footer>
          <div className="text-center bg-black text-white py-2">
            <span className="mr-4 text-center">
              <i className="fas fa-copyright"></i> KABIRWORLD{' '}
            </span>
            All rights reserved
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
