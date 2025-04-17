const LoadingSpinner = ({
  size = 'md',
  color = 'text-primary',
  className = '',
}) => {
  const sizeMap = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
  };

  const sizeClass = sizeMap[size] || 'loading-md';

  return (
    <span
      className={`loading loading-spinner ${sizeClass} ${color} ${className}`}
      aria-label='Loading...'
    />
  );
};

export default LoadingSpinner;
