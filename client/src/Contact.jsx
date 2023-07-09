import Avatar from "./Avatar";

const Contact = ({
  id,
  onClick,
  selectedUserId,
  username,
  selected,
  online,
}) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={`flex gap-2 items-center border-b border-gray-100 cursor-pointer ${
        selected ? "bg-blue-50" : ""
      }`}
      key={id}
    >
      {selected && <div className="rounded-r-md w-1 bg-blue-500 h-12"></div>}
      <div className="flex gap-2 py-2 pl-4 items-center">
        <Avatar online={online} userId={id} username={username} />
        <span className="text-gray-800">{username}</span>
      </div>
    </div>
  );
};

export default Contact;
