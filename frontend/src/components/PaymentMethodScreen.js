import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import CheckoutSteps from './CheckoutSteps';
export default function PaymentMethodScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const navigate = useNavigate();
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || 'PayPal'
  );
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_PAYMENT_METHOD',
      payload: paymentMethodName,
    });
    localStorage.setItem('paymentMethod', paymentMethodName);
    navigate('/placeorder');
    toast.success("Payment Method is Selected!");
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3></CheckoutSteps>
      <div>
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3 text-4xl text-center font-bold">Payment Method</h1>
        <form onSubmit={submitHandler} className="flex flex-col">
          <div className="flex items-center">
            <input
              type="radio"
              name="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className=""
            />
            <i class="fab fa-paypal ml-2"></i>
            <label className="ml-2 font-semibold">PayPal</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === 'Stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <i class="fab fa-cc-stripe ml-2"></i>
            <label className="ml-2 font-semibold">Stripe</label>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="bg-gray-800 p-2 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
            >
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
