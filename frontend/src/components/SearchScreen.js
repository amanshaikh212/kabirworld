import axios from 'axios';
import React, { useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import Product from './Product';
import Rating from './Rating';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL': {
      return { ...state, loading: false, error: action.payload };
    }
    default:
      return state;
  }
};
const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];
export const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },

  {
    name: '3stars & up',
    rating: 3,
  },

  {
    name: '2stars & up',
    rating: 2,
  },

  {
    name: '1stars & up',
    rating: 1,
  },
];

export default function SearchScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search); // /search?category=Shirts
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const price = sp.get('price') || 'all';
  const rating = sp.get('rating') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, error, order, page, price, query, rating]);
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
  }, [dispatch]);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const sortOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>Search Products</title>
      </Helmet>
      <div className="grid grid-cols-2">
        <div className="w-1/4">
          <h3 className="text-3xl font-semibold">Department</h3>
          <div className="">
            <ul className="flex flex-col justify-center items-center">
              <li>
                <Link
                  className={'all' === category ? 'font-bold text-blue-800 underline underline-offset-2' : 'text-blue-800 font-semibold underline underline-offset-2'}
                  to={getFilterUrl({ category: 'all' })}
                >
                  Any
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    className={c === category ? 'font-bold text-blue-800 underline underline-offset-2 ' : 'text-blue-800 font-semibold underline underline-offset-2'}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h3 className="text-3xl font-semibold">Price</h3>
            <ul className="flex flex-col justify-center items-center">
              <li>
                <Link
                  className={'all' === price ? 'font-bold text-blue-800 underline underline-offset-2' : 'text-blue-800 font-semibold underline underline-offset-2'}
                  to={getFilterUrl({ price: 'all' })}
                >
                  Any
                </Link>
              </li>
              {prices.map((p) => (
                <li key={p.value}>
                  <Link
                    to={getFilterUrl({ price: p.value })}
                    className={p.value === price ? 'font-bold text-blue-800 underline underline-offset-2' : 'text-blue-800 font-semibold underline underline-offset-2'}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            <h3 className="text-3xl font-semibold">Ratings</h3>
            <ul className="flex flex-col justify-center items-center">
              {ratings.map((r) => (
                <li key={r.name}>
                  <Link
                    to={getFilterUrl({ rating: r.rating })}
                    className={`${r.rating}` === `${rating}` ? 'font-bold' : ''}
                  >
                    <Rating rating={r.rating}></Rating>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={getFilterUrl({ rating: 'all' })}
                  className={rating === 'all' ? 'font-bold' : ''}
                >
                  <Rating rating={0}></Rating>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="">
          <div className="">
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox>{error}</MessageBox>
            ) : (
              <>
                <div className="grid grid-cols-2 justify-between mb-3">
                  <div className="font-semibold">
                    {countProducts === 0 ? 'No' : countProducts} Results
                    {query !== 'all' && ' : ' + query}
                    {category !== 'all' && ' : ' + category}
                    {price !== 'all' && ' : Price ' + price}
                    {rating !== 'all' && ' : Rating ' + rating + ' & up'}
                    {query !== 'all' ||
                    category !== 'all' ||
                    rating !== 'all' ||
                    price !== 'all' ? (
                      <button onClick={() => navigate('/search')}>
                        <i className="fa fa-times-circle ml-2"></i>
                      </button>
                    ) : null}
                  </div>
                  <div className="font-semibold w-[250px] px-2 border-black">
                    <span className="">Sort by{' '}</span>
                    <select className="focus:outline-none border-black bg-black text-white"
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option value="newest">Newest Arrivals</option>
                      <option value="lowest">Price: Low to High</option>
                      <option value="highest">Price:High to Low</option>
                    </select>
                  </div>
                </div>

                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <div className="flex flex-row flex-wrap justify-center">
                  {products.map((product) => (
                    <div className="mb-3" key={product._id}>
                      <Product product={product}></Product>
                    </div>
                  ))}
                </div>
                <div>
                  {[...Array(pages).keys()].map((x) => (
                    <Link
                      key={x + 1}
                      className="mx-1"
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      <button
                        className={Number(page) === x + 1 ? 'text-bold bg-black p-1 text-white w-[30px] mx-4' : ''}
                      >
                        {x + 1}
                      </button>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
