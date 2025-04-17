import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LoginPage from './pages/auth/login/LoginPage';
import SignUpPage from './pages/auth/signup/SignUpPage';
import HomePage from './pages/home/HomePage';
import NotificationPage from './pages/notification/NotificationPage';
import ProfilePage from './pages/profile/ProfilePage';
import SearchPage from './pages/search/SearchPage';
import FollowersPage from './pages/followers/FollowersPage';
import FollowingPage from './pages/following/FollowingPage';

import Sidebar from './components/common/Sidebar';
import RightSidebar from './components/common/RightSidebar';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        console.log('completely fetched the authUser:', data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className='flex justify-center items-center bg-base-100 h-screen'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='flex'>
      {authUser && <Sidebar />}
      <div className='flex-1'>
        <Routes>
          <Route
            path='/'
            element={authUser ? <HomePage /> : <Navigate to='/login' />}
          ></Route>
          <Route
            path='/login'
            element={!authUser ? <LoginPage /> : <Navigate to='/' />}
          ></Route>
          <Route
            path='/signup'
            element={!authUser ? <SignUpPage /> : <Navigate to='/' />}
          ></Route>
          <Route
            path='/notifications'
            element={authUser ? <NotificationPage /> : <Navigate to='/login' />}
          ></Route>
          <Route
            path='/profile/:username'
            element={authUser ? <ProfilePage /> : <Navigate to='/login' />}
          ></Route>
          <Route
            path='/search'
            element={authUser ? <SearchPage /> : <Navigate to='/login' />}
          />
          <Route
            path='/profile/followers/:username'
            element={authUser ? <FollowersPage /> : <Navigate to='/login' />}
          />
          <Route
            path='/profile/following/:username'
            element={authUser ? <FollowingPage /> : <Navigate to='/login' />}
          />
        </Routes>
      </div>
      {authUser && <RightSidebar />}
      <Toaster />
    </div>
  );
}

export default App;
