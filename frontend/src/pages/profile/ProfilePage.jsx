import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import PostFeed from '../../components/common/PostFeed';
import ProfileSkeleton from '../../components/skeletons/ProfileSkeleton';
import EditProfileModal from './EditProfileModal';

import useFollow from '../../hooks/useFollow';
import useUserProfileUpdate from '../../hooks/useUserProfileUpdate';

import { formatMemberSinceDate } from '../../utils/helpers/formatDate';

import { ArrowLeft, Link as LucideLink, Calendar, Edit2 } from 'lucide-react';

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState('posts');

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { follow, isPending } = useFollow();
  const { username } = useParams();

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const {
    data: user,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  });

  const { updateProfile, isUpdatingProfile } = useUserProfileUpdate();

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const isUserFollowed = authUser?.following.includes(user?._id);

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === 'coverImg' && setCoverImg(reader.result);
        state === 'profileImg' && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='flex-[4_4_0] min-h-screen'>
      {isLoading && isRefetching && isPending && <ProfileSkeleton />}
      {!isLoading && isRefetching && !user && (
        <p className='text-center text-lg mt-4'>User not found</p>
      )}

      {!isLoading && !isRefetching && user && (
        <>
          {/* Header */}
          <div className='flex gap-6 p-4 items-center'>
            <Link to='/'>
              <ArrowLeft className='w-4 h-4 text-base-content' />
            </Link>
            <div className='flex flex-col gap-0 '>
              <p className='font-bold text-lg'>{user.fullName}</p>
            </div>
          </div>

          {/* Cover Image */}
          <div className='relative group/cover'>
            <img
              src={coverImg || user.coverImg || '/cover-placeholder.png'}
              className='h-56 w-full object-cover'
              alt='Cover'
            />
            {isMyProfile && (
              <div
                className='absolute top-3 right-3 bg-primary p-2 rounded-full cursor-pointer shadow-lg opacity-0 group-hover/cover:opacity-100 transition duration-300'
                onClick={() => coverImgRef.current.click()}
              >
                <Edit2 className='text-white w-5 h-5' />
              </div>
            )}
            <input
              type='file'
              hidden
              accept='image/*'
              ref={coverImgRef}
              onChange={(e) => handleImgChange(e, 'coverImg')}
            />
            <input
              type='file'
              hidden
              accept='image/*'
              ref={profileImgRef}
              onChange={(e) => handleImgChange(e, 'profileImg')}
            />

            {/* Avatar */}
            <div className='absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-10'>
              <div className='avatar relative group/avatar'>
                <div className='w-32 h-32 rounded-full ring ring-base-100 ring-offset-2 ring-offset-base-100 shadow-md overflow-hidden'>
                  <img
                    src={
                      profileImg || user.profileImg || '/avatar-placeholder.png'
                    }
                    alt='avatar'
                  />
                </div>
                {isMyProfile && (
                  <div
                    className='absolute top-1 right-1 bg-primary p-1 rounded-full opacity-0 group-hover/avatar:opacity-100 transition duration-300 cursor-pointer'
                    onClick={() => {
                      profileImgRef.current.click();
                    }}
                  >
                    <Edit2 className='text-white w-4 h-4' />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className='bg-base-100 mt-14 px-6 py-4 rounded-xl mx-auto w-full max-w-lg relative'>
            <div className='flex flex-col items-center'>
              <div className='text-center'>
                <p className='text-xl font-bold'>{user.fullName}</p>
                <p className='text-sm text-base-content/60'>@{user.username}</p>
              </div>

              {user.bio && (
                <p className='text-sm mt-2 text-center text-base-content/80 max-w-xs'>
                  {user.bio}
                </p>
              )}

              <div className='flex flex-wrap gap-4 text-sm text-base-content/70 justify-center mt-2'>
                {user.link && (
                  <div className='flex items-center gap-1'>
                    <LucideLink className='w-4 h-4' />
                    <a
                      href={user.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:underline text-blue-600'
                    >
                      {user.link.replace('https://', '')}
                    </a>
                  </div>
                )}
                <div className='flex items-center gap-1'>
                  <Calendar className='w-4 h-4' />
                  <span>{memberSinceDate}</span>
                </div>
              </div>

              {/* Edit Profile/ Follow  */}
              <div className='flex gap-2 mt-4'>
                {isMyProfile ? (
                  <>
                    <EditProfileModal authUser={authUser} />
                    {(coverImg || profileImg) && (
                      <button
                        className='btn btn-primary btn-md rounded-full text-white px-4'
                        onClick={async () => {
                          await updateProfile({ coverImg, profileImg });
                          setCoverImg(null);
                          setProfileImg(null);
                        }}
                      >
                        {isUpdatingProfile ? 'Updating...' : 'Update'}
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    className='btn btn-outline hover:btn-primary btn-md rounded-full'
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && 'Loading...'}
                    {!isPending && isUserFollowed && 'Unfollow'}
                    {!isPending && !isUserFollowed && 'Follow'}
                  </button>
                )}
              </div>

              {/* Followers & Following */}
              <div className='flex justify-center gap-10 mt-4 bg-base-200 p-4 rounded-xl w-full max-w-xs'>
                <Link
                  to={`/profile/following/${user.username}`}
                  className='hover:cursor-pointer'
                >
                  <div className='text-center'>
                    <p className='text-lg font-semibold text-primary'>
                      {user.following.length}
                    </p>
                    <p className='text-sm text-base-content/60'>Following</p>
                  </div>
                </Link>
                <Link
                  to={`/profile/followers/${user.username}`}
                  className='hover:cursor-pointer'
                >
                  <div className='text-center'>
                    <p className='text-lg font-semibold text-primary'>
                      {user.followers.length}
                    </p>
                    <p className='text-sm text-base-content/60'>Followers</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='flex justify-center gap-4 mt-4'>
            <div
              onClick={() => setFeedType('posts')}
              className={`px-5 py-2 rounded-lg cursor-pointer transition ${
                feedType === 'posts'
                  ? 'bg-primary text-white'
                  : 'bg-base-100 text-base-content/60 hover:bg-base-200'
              }`}
            >
              Tales
            </div>
            <div
              onClick={() => setFeedType('likes')}
              className={`px-5 py-2 rounded-lg cursor-pointer transition ${
                feedType === 'likes'
                  ? 'bg-primary text-white'
                  : 'bg-base-100 text-base-content/60 hover:bg-base-200'
              }`}
            >
              Likes
            </div>
          </div>

          {/* Feed */}
          <div className='mt-6 px-4 w-full max-w-[600px] mx-auto flex flex-col gap-4'>
            <PostFeed
              feedType={feedType}
              username={user?.username}
              userId={user?._id}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
