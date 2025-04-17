import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Image, Smile, X } from 'lucide-react';

const CreatePost = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const {
    mutate: createPost,
    isPending: isCreatingPost,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch('/api/posts/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, img }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }

        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      setText('');
      setImg(null);
      toast.success('Tale created successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='bg-base-100 rounded-2xl border border-base-300 mt-8 p-6 hover:shadow-sm transition-all duration-300'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        {/* User & Input */}
        <div className='flex gap-4'>
          <div className='avatar'>
            <div className='w-14 h-14 rounded-full ring-offset-base-100 ring-offset-2'>
              <img
                src={authUser.profileImg || '/avatar-placeholder.png'}
                alt='User Avatar'
              />
            </div>
          </div>
          <textarea
            className='flex-1 min-h-[80px] resize-none bg-base-200 rounded-xl p-4 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary text-base-content placeholder:text-base-content/60 transition'
            placeholder="What's your tale for today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Image Preview */}
        {img && (
          <div className='relative w-full max-w-lg mx-auto rounded-xl overflow-hidden border border-base-300'>
            <button
              type='button'
              className='absolute top-2 right-2 bg-base-100 text-base-content p-1 rounded-full shadow-md hover:bg-base-300 transition'
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            >
              <X size={14} />
            </button>
            <img
              src={img}
              alt='Selected'
              className='w-full h-64 object-contain group-hover:opacity-90 transition'
            />
          </div>
        )}

        {/* Footer Actions */}
        <div className='flex items-center justify-between border-t pt-3 border-base-200'>
          <div className='flex items-center gap-3 text-primary'>
            {/* Image Upload */}
            <button
              type='button'
              onClick={() => imgRef.current?.click()}
              className='p-1.5 rounded-full hover:bg-primary/10 transition'
            >
              <Image className='w-5 h-5' />
            </button>
            {/* Emoji Button */}
            <button
              type='button'
              className='p-1.5 rounded-full hover:bg-primary/10 transition'
            >
              <Smile className='w-5 h-5' />
            </button>
          </div>
          {/* Hidden File Input */}
          <input
            type='file'
            accept='image/*'
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />

          {/* Post Button */}
          <button
            type='submit'
            className='btn btn-sm rounded-full bg-primary text-primary-content px-6 font-semibold tracking-wide hover:scale-105 transition-transform'
            disabled={isCreatingPost}
          >
            {isCreatingPost ? 'Posting...' : 'Post a tale'}
          </button>
        </div>

        {/* Error Message */}
        {isError && (
          <p className='text-sm text-red-500 text-center mt-2'>
            {error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
