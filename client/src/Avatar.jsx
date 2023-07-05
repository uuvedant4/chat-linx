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

const Avatar = ({ userId, username, online }) => {
  const userIdBase10 = parseInt(userId, 16);
  const colorIndx = userIdBase10 % colors.length;
  const color = colors[colorIndx];
  return (
    <div className={`flex relative items-center w-8 h-8 ${color} rounded-full`}>
      <div className="opacity-70 text-center w-full">{username[0]}</div>
      {online && (
        <div className="absolute w-3 h-3 bg-green-400 border border-white bottom-0 right-0 rounded-full"></div>
      )}{" "}
    </div>
  );
};

export default Avatar;
