import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utlis';
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
      <h1 className="my-3 text-3xl font-semibold">Sign in</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3 flex flex-col">
          <label>Email</label>
          <input
            className="border max-w-[400px] rounded-md p-1 mt-2"
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3 flex flex-col">
          <label>Password</label>
          <input
            className="border max-w-[400px] rounded-md p-1 mt-2"
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 max-w-[400px] flex items-center justify-center ">
          <button
            className="bg-yellow-400 p-2 rounded-md shadow-md"
            type="submit"
          >
            Sign in
          </button>
        </div>
        <div className="mb-3">
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
