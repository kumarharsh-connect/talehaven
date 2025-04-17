import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserPlus, Heart } from 'lucide-react';

import RightSidebarSkeleton from '../skeletons/RightSidebarSkeleton';
import LoadingSpinner from './LoadingSpinner';

import useFollow from '../../hooks/useFollow';
import { formatDate } from '../../utils/helpers/formatDate';

const RightSidebar = () => {
  const { follow, isPending } = useFollow();

  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
  });

  const { data: suggestedUsers, isLoading: loadingSuggested } = useQuery({
    queryKey: ['suggestedUsers'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/users/suggested');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { data: notifications = [], isLoading: isloadingNotifications } =
    useQuery({
      queryKey: ['notifications', authUser?._id],
      queryFn: async () => {
        try {
          const res = await fetch('/api/notifications');
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          return data;
        } catch (error) {
          throw new Error(error.message);
        }
      },
    });

  return (
    <aside className='hidden lg:block w-96 px-4 border-l-1 border-base-300'>
      {loadingSuggested ? (
        <RightSidebarSkeleton />
      ) : (
        <div className='space-y-4 sticky top-4'>
          {/* Who to Follow Section */}
          <div className='bg-base-100 rounded-xl p-4'>
            <h3 className='font-semibold text-base text-base-content mb-3'>
              Who to follow
            </h3>
            <div className='flex flex-col gap-3'>
              {suggestedUsers.map((user) => (
                <Link
                  to={`/profile/${user.username}`}
                  key={user._id}
                  className='flex items-center justify-between gap-3 p-1.5 rounded-md hover:bg-base-200 transition group'
                >
                  <div className='flex items-center gap-2'>
                    <div className='avatar'>
                      <div className='w-10 h-10 rounded-full ring ring-base-300 ring-offset-1'>
                        <img
                          src={user.profileImg || '/avatar-placeholder.png'}
                          alt={user.fullName}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col max-w-[9rem]'>
                      <span className='text-sm font-medium text-base-content truncate'>
                        {user.fullName}
                      </span>
                      <span className='text-xs text-base-content/70 truncate'>
                        @{user.username}
                      </span>
                    </div>
                  </div>
                  <button
                    className='btn btn-sm bg-primary text-primary-content rounded-full px-4 hover:opacity-90 group-hover:scale-105 transition-transform'
                    onClick={(e) => {
                      e.preventDefault();
                      follow(user._id);
                    }}
                  >
                    {isPending ? <LoadingSpinner size='sm' /> : 'Follow'}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Notifications Section */}
          {!isloadingNotifications && notifications.length > 0 && (
            <div className='bg-base-100 rounded-xl p-4'>
              <h3 className='font-semibold text-base text-base-content mb-3'>
                Recent Activity
              </h3>
              <div className='flex flex-col gap-3'>
                {notifications.slice(0, 4).map((notification) => (
                  <Link
                    to={`/profile/${notification.from.username}`}
                    key={notification._id}
                    className='flex items-start gap-3 p-2 rounded-md hover:bg-base-200 transition'
                  >
                    <div className='p-2 rounded-full bg-primary/10 text-primary'>
                      {notification.type === 'follow' ? (
                        <UserPlus className='w-4 h-4' />
                      ) : (
                        <Heart className='w-4 h-4 text-red-500' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <p className='text-sm leading-tight'>
                        <span className='font-medium'>
                          @{notification.from.username}
                        </span>{' '}
                        {notification.type === 'follow'
                          ? 'followed you'
                          : 'liked your tale'}
                      </p>
                      <span className='text-xs text-base-content/60'>
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default RightSidebar;
