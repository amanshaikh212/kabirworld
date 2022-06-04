import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

function Product(props) {
  const { product } = props;
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { cartItems },
  } = state;
  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const {data} = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, this item is out of stock!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  }
  return (
    <div className="border-2 border-black m-2" >
      <Link to={`/product/${product.slug}`}>
        <img
          className="w-full max-w-sm"
          src={product.image}
          alt={product.name}
        />
      </Link>
      <div className="p-2">
        <Link to={`/product/${product.slug}`}>
          <p className="font-bold text-orange-800 text-center mt-4">{product.name}</p>
        </Link>
        <div className="flex justify-between">
        <Rating rating={product.rating} numReviews={product.numReviews} />

        <p className="flex items-center">
          <strong className="text-gray-900 ">${product.price}</strong>
        </p>
        </div>
        <div className="flex items-center justify-center mt-4">
        {product.countInStock === 0? <button disabled>Out of stock</button>:
        <button className="bg-red-500 p-2 rounded-md shadow-md font-bold border-2" onClick={()=>addToCartHandler(product)}>Add to Cart</button>
        }
        </div>
      </div>
    </div>
  );
}

export default Product;
