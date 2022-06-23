import axios from 'axios';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry, this item is out of stock!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success("Product Added To Cart!");
  };
  return (
    <div className="mt-[60px]">
      <Link to={`/product/${product.slug}`}>
        <img
          className="w-full max-w-xs transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
          src={product.image}
          alt={product.name}
        />
      </Link>
      <div className="p-2">
        <Link to={`/product/${product.slug}`}>
          <p className="font-semibold text-gray-800 mt-4">
            {product.name}
          </p>
        </Link>
        <div className="flex flex-col">
          <Rating rating={product.rating}/>

          <p className="flex items-center">
            <strong className="text-gray-900 ">${product.price}</strong>
          </p>
        </div>
        <div className="flex mt-4">
          {product.countInStock === 0 ? (
            <button disabled>Out of stock</button>
          ) : (
            <button
              className="bg-gray-800 p-2 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
              onClick={() => addToCartHandler(product)}
            >
              BUY
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Product;
