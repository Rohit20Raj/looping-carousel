import React, { useRef, useState, useEffect } from "react";

const CarouselCards = ({ data }) => {
  const scrollRef = useRef();
  const cardRefs = useRef([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Clone the data to create a circular array
  // Structure: [lastItems, allItems, firstItems]
  const [items, setItems] = useState(() => {
    const display = Math.floor(data.length / 2);
    return [
      ...data.slice(data.length - display),
      ...data,
      ...data.slice(0, display),
    ];
  });

  // Initial center will be at Math.floor(data.length / 2)
  const centerItemIndex = Math.floor(data.length / 2);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;

    const firstCard = container.children[0];
    const scrollOffset =
      firstCard.offsetLeft -
      container.offsetWidth / 2 +
      firstCard.offsetWidth / 2;

    container.scrollTo({ left: scrollOffset, behavior: "auto" }); // ← NOT 'smooth' initially
    setActiveIndex(0); // ← Important!
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;

    const card = container.querySelector(".carousel-card");
    if (!card) return;

    const cardWidth = card.offsetWidth; // Width + gap
    const containerWidth = container.clientWidth;

    // Calculate offset to center the card
    const offset = (containerWidth - cardWidth) / 2;

    // Set scroll position to center the first actual item of your original data
    // which is at index centerItemIndex in your extended array
    container.scrollLeft = centerItemIndex * cardWidth - offset;
  }, [centerItemIndex]);

  const scrollLeft = () => {
    if (isAnimating || !scrollRef.current) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + data.length) % data.length);

    const container = scrollRef.current;
    const card = container.querySelector(".carousel-card");
    if (!card) {
      setIsAnimating(false);
      return;
    }

    const cardWidth = card.offsetWidth;

    // Handle the loop when reaching the beginning
    if (container.scrollLeft < cardWidth) {
      // Jump to equivalent position in middle section without animation
      container.style.scrollBehavior = "auto";
      container.scrollLeft += data.length * cardWidth;

      // After resetting position, apply smooth scroll
      setTimeout(() => {
        container.style.scrollBehavior = "smooth";
        container.scrollLeft -= cardWidth;

        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
    } else {
      // Normal scroll
      container.style.scrollBehavior = "smooth";
      container.scrollLeft -= cardWidth;

      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const scrollRight = () => {
    if (isAnimating || !scrollRef.current) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % data.length);

    const container = scrollRef.current;
    const card = container.querySelector(".carousel-card");
    if (!card) {
      setIsAnimating(false);
      return;
    }

    const cardWidth = card.offsetWidth;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Handle the loop when reaching the end
    if (container.scrollLeft > maxScroll - cardWidth) {
      // Jump to equivalent position in middle section without animation
      container.style.scrollBehavior = "auto";
      container.scrollLeft -= data.length * cardWidth;

      // After resetting position, apply smooth scroll
      setTimeout(() => {
        container.style.scrollBehavior = "smooth";
        container.scrollLeft += cardWidth;

        setTimeout(() => setIsAnimating(false), 300);
      }, 50);
    } else {
      // Normal scroll
      container.style.scrollBehavior = "smooth";
      container.scrollLeft += cardWidth;

      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        padding: "12px",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <div
        ref={scrollRef}
        style={{
          width: "calc(100% - 40px)",
          overflowX: "hidden",
          display: "flex",
          position: "relative",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          height: "400px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // gap: "20px",
            alignItems: "center",
          }}
        >
          {items.map((item, index) => {
            const display = Math.floor(data.length / 2);
            const centerCardIndex = (index + display) % data.length;
            const isActive = centerCardIndex === activeIndex;

            console.log("centerCardIndex", centerCardIndex);
            console.log("activeIndex", activeIndex);
            return (
              <div
                key={`${item.id}-${index}`}
                className="carousel-card"
                ref={(card) => (cardRefs.current[index] = card)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  // aspectRatio: "9 / 16",
                  maxHeight: "100%",
                  width: "250px",
                  height: isActive ? "400px" : "300px",
                  borderRadius: "12px",
                  border: "1px solid black",
                  backgroundColor: item.color,
                  transition: "height 0.3s, opacity 0.3s",
                  // transform: isActive ? "scale(1.05)" : "scale(0.95)",
                  opacity: isActive ? 1 : 0.7,
                  transform: "scale(0.9)",
                }}
              >
                <p
                  style={{
                    fontSize: "64px",
                    color: "white",
                    WebkitTextStroke: "1px black",
                  }}
                >
                  {item.id}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          transform: "translateY(-50%)",
        }}
      >
        <div
          onClick={scrollLeft}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            padding: "8px",
            borderRadius: "9999px",
            marginLeft: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              opacity="0.8"
              d="M11 15.0416L5.45833 9.49996L11 3.95829"
              stroke="#212121"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          onClick={scrollRight}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            padding: "8px",
            borderRadius: "9999px",
            marginRight: "8px",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
          >
            <path
              opacity="0.8"
              d="M8 3.95837L13.5417 9.50004L8 15.0417"
              stroke="#212121"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CarouselCards;
