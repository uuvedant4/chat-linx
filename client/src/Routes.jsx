import { useContext } from "react";
import Register from "./Register";
import { UserContext } from "./UserContext";

const Routes = () => {
  const { username, id } = useContext(UserContext);

  if (username) {
    return "logged in";
  }
  return <Register />;
};

export default Routes;
