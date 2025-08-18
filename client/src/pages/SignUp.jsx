import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl'>Sign In</h1>
      <form
        onSubmit={handleSubmit}
        className='mt-4'>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>Name</label>
          <input
            onChange={handleChange}
            type='text'
            className='mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'

            placeholder='Enter your Name'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            onChange={handleChange}
            type='email'
            className='mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'

            placeholder='Enter your email'
          />
        </div>
        <div className='mb-4'>
          <label
            className='block text-sm font-medium text-gray-700'>Password</label>
          <input
            onChange={handleChange}
            type='password'
            className='mt-1 block w-full px-3 py-2 border border-gray border-solid rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'

            placeholder='Enter your password'
          />
        </div>
        <button
          type='submit'
          className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
        >
          Sign Up
        </button>
        <button type='button' className='w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 mt-2'>Continue with Google</button>
        <p className='mt-4 text-sm text-gray-600'>
          Already have an account? <Link to='/sign-in' className='text-blue-500 hover:underline'>Sign In</Link>
        </p>
      </form>
    </div>
  )
}

export default SignUp;
