"use client";
export const ProgressBar = ({
  progress,
  color = "primary",
}: {
  progress: number;
  color?: string;
}) => {
  const colorMap = {
    primary: "bg-indigo-500",
    success: "bg-green-500",
    danger: "bg-red-500",
  };

  return (
    <div className='w-full h-2 bg-gray-100 rounded-full overflow-hidden'>
      <div
        className={`h-full transition-all duration-500 ${colorMap[color as keyof typeof colorMap] || colorMap.primary}`}
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
};
