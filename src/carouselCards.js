import React, { useRef, useState, useEffect, useLayoutEffect } from "react";

const CarouselCards = ({ data = [1, 2, 3] }) => {
  // --- STATE FOR MEASUREMENTS ---
  // We initialize with 0. The carousel will wait until these are populated.
  const [metrics, setMetrics] = useState({ cardWidth: 0, gap: 0 });
  const [containerWidth, setContainerWidth] = useState(0);

  // --- REFS ---
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const firstCardRef = useRef(null); // We only need to measure one card

  const extendedData = [...data, ...data, ...data];
  const middleSetStartIndex = data.length;
  
  const [activeIndex, setActiveIndex] = useState(middleSetStartIndex);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // --- MEASUREMENT LOGIC ---
  useLayoutEffect(() => {
    // 1. Measure Container
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }

    // 2. Measure Card & Gap
    // We check if the track and the first card are rendered
    if (trackRef.current && firstCardRef.current) {
      // Get the exact width from the DOM (includes borders/padding if standard box-model)
      const measuredCardWidth = firstCardRef.current.offsetWidth;

      // Get the gap from the computed CSS of the track
      const trackStyle = window.getComputedStyle(trackRef.current);
      const measuredGap = parseFloat(trackStyle.gap) || 0; // Default to 0 if parsing fails

      // Only update if values differ to prevent loops
      if (
        measuredCardWidth !== metrics.cardWidth ||
        measuredGap !== metrics.gap
      ) {
        setMetrics({
          cardWidth: measuredCardWidth,
          gap: measuredGap,
        });
      }
    }
  }, [data.length, metrics]); // Re-measure if data changes (just in case)

  // Recalculate container width on window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current)
        setContainerWidth(containerRef.current.offsetWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- INFINITE LOOP LOGIC (Standard) ---
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
  }, [activeIndex, data.length, isTransitioning, metrics]);

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

  // --- CALCULATIONS USING MEASURED METRICS ---
  // If measurements are 0, we can't calculate yet, so we default to 0
  const ITEM_SIZE = metrics.cardWidth + metrics.gap;
  const centerOffset = containerWidth / 2 - metrics.cardWidth / 2;
  const position = activeIndex * ITEM_SIZE;
  const transformValue = centerOffset - position;
  const exactContainerWidth = data.length * ITEM_SIZE - metrics.gap;

  // Prevent division by zero or weird rendering before measurement
  const isReady = metrics.cardWidth > 0;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        // Hide everything until we have measured the CSS values
        opacity: isReady ? 1 : 0, 
        transition: "opacity 0.2s ease-in"
      }}
    >
      <div
        ref={containerRef}
        style={{
          // We can't rely on CSS for this specific calculated width
          width: isReady ? `${exactContainerWidth}px` : "100%", 
          maxWidth: "100%",
          height: "350px", 
          position: "relative",
          overflowX: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          ref={trackRef}
          className="carousel-track" // Class defines gap
          style={{
            // Inline style overrides for the animation logic
            transform: `translateX(${isReady ? transformValue : 0}px)`,
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
          }}
        >
          {extendedData.map((item, index) => {
            const isActive = index === activeIndex;
            
            // We use standard styles unless we need to animate specific properties
            // like height, which React needs to control for the "Active" effect.
            return (
              <div
                key={index}
                // Ref attached to first item only for measurement
                ref={index === 0 ? firstCardRef : null} 
                className="carousel-card" // Class defines width
                onClick={() => handleCardClick(index)}
                style={{
                  // React overrides Height for the animation
                  // We use the measured cardWidth to calculate the aspect ratios
                  height: isReady 
                    ? isActive 
                      ? `${metrics.cardWidth * (16 / 9)}px` 
                      : `${metrics.cardWidth * (6 / 5)}px`
                    : "auto", 

                  transition: isTransitioning
                    ? "height 0.5s ease-in-out, opacity 0.5s"
                    : "none",
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <img
                  src={item.url}
                  alt="card"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
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