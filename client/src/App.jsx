import "./App.css";
import Register from "./Register";
import axios from "axios";
import { UserContextProvider } from "./UserContext";

function App() {
  axios.defaults.baseURL = "http://localhost:5000";
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Register />
    </UserContextProvider>
  );
}

export default App;
