import React, { useState } from 'react';
import { Loading } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import { Link } from 'react-router-dom';
import { message } from 'antd';
import { useAddUserMutation } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { useLoginMutation } from '../services/authService';
import { setCredentials } from '../services/authSlice';
import { useGetDistrictsQuery } from '../services/districtService';

export default function Signup() {
  useStateContext();
  let tbg_700 = '#078ece'
  let tbg_600 = '#078eca'

  const navigate = useNavigate();
  const [addUser, { isLoading: addUserLoadding }] = useAddUserMutation();
  const { data: districts } = useGetDistrictsQuery()
console.log(districts)
  const [login] = useLoginMutation()
  const dispatch = useDispatch()

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('last_name').length < 3) return message.error("last name should have 3 or more characters")
    if (data.get('first_name').length < 3) return message.error("first name should have 3 or more characters")
    if (data.get('password') !== data.get('password_confirmation')) {
      return message.error("Password and Confirm Password does not match.")
    }
    if (data.get('password').length < 7 || data.get('password_confirmation').length < 7) return message.error("Password length should be more the 6 ")
    const newUser = {
      firstname: data.get('first_name'),
      lastname: data.get('last_name'),
      email: data.get('email'),
      position: data.get('position'),
      phone_number: data.get('phone_number'),
      locations: data.get('district'),
      password: data.get('password'),
    }
    console.log(newUser)
    try {
      const result = await addUser(newUser).unwrap();
      console.log(result);
      if (result.error) {
        result.error?.data ? message.error(`${result.error?.data.message}: ${JSON.stringify(result.error?.data.errors)}`) : message.error(result.error?.errors)
      } else {
        try {
          const userData = await login({ email: newUser.email, password: newUser.password }).unwrap()
          console.log({ ...userData, email: newUser.password })
          dispatch(setCredentials({ ...userData, email: newUser.email }))
          navigate('/')
        } catch (e) { message.error(JSON.stringify(e)) }
      }
    } catch (e) {
      message.error(JSON.stringify(e));
    }
  };



  return (

    <div className="flex relative dark:bg-main-dark-bg">
      <div className="flex flex-col items-center w-full min-h-screen pt-6 sm:justify-center sm:pt-0 bg-opacity-80 bg-gray-50" >

        {(addUserLoadding) && <Loading />}
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
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white  dark:bg-main-dark-bg shadow-md sm:max-w-lg sm:rounded-lg">


          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2">
              <div>

                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700 undefined dark:text-white"
                >
                  First name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    required
                    minLength={3}
                    name="first_name"
                    className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

              </div>

              <div className='ml-1'>

                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700 undefined dark:text-white"
                >
                  Last name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="last_name"
                    minLength={3}
                    required
                    className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

              </div>
            </div>
            <div className="mt-4 grid grid-cols-2">
              <div>
                <select
                  id="position"
                  name="position"
                  className="block w-full mt-1 py-3 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select Position</option>
                  <option value="Director">Director</option>
                  <option value="Manager">Manager</option>
                  <option value="Operator">Operator</option>
                  <option value="Inspector">Inspector</option>
                  <option value="Minister">Minister</option>
                </select>
              </div>

              <div className="mx-2">
                <select
                  id="district"
                  name="district"
                  className="block w-full mt-1 py-3 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="">Select District</option>
                  {districts?.locations.map((locations) => {
                    return <option key={locations.id} value={locations.name}>{locations.name}</option>
                  })}
                </select>
              </div>
            </div>
            <div className='mt-4 grid grid-cols-2'>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 undefined dark:text-white"
                >
                  Phone number
                </label>
                <div className="flex flex-col items-start">
                  <input
                    id='phone'
                    type="text"
                    name="phone_number"
                    className="block w-full mt-1 p-1 read-only:bg-gray-100 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
              <div className="mx-2">
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
                    className="block w-full mt-1 p-1 read-only:bg-gray-100 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div></div>
            </div>
            <div className="mt-4 grid grid-cols-2">
              <div>

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
                    minLength={6}
                    className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

              </div>
              <div className="ml-1">
                <label
                  htmlFor="password_confirmation"
                  className="block text-sm font-medium text-gray-700 undefined dark:text-white"
                >
                  Confirm Password
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="password"
                    minLength={6}
                    required
                    name="password_confirmation"
                    className="block w-full mt-1 p-1 border-gray-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button disabled={addUserLoadding} style={{ backgroundColor: tbg_700 }} className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md hover:shadow-2xl focus:outline-none`}>
                Sign up
              </button>
            </div>
          </form>
          <div className="mt-4 dark:text-white text-grey-600">
            Already have an account?{" "}
            <span>
              <Link style={{ color: tbg_600 }} className={`hover:underline`} to="/signin">
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}