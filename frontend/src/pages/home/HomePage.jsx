import { useState } from 'react';
import PostFeed from '../../components/common/PostFeed';
import CreatePost from './CreatePost';

const HomePage = () => {
  const [feedType, setFeedType] = useState('forYou');

  return (
    <main className='flex-[3_3_0] border-x border-base-200 min-h-screen bg-base-100 text-base-content  mx-auto'>
      {/* Top Navbar */}
      <div className='sticky flex items-center top-0 z-10 bg-base-100 border-b border-base-300 '>
        <div className='flex flex-col md:flex-row items-center gap-3 px-4 py-3'>
          {/* Feed Toggle */}
          <div className='flex gap-2'>
            <button
              className={`cursor-pointer px-5 py-2 text-sm rounded-lg transition duration-150 ${
                feedType === 'forYou'
                  ? 'bg-primary text-primary-content'
                  : 'text-base-content hover:bg-base-200'
              }`}
              onClick={() => setFeedType('forYou')}
            >
              For You
            </button>
            <button
              className={`cursor-pointer px-5 py-2 text-sm rounded-lg transition duration-150 ${
                feedType === 'following'
                  ? 'bg-primary text-primary-content'
                  : 'text-base-content hover:bg-base-200'
              }`}
              onClick={() => setFeedType('following')}
            >
              Following
            </button>
          </div>
        </div>
      </div>

      {/* Feed Content */}
      <div className='w-full max-w-[600px] mx-auto px-4 flex flex-col gap-4'>
        <CreatePost />
        <PostFeed feedType={feedType} />
      </div>
    </main>
  );
};

export default HomePage;
