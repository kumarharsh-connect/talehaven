import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const { mutate: logoutMutation, isLoading: isLoggingOut } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', { method: 'POST' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong!');
      } catch (error) {
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
      toast.success('Logged out successfully');
      navigate('/login');
    },
    onError: () => {
      toast.error('Failed to logout');
    },
  });

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const navItems = [
    { name: 'Home', icon: <Home size={20} />, path: '/' },
    { name: 'Search', icon: <Search size={20} />, path: '/search' },
    { name: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    {
      name: 'Profile',
      icon: <User size={20} />,
      path: `/profile/${authUser?.username || ''}`,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className='md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg'
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`w-72 bg-base-100 border-r border-base-300
          fixed top-0 left-0 h-full z-40 transform transition-transform duration-300
          md:sticky md:top-0 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className='flex flex-col justify-between h-screen p-6'>
          {/* Logo */}
          <Link to='/' className='mb-4'>
            <img
              src='/talehaven-logo.png'
              alt='TaleHaven'
              className='w-47 h-auto'
            />
          </Link>

          {/* Navigation */}
          <nav className='flex flex-col gap-2'>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-accent text-primary'
                        : 'hover:bg-accent hover:text-base-content text-base-content'
                    }`}
                >
                  <div className='transition-transform duration-200 group-hover:scale-110'>
                    {item.icon}
                  </div>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Card */}
          {authUser?.username && (
            <div className='mt-10 p-6 rounded-2xl text-center bg-accent shadow-sm border border-base-300'>
              <Link
                to={`/profile/${authUser.username}`}
                onClick={() => setIsOpen(false)}
              >
                <img
                  src={authUser.profileImg || '/avatar-placeholder.png'}
                  alt='Profile'
                  className='w-20 h-20 rounded-full mx-auto mb-3 object-cover shadow'
                />
                <div className='font-semibold text-lg text-neutral-content'>
                  {authUser.fullName || 'Anonymous'}
                </div>
                <div className='text-sm text-base-content mb-4'>
                  @{authUser.username}
                </div>
              </Link>
              <button
                className='btn btn-primary rounded-full px-4'
                onClick={(e) => {
                  e.preventDefault();
                  logoutMutation();
                  setIsOpen(false);
                }}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  'Logging out'
                ) : (
                  <>
                    <LogOut size={16} /> Log out
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
