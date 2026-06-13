import Skeleton from '@mui/material/Skeleton';

const SkeletonCard = () => (
  <div className="flex flex-col gap-4 h-96 w-full bg-white p-4 rounded-lg shadow-md">
    <Skeleton variant="rectangular" height="75%" width="100%" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="80%" />
  </div>
);

export default SkeletonCard;