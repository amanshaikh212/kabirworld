import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
export default function SigninScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post('/api/users/signin', {
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="max-w-[600px]">
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <h1 className="my-3 text-3xl font-bold">Log in to your account</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3 flex flex-col">
          <label className="text-gray-600">Email</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="email"
            name="email"
            placeholder=""
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 flex flex-col">
          <label className="text-gray-600">Password</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="password"
            name="password"
            placeholder=""
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 max-w-[400px] flex items-center justify-center ">
          <button
            className="bg-gray-800 p-1 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
            type="submit"
          >
            Sign in
          </button>
        </div>
        <div className="mb-3 flex flex-col text-lg">
          New Customer?{' '}
          <Link
            className="underline decoration-solid"
            to={`/signup?redirect=${redirect}`}
          >
            Create your account
          </Link>
        </div>
      </form>
    </div>
  );
}
