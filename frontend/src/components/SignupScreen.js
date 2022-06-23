import { Helmet } from 'react-helmet-async';
import Axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
export default function SignupScreen() {
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/');
      toast.success("Account Created Successfully!");
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
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3 text-3xl font-bold">Create Your New Account</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3 flex flex-col">
          <label>Name</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="text"
            name="name"
            placeholder=""
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3 flex flex-col">
          <label>Email</label>
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
          <label>Password</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="password"
            name="password"
            placeholder=""
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 flex flex-col">
          <label>Confirm Password</label>
          <input
            className="max-w-[400px] border-b-2 outline-none border-gray-200"
            type="password"
            name="confirmpassword"
            placeholder=""
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="mb-3 max-w-[400px] flex items-center justify-center ">
          <button
            className="bg-gray-800 p-1 w-[100px]  shadow-md font-semibold border-2 text-gray-200 hover:bg-gray-900"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <div className="mb-3 flex flex-col text-lg">
          Already have an Account?{' '}
          <Link
            className="underline decoration-solid"
            to={`/signin?redirect=${redirect}`}
          >
            Sign-In
          </Link>
        </div>
      </form>
    </div>
  );
}
