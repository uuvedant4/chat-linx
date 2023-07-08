import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

const LoginAndRegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("register");
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleFormChange = (page) => {
    setIsLoginOrRegister(page);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUsername(username);
    setId(data.id);
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form onSubmit={handleSubmit} className="w-64 mx-auto mb-12">
        <input
          onChange={handleUsernameChange}
          value={username}
          autoComplete="true"
          type="text"
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          onChange={handlePasswordChange}
          value={password}
          autoComplete="true"
          className="block w-full rounded-sm p-2 mb-2 border"
          type="password"
          placeholder="password"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {isLoginOrRegister === "register" ? "Register" : "Login"}
        </button>
        <div className="text-center mt-2">
          {isLoginOrRegister === "register" && (
            <div>
              Already have an account?{" "}
              <button onClick={() => handleFormChange("login")}>Login</button>
            </div>
          )}
          {isLoginOrRegister === "login" && (
            <div>
              Don't have an account?{" "}
              <button onClick={() => handleFormChange("register")}>
                Register
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginAndRegisterForm;
