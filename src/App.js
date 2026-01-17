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

const data = [
  {
    id: 1,
    color: "red",
  },
  {
    id: 2,
    color: "green",
  },
  {
    id: 3,
    color: "blue",
  },
  {
    id: 4,
    color: "yellow",
  },
  {
    id: 5,
    color: "black",
  },
  {
    id: 6,
    color: "cyan",
  },
  {
    id: 7,
    color: "orange",
  },
  {
    id: 8,
    color: "pink",
  },
  {
    id: 9,
    color: "purple",
  },
  {
    id: 10,
    color: "brown",
  },
  {
    id: 11,
    color: "gray",
  },
  {
    id: 12,
    color: "cyan",
  },
];

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
      <CarouselCards data={createImageArray(12)} />
    </div>
  );
}

export default App;
