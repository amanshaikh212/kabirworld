import axios from 'axios';
import { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { getError } from '../utlis';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import Rating from './Rating';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, product: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function ProductScreen() {
  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry, this item is out of stock!');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
    navigate('/cart');
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <div className="grid grid-cols-3">
      <div>
        <img className="max-w-screen" src={product.image} alt={product.name} />
      </div>
      <div className="flex flex-col">
        <div>
          <Helmet>
            <title>{product.name}</title>
          </Helmet>
          <h1 className="font-bold text-5xl">{product.name}</h1>
        </div>
        <div className="mt-4 border-t-2">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
        <div className="mt-4 border-t-2 font-bold text-xl">
          Price: ${product.price}
        </div>
        <div className="mt-4 font-bold border-t-2 text-xl">
          Description{' '}
          <p className="mt-2 font-semibold text-lg">{product.description}</p>
        </div>
      </div>
      <div className="flex flex-col border-2 max-h-60 max-w-xs p-4 m-4">
        <div className="flex justify-between max-w-xs">
          <span>Price </span> <span> ${product.price} </span>
        </div>
        <div className="flex flex-col text-center max-w-xs border-t-2 mt-4">
          <span className="font-bold text-lg mb-4">Status </span>{' '}
          <span>
            {product.countInStock > 0 ? (
              <button className="bg-green-500 font-bold p-2 rounded-md">
                Available
              </button>
            ) : (
              <button className="bg-red-500 font-bold p-2 rounded-md">
                Unavailable
              </button>
            )}
          </span>
        </div>
        {product.countInStock > 0 && (
          <div className="text-center mt-4 border-t-2">
            <button
              onClick={addToCartHandler}
              className="bg-orange-400 p-2 rounded-md mt-4"
            >
              Add to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductScreen;
