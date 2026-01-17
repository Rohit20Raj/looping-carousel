import React, { useRef, useState, useEffect } from "react";

const CarouselCards = ({ data = [1, 2, 3] }) => {
  const CARD_WIDTH = 160;
  const GAP = 20;
  const ITEM_SIZE = CARD_WIDTH + GAP;

  const extendedData = [...data, ...data, ...data];

  const middleSetStartIndex = data.length;
  const [activeIndex, setActiveIndex] = useState(middleSetStartIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isTransitioning) return;

    const isInFirstSet = activeIndex < data.length;
    const isInLastSet = activeIndex >= data.length * 2;

    if (isInFirstSet || isInLastSet) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);

        if (isInFirstSet) {
          setActiveIndex(activeIndex + data.length);
        } else {
          setActiveIndex(activeIndex - data.length);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [activeIndex, data.length, isTransitioning]);

  useEffect(() => {
    if (!isTransitioning) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }
  }, [isTransitioning]);

  const handleCardClick = (index) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
  };

  const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;
  const position = activeIndex * ITEM_SIZE;
  const transformValue = centerOffset - position;

  const exactContainerWidth = data.length * ITEM_SIZE - GAP;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        ref={containerRef}
        style={{
          height: "350px",
          maxWidth: "100%",
          width: `${exactContainerWidth}px`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: `${GAP}px`,
            transform: `translateX(${transformValue}px)`,
            // Track transition
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
            width: "max-content",
            paddingLeft: "0px",
            alignItems: "center",
          }}
        >
          {extendedData.map((item, index) => {
            const realIndex = index % data.length;
            const isActive = index === activeIndex;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                style={{
                  width: `${CARD_WIDTH}px`,
                  height: isActive
                    ? `${CARD_WIDTH * (16 / 9)}px`
                    : `${CARD_WIDTH * (6 / 5)}px`,

                  // --- THE FIX IS HERE ---
                  // We only apply the smooth transition if 'isTransitioning' is true.
                  // If we are snapping (false), the height changes INSTANTLY.
                  transition: isTransitioning
                    ? "height 0.5s ease-in-out, opacity 0.5s"
                    : "none",

                  opacity: isActive ? 1 : 0.6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "white",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <img
                  src={item.url}
                  alt={`Card ${realIndex + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(0,0,0,0.3)"
                      : "0 2px 6px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CarouselCards;
