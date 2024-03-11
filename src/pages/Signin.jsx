import React from 'react';
import { Loading } from '../components';

import { useStateContext } from '../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import { useLoginMutation } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../services/authSlice';


export default function Signin() {
  let tbg_700 = '#078ece'
  let tbg_600 = '#078eca'

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const userData = await login({ email: data.get('email'), password: data.get('password') }).unwrap()
      // console.log({ ...userData})
      dispatch(setCredentials({ ...userData }))
      navigate('/')
    } catch (e) { message.error(JSON.stringify(e)) }
  };

  return (

    <div className="flex relative dark:bg-main-dark-bg">

      <div className="flex flex-col items-center w-full min-h-screen pt-6 sm:justify-center sm:pt-0 bg-opacity-80 bg-gray-50" >
        <div>
          <a href="/">
              {(loginLoading) && <Loading />}
              <div className='flex mb-4'>
                <img className='rounded h-40' src='/logo.png' />
                <div className='ml-4 mt-16'>
                  <h3 className={`text-4xl font-bold`}>
                    MINICOM
                  </h3>
                </div>
              </div>


              <h3 style={{ color: tbg_600 }} className={`text-4xl font-bold`}>
                Cross Border Market
              </h3>
          </a>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-100  dark:bg-main-dark-bg shadow-md sm:max-w-lg sm:rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined dark:text-white"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 undefined dark:text-white"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  required
                  className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            <Link to="/forgot-password" style={{ color: tbg_600 }}
              className={`text-xs hover:underline`}
            >
              Forget Password?
            </Link>
            <div className="flex items-center mt-4">
              <button disabled={loginLoading} style={{ backgroundColor: tbg_700 }} className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md hover:shadow-2xl focus:outline-none`}>
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-4 dark:text-white text-grey-600">
            Already have an account?{" "}
            <span>
              <Link style={{ color: tbg_600 }} className={`hover:underline`} to='/signup'>
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}