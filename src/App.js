import { Provider } from "react-redux";
import { SideBar } from "./components/SideBar";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <SideBar />
    </Provider>
  );
};

export default App;
