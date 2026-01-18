import logo from "./logo.svg";
import "./App.css";
import CarouselCards from "./carouselCards";

const createImageArray = (num) => {
  return Array.from({ length: num }, (_, i) => {
    return {
      id: i + 1,
      url: `https://cdn.live2.ai/assets/images/console-dashboard/sw-preview-${
        (i % 10) + 1
      }.png`,
    };
  });
};

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CarouselCards data={createImageArray(10)} />
    </div>
  );
}

export default App;
