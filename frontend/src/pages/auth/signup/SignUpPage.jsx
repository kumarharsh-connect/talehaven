import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Mail, User, Lock, AtSign, Eye, EyeOff } from 'lucide-react';

import SignUpIllustration from '../../../assets/illustrations/sign-up-illustration.svg';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    fullName: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const {
    mutate: signupMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create account');
        console.log(data);
        return data;
      } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Something went wrong!');
      }
    },

    onSuccess: () => {
      toast.success('Account created successfully');
      setFormData({
        email: '',
        username: '',
        fullName: '',
        password: '',
      });
      setShowPassword(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signupMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-md flex max-w-4xl w-full overflow-hidden'>
        {/* Left Panel */}
        <div className='w-1/2 bg-primary text-white p-10 hidden lg:flex flex-col justify-between'>
          <div>
            <h1 className='text-3xl font-extrabold mb-4'>
              Welcome to TaleHaven
            </h1>
            <p className='text-md opacity-90'>Find Your Voice in the Haven</p>
          </div>
          <img
            src={SignUpIllustration}
            alt='signup'
            className='w-full mt-10 object-contain'
          />
        </div>

        {/* Right Panel */}
        <div className='w-full lg:w-1/2 p-8 sm:p-12'>
          <h2 className='text-3xl font-bold text-primary mb-6'>
            Create your account
          </h2>

          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            {/* Email Field */}
            <label className='input input-bordered flex items-center gap-2 w-full text-base-content'>
              <Mail size={20} />
              <input
                type='email'
                name='email'
                placeholder='Email'
                className='grow'
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>

            {/* Username & Full Name */}
            <div className='flex gap-4 flex-wrap'>
              <label className='input input-bordered flex items-center gap-2 flex-1 text-base-content'>
                <AtSign size={20} />
                <input
                  type='text'
                  name='username'
                  placeholder='Username'
                  className='grow'
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
              </label>
              <label className='input input-bordered flex items-center gap-2 flex-1 text-base-content'>
                <User size={20} />
                <input
                  type='text'
                  name='fullName'
                  placeholder='Full Name'
                  className='grow'
                  onChange={handleInputChange}
                  value={formData.fullName}
                  required
                />
              </label>
            </div>

            {/* Password Field */}
            <label className='input input-bordered flex items-center gap-2 w-full text-base-content'>
              <Lock size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Password'
                className='grow'
                onChange={handleInputChange}
                value={formData.password}
                required
              />
              <button
                type='button'
                className='cursor-pointer'
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {/* Submit Button */}
            <button
              type='submit'
              className='btn btn-primary bg-primary hover:bg-[#372b7c] text-white font-semibold w-full rounded-full transition-colors duration-200'
              disabled={isPending}
            >
              {isPending ? 'Loading...' : 'Sign Up'}
            </button>
            {isError && (
              <p className='text-red-500'>
                {error?.message || 'Something went wrong, please try again.'}
              </p>
            )}
          </form>
          <div className='flex flex-col gap-3 mt-6 w-full'>
            <p className='text-base-content text-md text-center lg:text-left'>
              Already have an account?
            </p>
            <Link to='/login' className='w-full'>
              <button className='btn w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition duration-200'>
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
