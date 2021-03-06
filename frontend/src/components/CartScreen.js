import { useContext } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import MessageBox from '../components/MessageBox';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
export default function CartScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry, this item is out of stock!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success("Item quantity updated successfully!");
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.success("Item removed successfully!");
  };

  const checkoutHandler = () => {
    navigate('/signin?redirect=/shipping');
    toast.success("Proceed To Checkout!");
  };

  return (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center">Shopping Cart</h1>

      <div className="grid grid-cols-2 mt-4 ">
        <div className="">
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <div className="border max-w-[700px] p-4">
              {cartItems.map((item) => (
                <div key={item._id} className="grid grid-cols-4">
                  <div className="flex justify-between items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded h-[80px] transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                    ></img>
                    <div className="text-black"><Link to={`/product/${item.slug}`}>{item.name}</Link></div>
                  </div>
                  <div className="flex items-center ml-8 justify-between">
                    <button
                      onClick={() => updateCartHandler(item, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      <i className="fas fa-minus-circle text-gray-800"></i>
                    </button>{' '}
                    <span className="text-black">{item.quantity}</span>
                    <button
                      onClick={() => updateCartHandler(item, item.quantity + 1)}
                      disabled={item.quantity === item.countInStock}
                    >
                      <i className="fas fa-plus-circle text-gray-800"></i>
                    </button>{' '}
                  </div>
                  <div className="flex items-center ml-8 justify-center text-black">
                    ${item.price}
                  </div>
                  <div className="flex items-center ml-8 justify-center">
                    <button onClick={() => removeItemHandler(item)}>
                      <i className="fas fa-trash transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="border border-gray-200 rounded-sm max-w-[400px] h-[120px]">
            <div>
              <h3 className="text-3xl font-semibold flex items-center justify-center">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                : $ {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </h3>
            </div>
            <div className="flex items-center justify-center mt-4 border-t">
              <button
                disabled={cartItems.length === 0}
                className="mt-[10px] bg-gray-800 p-2  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
