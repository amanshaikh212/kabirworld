import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from './CheckoutSteps';
export default function ShippingAdress() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  useEffect(() => {
    if (!userInfo) {
      navigate('/signin?redirect=/shipping');
    }
  }, [userInfo,navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    localStorage.setItem(
      'shippingAddress',
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    navigate('/payment');
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <CheckoutSteps step1 step2 />
      <h1 className="my-3 text-4xl font-bold text-center">Shipping Address</h1>
      <form onSubmit={submitHandler} className="flex flex-col">
        <label className="font-semibold text-sm mt-4 text-gray-600">Full Name</label>
        <input
          className=" max-w-[400px] border-b-2 outline-none border-gray-200 "
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        
        <label className="font-semibold text-sm mt-4 text-gray-600">Address</label>
        <input
          className="max-w-[400px] border-b-2 outline-none border-gray-200 "
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label className="font-semibold text-sm mt-4 text-gray-600">City</label>
        <input
          className="max-w-[400px] border-b-2 outline-none border-gray-200 "
          name="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <label className="font-semibold text-sm mt-4 text-gray-600">Postal Code</label>
        <input
          className="max-w-[400px] border-b-2 outline-none border-gray-200 "
          name="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />

        <label className="font-semibold text-sm mt-4 text-gray-600">Country</label>
        <input
          className="max-w-[400px] border-b-2 outline-none border-gray-200 "
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />

        <button
          className="max-w-[100px] mt-[20px] bg-gray-800 p-2 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
          type="submit"
        >
          Proceed
        </button>
      </form>
    </div>
  );
}
