import React from 'react';
import { Loading } from '../components';

import { useStateContext } from '../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../services/authService';
import { message } from 'antd';

export default function ForgotPassword() {  
  useStateContext();
  let tbg_700 ='#105b93'
  let tbg_600 ='#1579c4'

  const [resetPassword, {isLoading: resetLoading}] = useResetPasswordMutation();
  const handleSubmit = async(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const result = await resetPassword({ email: data.get('email') })
    console.log(result)
    if(result?.data === 'ok') { message.success("Password reset link has been sent to your email "+data.get('email'));} else {
      result.error?.code ? message.error(result.error.code) : message.error(result?.error?.message)
    }
  };

  return (

    <div className="flex relative dark:bg-main-dark-bg">

    <div className="flex flex-col items-center w-full min-h-screen pt-6 sm:justify-center sm:pt-0 bg-opacity-80 bg-gray-50" >
      <div>
        <a href="/">
            {(resetLoading) && <Loading />}
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
                  className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div className="flex items-center mt-4">
              <button disabled={resetLoading} style={{backgroundColor: tbg_700}} className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md hover:shadow-2xl focus:outline-none`}>
                Send reset link
              </button>
            </div>
          </form>
          <div className="mt-4 dark:text-white text-grey-600">
            Already have an account?{" "}
            <span>
              <Link style={{color: tbg_600}} className={`hover:underline`} to='/signin'>
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}