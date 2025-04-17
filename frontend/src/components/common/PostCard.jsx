import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { formatDate } from '../../utils/helpers/formatDate';
import {
  MessageCircle,
  Heart,
  Bookmark,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const PostCard = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const postOwner = post.user;
  const isMyPost = authUser?._id === post.user._id;
  const formattedDate = formatDate(post.createdAt);
  const isLiked = post.likes.includes(authUser?._id);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong!');
        }
        return data;
      } catch (error) {
        throw new Error(error.message || 'Something went wrong!');
      }
    },
    onSuccess: () => {
      toast.success('Tale deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setShowOptions(false);
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }

          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: comment }),
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
    onSuccess: (updatedComments) => {
      queryClient.setQueryData(['posts'], (oldPosts) => {
        return oldPosts.map((p) => {
          if (p._id === post._id) {
            return { ...p, comments: updatedComments };
          }
          return p;
        });
      });
      setComment('');
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    if (!comment.trim()) return;
    commentPost();
  };

  const handleLikePost = (e) => {
    e.preventDefault();
    if (isLiking) return;
    likePost();
  };

  return (
    <div className='bg-base-100 rounded-xl border border-base-300 p-6 hover:shadow-md transition-all duration-200 mb-6 relative'>
      <div className='flex gap-4 items-start'>
        {/* Avatar */}
        <Link to={`/profile/${postOwner.username}`} className='avatar'>
          <div className='w-12 rounded-full overflow-hidden'>
            <img
              src={postOwner.profileImg || '/avatar-placeholder.png'}
              alt='Profile'
              className='object-cover'
            />
          </div>
        </Link>

        {/* Content Area */}
        <div className='flex flex-col flex-1'>
          {/* Header */}
          <div className='flex items-center gap-2 text-sm text-base-content relative'>
            <Link
              to={`/profile/${postOwner.username}`}
              className='font-semibold hover:underline'
            >
              {postOwner.fullName}
            </Link>
            <span className='text-muted-foreground'>
              @{postOwner.username} · {formattedDate}
            </span>

            {isMyPost && (
              <div className='ml-auto relative'>
                <MoreHorizontal
                  size={18}
                  className='cursor-pointer hover:text-primary'
                  onClick={() => setShowOptions(!showOptions)}
                />
                {showOptions && (
                  <div className='absolute right-0 mt-2 w-28 bg-base-100 border border-base-300 rounded shadow z-50'>
                    <button
                      onClick={handleDeletePost}
                      disabled={isDeleting}
                      className='flex gap-1 items-center cursor-pointer w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-base-200'
                    >
                      {isDeleting ? (
                        <LoadingSpinner size='sm' color='text-red-500' />
                      ) : (
                        <>
                          <Trash2 size={16} /> Delete
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className='mt-4 text-sm text-base-content'>
            <p>{post.text}</p>
            {post.img && (
              <img
                src={post.img}
                alt='Post'
                className='mt-4 w-full rounded-xl border border-base-300 object-contain'
              />
            )}
          </div>

          {/* Actions */}
          <div className='flex justify-between mt-4 text-muted-foreground text-sm'>
            <div className='flex gap-6'>
              {/* Like */}
              <div
                className='flex items-center gap-1 group cursor-pointer transition-colors'
                onClick={handleLikePost}
              >
                {isLiking ? (
                  <LoadingSpinner size='sm' />
                ) : isLiked ? (
                  <Heart
                    size={18}
                    className='text-red-500 fill-red-500'
                    strokeWidth={2}
                  />
                ) : (
                  <Heart
                    size={18}
                    className='text-muted-foreground group-hover:text-red-500 transition-colors duration-200'
                  />
                )}

                <span
                  className={`transition-colors duration-200 text-sm ${
                    isLiked
                      ? 'text-red-500 font-medium'
                      : 'text-muted-foreground group-hover:text-red-500'
                  }`}
                >
                  {post.likes.length}
                </span>
              </div>

              {/* Comment Toggle on Icon */}
              <div
                className={`flex items-center gap-1 cursor-pointer transition ${
                  showComments ? 'text-primary' : 'hover:text-sky-500'
                }`}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle size={18} />
                <span>{post.comments.length}</span>
              </div>
            </div>
            <Bookmark
              size={18}
              className='cursor-pointer hover:text-yellow-500 transition'
            />
          </div>

          {/* Comment Section */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showComments ? 'max-h-[800px] mt-8' : 'max-h-0'
            }`}
          >
            <div className='flex flex-col gap-4 text-sm text-base-content'>
              {/* Comments */}
              {post.comments.length > 0 ? (
                <div className='flex flex-col gap-0 max-h-64 overflow-y-auto pr-2 mb-4'>
                  {post.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className='flex items-start gap-4 bg-base-100 p-4'
                    >
                      {/* Avatar */}
                      <div className='w-10 h-10 rounded-full overflow-hidden border border-base-300'>
                        <img
                          src={
                            comment.user.profileImg || '/avatar-placeholder.png'
                          }
                          alt='avatar'
                          className='w-full h-full object-cover'
                        />
                      </div>

                      {/* Comment Content */}
                      <div className='flex-1'>
                        <div className='flex items-center justify-between mb-1'>
                          <span className='font-medium text-base-content'>
                            {comment.user.fullName}
                          </span>
                          <span className='text-xs text-muted-foreground'>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>

                        <p className='text-sm text-base-content'>
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground'></p>
              )}

              {/* Comment Input */}
              <form
                onSubmit={handlePostComment}
                className='flex items-center gap-3 border border-base-300 rounded-full px-4 py-2 focus-within:border-primary transition'
              >
                <input
                  type='text'
                  placeholder='Write a comment...'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className='flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground'
                />
                <button
                  type='submit'
                  disabled={!comment.trim() || isCommenting}
                  className='text-primary font-medium text-sm disabled:opacity-50 disabled:pointer-events-none'
                >
                  {isCommenting ? <LoadingSpinner size='md' /> : 'Post'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
