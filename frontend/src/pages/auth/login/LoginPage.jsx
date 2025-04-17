import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AtSign, Lock, Eye, EyeOff } from 'lucide-react';

import SignInIllustration from '../../../assets/illustrations/sign-in-illustration.svg';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to login');
        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-md flex max-w-4xl w-full overflow-hidden'>
        {/* Left Panel */}
        <div className='w-1/2 bg-primary text-white p-10 hidden lg:flex flex-col justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold mb-4'>Welcome Back</h1>
            <p className='text-md opacity-90'>Ready to share your next tale?</p>
          </div>
          <img src={SignInIllustration} alt='login' />
        </div>

        {/* Right Panel */}
        <div className='w-full lg:w-1/2 p-8 sm:p-14'>
          <h2 className='text-3xl font-bold text-primary mb-8'>
            Login to TaleHaven
          </h2>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            {/* Email Field */}
            <label className='input input-bordered flex items-center w-full text-base-content gap-2'>
              <AtSign size={20} />
              <input
                type='text'
                name='username'
                placeholder='Username'
                className='grow'
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </label>

            {/* Password Field */}
            <label className='input input-bordered flex items-center w-full text-base-content gap-2'>
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                className='grow'
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {/* Submit Button */}
            <button
              type='submit'
              className='btn btn-primary hover:bg-[#372b7c] text-white font-semibold w-full rounded-full'
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Sign In'}
            </button>
            {isError && <p className='text-red-500'>{error.message}</p>}
          </form>

          {/* Link to Sign Up */}
          <div className='flex flex-col gap-3 mt-6 w-full'>
            <p className='text-base-content text-md text-center lg:text-left'>
              Don't have an account?
            </p>
            <Link to='/signup' className='w-full'>
              <button className='btn w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition duration-200'>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
