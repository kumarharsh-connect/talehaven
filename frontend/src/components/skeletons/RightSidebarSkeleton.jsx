const RightSidebarSkeleton = () => {
  return (
    <div className='hidden lg:block w-full max-w-[24rem] overflow-hidden'>
      <div className='bg-base-100 px-4 py-6 space-y-6 animate-pulse overflow-hidden'>
        {/* Skeleton: Search Bar */}
        <div className='bg-base-300 w-full h-10 rounded-lg'></div>

        {/* Skeleton: Who to follow Title */}
        <div className='h-5 w-32 bg-base-300 rounded mb-2'></div>

        {/* Skeleton user cards */}
        <div className='flex flex-col gap-4'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between gap-4 p-2 rounded-md'
            >
              {/* Avatar + Info */}
              <div className='flex gap-3 items-center overflow-hidden'>
                <div className='avatar'>
                  <div className='w-9 h-9 rounded-full bg-base-300'></div>
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='h-4 w-24 bg-base-300 rounded'></div>
                  <div className='h-3 w-16 bg-base-200 rounded'></div>
                </div>
              </div>

              {/* Follow button */}
              <div className='h-8 w-16 rounded-full bg-base-300'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebarSkeleton;
