import { useEffect, useState } from 'react';
import useUserProfileUpdate from '../../hooks/useUserProfileUpdate';

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    bio: '',
    link: '',
    newPassword: '',
    currentPassword: '',
  });

  const { updateProfile, isUpdatingProfile } = useUserProfileUpdate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        link: authUser.link,
        bio: authUser.bio,
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className='btn btn-outline rounded-full btn-md'
        onClick={() =>
          document.getElementById('edit_profile_modal').showModal()
        }
      >
        Edit profile
      </button>

      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box border border-base-300 rounded-xl max-w-2xl w-full'>
          <h3 className='font-bold text-xl mb-6 text-base-content'>
            Update Profile
          </h3>

          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  Full Name
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder='John Doe'
                  className='input input-bordered w-full'
                />
              </div>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  Username
                </label>
                <input
                  type='text'
                  name='username'
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder='johndoe'
                  className='input input-bordered w-full'
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  Email
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='you@example.com'
                  className='input input-bordered w-full'
                />
              </div>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  Link
                </label>
                <input
                  type='text'
                  name='link'
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder='https://yourwebsite.com'
                  className='input input-bordered w-full'
                />
              </div>
            </div>

            <div>
              <label className='label text-sm font-semibold text-base-content'>
                Bio
              </label>
              <textarea
                name='bio'
                value={formData.bio}
                onChange={handleInputChange}
                placeholder='Write a short bio...'
                className='textarea textarea-bordered w-full resize-y min-h-[80px]'
              />
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  Current Password
                </label>
                <input
                  type='password'
                  name='currentPassword'
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder='Enter current password'
                  className='input input-bordered w-full'
                />
              </div>
              <div className='flex-1'>
                <label className='label text-sm font-semibold text-base-content'>
                  New Password
                </label>
                <input
                  type='password'
                  name='newPassword'
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder='Enter new password'
                  className='input input-bordered w-full'
                />
              </div>
            </div>

            <div className='flex justify-end mt-4'>
              <button
                type='submit'
                className='btn btn-primary rounded-full text-white px-6'
              >
                {isUpdatingProfile ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        </div>

        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;
