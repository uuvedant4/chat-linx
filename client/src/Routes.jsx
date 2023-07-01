import { useContext } from "react";
import LoginAndRegisterForm from "./LoginAndRegisterForm";
import { UserContext } from "./UserContext";
import Chat from "./Chat";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  return username ? <Chat /> : <LoginAndRegisterForm />;
};

export default Routes;
