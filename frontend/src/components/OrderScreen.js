import React, { useContext, useEffect, useReducer } from 'react';
import LoadingBox from './LoadingBox';
import MessageBox from './MessageBox';
import { Store } from '../Store';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };
    default:
      return state;
  }
};

export default function OrderScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [{ loading, error, order, successPay, loadingPay }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
      order: {},
      successPay: false,
      loadingPay: false,
    });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.getError(err);
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (!order._id || successPay || (order._id && order._id !== orderId)) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [order, userInfo, orderId, navigate, paypalDispatch, successPay]);

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3 text-3xl font-semibold">Order {orderId}</h1>
      <div className="grid grid-cols-2">
        <div>
          <div className="mb-3 border border-gray-300 p-2 rounded-md">
            <h2 className="text-xl font-semibold">Shipping</h2>
            <div>
              <strong>Name:</strong> {order.shippingAddress.fullName} <br />
              <strong>Address:</strong> {order.shippingAddress.address},
              {order.shippingAddress.city},{order.shippingAddress.postalCode},
              {order.shippingAddress.country} <br />
            </div>
            {order.isDelivered ? (
              <MessageBox> Delivered at {order.deliveredAt}</MessageBox>
            ) : (
              <MessageBox>Not Delivered</MessageBox>
            )}
          </div>

          <div className="mb-3 border border-gray-300 p-2 rounded-md">
            <h2 className="text-xl font-semibold">Payment</h2>
            <div>
              <strong>Method:</strong> {order.paymentMethod} <br />
            </div>
            {order.isPaid ? (
              <MessageBox> Paid at {order.paidAt}</MessageBox>
            ) : (
              <MessageBox>Not Paid</MessageBox>
            )}
          </div>

          <div className="mb-3 border border-gray-300 p-2 rounded-md">
            <h2 className="text-xl font-semibold"> Order Items</h2>
            <div>
              {order.orderItems.map((item) => (
                <div key={item._id}>
                  <div className="grid grid-cols-3">
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded h-[80px]"
                      ></img>{' '}
                      <Link to={`/product/${item.slug}`} className="underline">
                        {item.name}
                      </Link>
                    </div>
                    <div>
                      <span>{item.quantity}</span>
                    </div>
                    <div>${item.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-3 border border-gray-300 p-2 rounded-md ml-4 max-w-[400px]">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <div className="my-2">
              <div className="grid grid-cols-2 my-2 max-w-[250px]">
                <div className="font-semibold">Items</div>
                <div className="font-semibold">
                  ${order.itemsPrice.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 my-2 border-t border-gray-300 max-w-[250px]">
                <div className="font-semibold">Shipping</div>
                <div className="font-semibold">
                  ${order.shippingPrice.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 my-2 border-t border-gray-300 max-w-[250px]">
                <div className="font-semibold">Tax</div>
                <div className="font-semibold">
                  ${order.taxPrice.toFixed(2)}
                </div>
              </div>
              <div className="grid grid-cols-2 my-2 border-t border-b mb-4 border-gray-300 max-w-[250px]">
                <div className="font-semibold">Order Total</div>
                <div className="font-semibold">
                  ${order.totalPrice.toFixed(2)}
                </div>
              </div>
            </div>
            {!order.isPaid && (
              <div>
                {isPending ? (
                  <LoadingBox />
                ) : (
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                )}
                {loadingPay && <LoadingBox></LoadingBox>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
