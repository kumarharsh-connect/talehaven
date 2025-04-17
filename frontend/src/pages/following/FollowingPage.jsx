import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useParams } from 'react-router-dom';

const FollowingPage = () => {
  const { username } = useParams();

  const { data: following = [], isLoading } = useQuery({
    queryKey: ['following', username],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/following/${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Something went wrong');
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  return (
    <section>
      {isLoading ? (
        <>
          <div className='flex justify-center items-center h-full p-10'>
            <LoadingSpinner size='lg' />
          </div>
        </>
      ) : (
        <>
          {' '}
          <div className='flex justify-between items-center px-6 py-4 border-b border-base-300 sticky top-0 bg-base-100 z-10'>
            <h2 className='text-lg font-bold tracking-wide'>Following</h2>
          </div>
          {following.length === 0 && (
            <div className='text-center py-10 text-base-content/60'>
              You are not following anyone yet.
            </div>
          )}
          <div className='max-w-[600px] mx-auto px-4 py-6 space-y-4'>
            {following.map(({ _id, username, profileImg, fullName }) => (
              <Link
                key={_id}
                to={`/profile/${username}`}
                className='block bg-base-100 rounded-lg border border-base-300 px-4 py-3 transition hover:shadow-sm'
              >
                <div className='flex items-start gap-4'>
                  <div className='avatar'>
                    <div className='w-10 rounded-full ring ring-base-300 ring-offset-base-100'>
                      <img
                        src={profileImg || '/avatar-placeholder.png'}
                        alt={username}
                      />
                    </div>
                  </div>

                  <div>
                    <p className='font-medium'>@{username}</p>
                    <p className='text-sm text-base-content/60'>{fullName}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default FollowingPage;
