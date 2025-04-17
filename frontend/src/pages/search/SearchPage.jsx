import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [query, setQuery] = useState('');

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['searchUsers', query],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/search?search_query=${query}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        return data;
      } catch (error) {
        throw new Error(error.message || 'Failed to fetch users');
      }
    },
    enabled: !!query.trim(),
  });

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div className='max-w-screen-md mx-auto px-4 pt-6'>
      {/* Search input */}
      <div className='relative mb-6'>
        <input
          type='text'
          value={query}
          onChange={handleSearchChange}
          placeholder='Search users...'
          className='input input-bordered w-full pl-10 text-lg focus:outline-none focus:ring-2 focus:ring-primary transition'
        />
        <Search
          className='absolute top-1/2 left-3 -translate-y-1/2 text-base-content/60'
          size={20}
        />
      </div>

      {/* Search results */}
      {query.trim() && (
        <div>
          {isLoading && <p className='text-base-content/60'>Searching...</p>}
          {error && <p className='text-error'>Error: {error.message}</p>}
          {!isLoading && !error && users.length === 0 && (
            <p className='text-base-content/60'>No users found</p>
          )}
          {!isLoading && !error && users.length > 0 && (
            <div className='space-y-3'>
              {users.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition'
                >
                  <div className='avatar'>
                    <div className='w-10 h-10 rounded-full ring ring-base-300 ring-offset-1'>
                      <img
                        src={user.profileImg || '/avatar-placeholder.png'}
                        alt={user.fullName}
                      />
                    </div>
                  </div>
                  <div>
                    <p className='font-medium text-base-content text-sm'>
                      {user.fullName}
                    </p>
                    <p className='text-xs text-base-content/60'>
                      @{user.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
