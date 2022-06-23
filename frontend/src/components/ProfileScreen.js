import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    default:
      return state;
  }
};

export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [{ loadingUpdate }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
  });
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          name,
          email,
          password,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({
        type: 'UPDATE_FAIL',
      });
      toast.error(getError(err));
    }
  };
  return (
    <div>
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1 className="my-3 text-4xl font-bold text-center">User Profile</h1>
      <form onSubmit={submitHandler} className="flex flex-col">
        <div className="my-3 flex flex-col">
          <label className="text-gray-600">Name</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="my-3 flex flex-col">
          <label className="text-gray-600">Email</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="my-3 flex flex-col">
          <label className="text-gray-600">Password</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="my-3 flex flex-col">
          <label className="text-gray-600">Confirm Password</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="my-3">
          <button
            className="bg-gray-800 p-1 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}
