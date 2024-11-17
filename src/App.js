import { Provider } from "react-redux";
import { SideBar } from "./components/SideBar";
import store from "./redux/store";
import { Route, Routes } from "react-router-dom";
import { Login } from "@mui/icons-material";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Provider store={store}>
      <SideBar />
      <ToastContainer />
    </Provider>
  );
};

export default App;
