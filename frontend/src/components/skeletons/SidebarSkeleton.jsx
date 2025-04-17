const SidebarSkeleton = () => {
  return (
    <aside className='w-72'>
      <div className='sticky top-0 left-0 flex flex-col justify-between h-screen p-6 bg-base-100 border-r border-base-300'>
        {/* Logo */}
        <div className='mb-4'>
          <div className='h-6 w-36 bg-base-300 rounded' />
        </div>

        {/* Navigation Skeleton */}
        <nav className='flex flex-col gap-2'>
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className='flex items-center gap-4 px-4 py-3 rounded-xl bg-base-300 animate-pulse'
            >
              <div className='h-6 w-6 bg-base-200 rounded-full' />
              <div className='h-4 w-24 bg-base-200 rounded' />
            </div>
          ))}
        </nav>

        {/* Profile Card Skeleton */}
        <div className='mt-10 p-6 rounded-2xl text-center bg-accent shadow-sm border border-base-300'>
          <div className='w-20 h-20 rounded-full bg-base-200 mx-auto mb-3' />
          <div className='h-4 w-32 bg-base-200 rounded mx-auto' />
          <div className='h-3 w-24 bg-base-200 rounded mx-auto mt-2' />
          <div className='mt-4'>
            <div className='h-8 w-28 bg-base-200 rounded-full mx-auto' />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
