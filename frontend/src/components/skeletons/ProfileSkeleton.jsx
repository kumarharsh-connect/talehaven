const ProfileSkeleton = () => {
  return (
    <div className='animate-pulse flex-[4_4_0] border-r border-base-300 min-h-screen'>
      {/* Back Button and Header */}
      <div className='flex gap-6 px-6 py-4 items-center'>
        <div className='bg-base-300 rounded-full w-6 h-6' />
        <div className='space-y-2'>
          <div className='h-4 w-40 bg-base-300 rounded' />
          <div className='h-3 w-24 bg-base-200 rounded' />
        </div>
      </div>

      {/* Cover Image */}
      <div className='relative'>
        <div className='h-56 w-full bg-base-300 rounded-lg' />

        {/* Avatar */}
        <div className='absolute -bottom-14 left-1/2 transform -translate-x-1/2'>
          <div className='w-32 h-32 rounded-full bg-base-300 ring ring-base-100 ring-offset-2 shadow-md' />
        </div>
      </div>

      {/* User Info Box */}
      <div className='bg-base-100 mt-20 px-6 py-4 rounded-xl shadow-sm mx-auto w-full max-w-lg'>
        <div className='flex flex-col items-center space-y-3'>
          <div className='h-4 w-32 bg-base-300 rounded' />
          <div className='h-3 w-24 bg-base-200 rounded' />

          {/* Bio */}
          <div className='mt-4 space-y-2'>
            <div className='h-3 w-3/4 bg-base-200 rounded mx-auto' />
            <div className='h-3 w-2/4 bg-base-200 rounded mx-auto' />
          </div>

          {/* Links and Joined */}
          <div className='flex justify-center gap-4 mt-4'>
            <div className='h-3 w-24 bg-base-200 rounded' />
            <div className='h-3 w-28 bg-base-200 rounded' />
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2 mt-2'>
            <div className='h-8 w-20 bg-base-300 rounded-full' />
            <div className='h-8 w-20 bg-base-300 rounded-full' />
          </div>
        </div>

        {/* Follower Stats */}
        <div className='flex justify-center gap-6 mt-4'>
          <div className='h-3 w-16 bg-base-200 rounded-lg' />
          <div className='h-3 w-16 bg-base-200 rounded-lg' />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className='flex justify-center gap-4 mt-6'>
        <div className='h-8 w-24 bg-base-300 rounded' />
        <div className='h-8 w-24 bg-base-300 rounded' />
      </div>

      {/* Feed Skeleton */}
      <div className='space-y-4 mt-6 px-4 w-full max-w-[600px] mx-auto flex flex-col gap-4'>
        {[1, 2, 3].map((_, i) => (
          <div key={i} className='h-40 w-full bg-base-300 rounded-xl' />
        ))}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
