import PostCard from './PostCard';
import PostSkeleton from '../skeletons/PostSkeleton';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const PostFeed = ({ feedType, username, userId }) => {
  const getPostEndPoint = () => {
    switch (feedType) {
      case 'forYou':
        return '/api/posts/all';
      case 'following':
        return '/api/posts/following';
      case 'posts':
        return `/api/posts/user/${username}`;
      case 'likes':
        return `/api/posts/likes/${userId}`;
      default:
        return '/api/posts/all';
    }
  };

  const POST_ENDPOINT = getPostEndPoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        return data;
      } catch (error) {
        throw new Error(error.message, 'Something went wrong!');
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className='flex flex-col justify-center'>
          {Array.from({ length: 4 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className='text-center my-4'>
          No tales whispered here yet... try another tab 🌙
        </p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default PostFeed;
