import "./App.css";
import Header from "./components/Header/index";
import Content from "./components/Content";

function App() {
  return <div className="bg-primary-color flex justify-center text-text-color">
    <div className="container w-[70%] mx-auto my-14">
      <Header />
      <Content />
    </div>
  </div>;
}

export default App;
