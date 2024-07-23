import "./App.css";
import Header from "./components/Header/index";
import Content from "./components/Content";
import Toast from "./common/Toast"
import { useContext } from "react";
import { ToastContext } from "./context/ToastContext";
import Footer from "./components/Footer";

function App() {
  const {isShowing} = useContext(ToastContext)

  return <div className="bg-primary-color flex justify-center text-text-color">
    {isShowing && <Toast />}
    <div className="container w-[90%] lg:w-[70%] mx-auto my-14">
      <Header />
      <Content />
      <Footer />
    </div>
  </div>;
}

export default App;
