import React, { useRef, useState, useEffect } from "react";

const CarouselCards = ({ data }) => {
  const scrollRef = useRef();
  const cardRefs = useRef([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(250); // Default width
  const [containerWidth, setContainerWidth] = useState(0);

  const [items, setItems] = useState(() => {
    const display = Math.floor(data.length / 2);
    return [
      ...data.slice(data.length - display),
      // ...data,
      ...data.slice(0, display),
    ];
  });

  const centerItemIndex = Math.floor(data.length / 2);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !container.children.length) return;

    setContainerWidth(container.offsetWidth);

    const firstCard = container.children[0];
    const scrollOffset =
      firstCard.offsetLeft -
      container.offsetWidth / 2 +
      firstCard.offsetWidth / 2;

    container.scrollTo({ left: scrollOffset, behavior: "auto" });
    setActiveIndex(0);

    const card = container.querySelector(".carousel-card");
    if (!card) return;
    if (card) {
      setCardWidth(card.offsetWidth);
    }

    const cardWidth = card.offsetWidth;
    const containerWidth = container.clientWidth;
    const offset = (containerWidth - cardWidth) / 2;
    container.scrollLeft = centerItemIndex * cardWidth - offset;
  }, []);

  const scrollRight = (stopAnimation = true, animationDuration = 0.3) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Get all card elements
    const cards = cardRefs.current.filter((card) => card);
    if (cards.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Find the leftmost card
    let leftmostCard = cards[0];
    let leftmostLeft = leftmostCard.getBoundingClientRect().left;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.left < leftmostLeft) {
        leftmostLeft = rect.left;
        leftmostCard = card;
      }
    });

    // Find the rightmost card and its position
    let rightmostCard = cards[0];
    let rightmostLeft = rightmostCard.getBoundingClientRect().left;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.left > rightmostLeft) {
        rightmostLeft = rect.left;
        rightmostCard = card;
      }
    });

    // Calculate distance from leftmost to rightmost
    const distanceToMove = rightmostLeft - leftmostLeft + cardWidth;

    // Animate the cards
    cards.forEach((card) => {
      // Get original position
      const rect = card.getBoundingClientRect();

      if (card === leftmostCard) {
        // Move leftmost card to after rightmost (positive distance)
        card.style.transform = `translateX(${distanceToMove}px) scale(0.9)`;
        card.style.opacity = 0;
      } else {
        // Move all other cards one position left
        card.style.transform = `translateX(-${cardWidth}px) scale(0.9)`;
      }
      card.style.transition =
        card === leftmostCard
          ? "none"
          : `transform 0.3s linear, height 0.3s ease-in-out`;
    });

    // Update active index
    setActiveIndex((prev) => (prev + 1) % data.length);

    // After animation completes
    setTimeout(() => {
      // Get the container that holds all cards
      const container = cards[0]?.parentElement;
      if (container && leftmostCard) {
        // Move the leftmost card to the end of the container in the DOM
        container.appendChild(leftmostCard);
      }

      // Reset all transforms without transitions
      cards.forEach((card) => {
        card.style.transition = "none";
        card.style.transform = "scale(0.9)";
        card.style.opacity = "1"; // Reset z-index
      });

      // Re-enable animations after a small delay
      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transition = `transform 0.3s linear, height 0.3s ease-in-out`;
        });
        stopAnimation && setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const scrollLeft = (stopAnimation = true) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Get all card elements
    const cards = cardRefs.current.filter((card) => card);
    if (cards.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Find the rightmost card
    let rightmostCard = cards[0];
    let rightmostLeft = rightmostCard.getBoundingClientRect().left;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.left > rightmostLeft) {
        rightmostLeft = rect.left;
        rightmostCard = card;
      }
    });

    // Find the leftmost card and its position
    let leftmostCard = cards[0];
    let leftmostLeft = leftmostCard.getBoundingClientRect().left;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.left < leftmostLeft) {
        leftmostLeft = rect.left;
        leftmostCard = card;
      }
    });

    // Calculate distance from rightmost to leftmost
    const distanceToMove = rightmostLeft - leftmostLeft + cardWidth;

    // Animate the cards
    cards.forEach((card) => {
      // Get original position
      const rect = card.getBoundingClientRect();

      if (card === rightmostCard) {
        // Move rightmost card to before leftmost (negative distance)
        card.style.transform = `translateX(-${distanceToMove}px) scale(0.9)`;
        card.style.opacity = 0;
      } else {
        // Move all other cards one position right
        card.style.transform = `translateX(${cardWidth}px) scale(0.9)`;
      }
      card.style.transition =
        card === rightmostCard
          ? "none"
          : "transform 0.3s linear, height 0.3s ease-in-out";
    });

    // Update active index
    setActiveIndex((prev) => (prev - 1 + data.length) % data.length);

    // After animation completes
    setTimeout(() => {
      // Get the container that holds all cards
      const container = cards[0]?.parentElement;
      if (container && rightmostCard) {
        // Move the rightmost card to the beginning of the container in the DOM
        container.insertBefore(rightmostCard, container.firstChild);
      }

      // Reset all transforms without transitions
      cards.forEach((card) => {
        card.style.transition = "none";
        card.style.transform = "scale(0.9)";
        card.style.opacity = "1"; // Reset z-index
      });

      // Re-enable animations after a small delay
      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transition =
            "transform 0.3s linear, height 0.3s";
        });
        stopAnimation && setIsAnimating(false);
      }, 50);
    }, 300);
  };

  function getShortestCircularDistance(middle, clicked, length = 10) {
    const clockwiseDist = (clicked - middle + length) % length;
    const counterClockwiseDist = clockwiseDist - length;

    // If clockwise is shorter or equal, return positive distance
    if (clockwiseDist <= Math.abs(counterClockwiseDist)) {
      return clockwiseDist;
    } else {
      return counterClockwiseDist; // This will be negative
    }
  }

  const centerCard = (clickedIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Get all card elements
    const cards = cardRefs.current.filter((card) => card);
    if (cards.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Calculate how many positions we need to move
    const display = Math.floor(data.length / 2);
    const positionsToMove = getShortestCircularDistance(
      (activeIndex + display) % data.length,
      clickedIndex,
      data.length
    );

    // If no movement needed (card already centered)
    if (positionsToMove === 0) {
      setIsAnimating(false);
      return;
    }

    // Determine direction and number of steps
    const moveRight = positionsToMove > 0;
    const moveSteps = Math.abs(positionsToMove);

    // Set a fixed total animation time for the entire sequence
    const totalAnimationTime = 300; // 0.3 seconds in ms
    const stepDuration = totalAnimationTime / moveSteps;

    // We'll handle all steps in a single recursive function with tighter timing
    const processStep = (stepsRemaining) => {
      if (stepsRemaining <= 0) {
        setIsAnimating(false);
        return;
      }

      // Last step should finish the animation
      const isLastStep = stepsRemaining === 1;

      if (moveRight) {
        scrollRight(isLastStep, 0.3);
      } else {
        scrollLeft(isLastStep);
      }

      // Schedule next step with precise timing
      if (stepsRemaining > 1) {
        setTimeout(() => {
          processStep(stepsRemaining - 1);
        }, 300);
      }
    };

    // Start the animation sequence
    processStep(moveSteps);
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
            alignItems: "center",
          }}
        >
          {items.map((item, index) => {
            const display = Math.floor(data.length / 2);
            const cardIndex = (index + display) % data.length;
            const isActive = cardIndex === activeIndex;

            return (
              <div
                key={`${item.id}-${index}`}
                className="carousel-card"
                ref={(card) => (cardRefs.current[index] = card)}
                onClick={() => centerCard(index)}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  maxHeight: "100%",
                  width: "250px",
                  height: isActive && !isAnimating ? "400px" : "300px",
                  borderRadius: "12px",
                  border: "1px solid black",
                  backgroundColor: item.color,
                  transition: "height 0.3s",
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
                  {cardIndex}
                  <br />
                  {index}
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
