import { Link } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers/formatDate';

import { UserPlus, Heart, MoreVertical } from 'lucide-react';

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
  });

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications', authUser._id],
    queryFn: async () => {
      try {
        const res = await fetch('/api/notifications');

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    enabled: !!authUser?._id,
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/notifications/', {
          method: 'DELETE',
        });

        const data = res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    onSuccess: () => {
      toast.success('Notifications deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['notifications', authUser?._id],
      });
    },
  });

  return (
    <section className='flex-[4_4_0] border-base-300 min-h-screen bg-base-100 text-base-content'>
      {/* Header */}
      <div className='flex justify-between items-center px-6 py-4 border-b border-base-300 sticky top-0 bg-base-100 z-10'>
        <h2 className='text-lg font-bold tracking-wide'>Notifications</h2>

        <div className='dropdown dropdown-end'>
          <button tabIndex={0} className='btn btn-ghost btn-sm p-1'>
            <MoreVertical className='w-5 h-5 text-base-content' />
          </button>
          <ul
            tabIndex={0}
            className='dropdown-content menu bg-base-100 border border-base-300 rounded-box w-48 shadow'
          >
            <li>
              <button onClick={deleteNotifications}>
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isLoading && (
        <div className='flex justify-center items-center h-full p-10'>
          <LoadingSpinner size='lg' />
        </div>
      )}

      {!isLoading && notifications.length === 0 && (
        <div className='text-center py-10 text-base-content/60'>
          No activity yet. Enjoy the quiet.
        </div>
      )}

      <div className='max-w-[600px] mx-auto px-4 py-6 space-y-4'>
        {!isLoading &&
          notifications.map((notification) => (
            <Link
              key={notification._id}
              to={`/profile/${notification.from.username}`}
              className='block bg-base-100 rounded-lg border border-base-300 px-4 py-3 transition hover:shadow-sm'
            >
              <div className='flex items-start gap-4'>
                {/* Icon */}
                <div className='p-2 rounded-full bg-primary/10 text-primary mt-1'>
                  {notification.type === 'follow' ? (
                    <UserPlus className='w-5 h-5' />
                  ) : (
                    <Heart className='w-5 h-5 text-error' />
                  )}
                </div>

                {/* Details */}
                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <div className='avatar'>
                      <div className='w-10 rounded-full ring ring-base-300 ring-offset-base-100'>
                        <img
                          src={
                            notification.from.profileImg ||
                            '/avatar-placeholder.png'
                          }
                          alt={`${notification.from.username} avatar`}
                        />
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-sm leading-tight'>
                        <span className='font-semibold'>
                          @{notification.from.username}
                        </span>{' '}
                        {notification.type === 'follow'
                          ? 'started following you.'
                          : 'liked your tale.'}
                      </span>
                      <span className='text-xs text-base-content/60 mt-1'>
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default NotificationPage;
