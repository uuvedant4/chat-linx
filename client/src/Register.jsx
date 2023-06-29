import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const register = async (e) => {
    e.preventDefault();
    const { data } = await axios.post("/register", { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={register} className="w-64 mx-auto mb-12">
        <input
          onChange={handleUsernameChange}
          value={username}
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          onChange={handlePasswordChange}
          value={password}
          className="block w-full rounded-sm p-2 mb-2 border"
          type="password"
          placeholder="password"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
