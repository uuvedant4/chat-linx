const colors = [
  "bg-red-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-blue-200",
  "bg-yellow-200",
  "bg-teal-200",
  "bg-violet-200",
  "bg-orange-200",
];

const Avatar = ({ userId, username }) => {
  const userIdBase10 = parseInt(userId, 16);
  const colorIndx = userIdBase10 % colors.length;
  const color = colors[colorIndx];
  return (
    <div className={`flex items-center w-8 h-8 ${color} rounded-full`}>
      <div className="opacity-70 text-center w-full">{username[0]}</div>
    </div>
  );
};

export default Avatar;
