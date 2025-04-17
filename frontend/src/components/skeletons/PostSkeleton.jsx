const PostSkeleton = () => {
  return (
    <div className='bg-base-100 rounded-xl border border-base-300 p-4 mb-6 animate-pulse'>
      <div className='flex gap-4 items-start'>
        {/* Avatar Skeleton */}
        <div className='skeleton w-10 h-10 rounded-full shrink-0'></div>

        {/* Post Content Skeleton */}
        <div className='flex flex-col flex-1 gap-3'>
          {/* Header (Name + Username + Time) */}
          <div className='flex gap-2 items-center'>
            <div className='skeleton h-3 w-20 rounded'></div>
            <div className='skeleton h-3 w-24 rounded'></div>
            <div className='ml-auto skeleton h-4 w-4 rounded'></div>
          </div>

          {/* Text Line */}
          <div className='skeleton h-3 w-full rounded'></div>
          <div className='skeleton h-3 w-3/4 rounded'></div>

          {/* Image Skeleton */}
          <div className='skeleton h-40 w-full rounded-lg'></div>

          {/* Action Buttons (Like, Comment, etc.) */}
          <div className='flex justify-between mt-3'>
            <div className='flex gap-6'>
              <div className='skeleton h-4 w-10 rounded'></div>
              <div className='skeleton h-4 w-10 rounded'></div>
              <div className='skeleton h-4 w-10 rounded'></div>
            </div>
            <div className='skeleton h-4 w-6 rounded'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
