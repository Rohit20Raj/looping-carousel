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
      ...data,
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

  const scrollRight = () => {
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
    const distanceToMove = rightmostLeft - leftmostLeft + cardWidth + 10; // 10px for margin

    // Animate the cards
    cards.forEach((card) => {
      // Get original position
      const rect = card.getBoundingClientRect();

      if (card === leftmostCard) {
        // Move leftmost card to after rightmost (positive distance)
        card.style.transform = `translateX(${distanceToMove}px) scale(0.9)`;
        card.style.zIndex = "10"; // Ensure it's visible during transition
      } else {
        // Move all other cards one position left
        card.style.transform = `translateX(-${cardWidth + 10}px) scale(0.9)`;
      }
      card.style.transition =
        card === leftmostCard ? "none" : "all 0.3s ease-in-out";
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
        card.style.zIndex = ""; // Reset z-index
      });

      // Re-enable animations after a small delay
      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transition =
            "transform 0.3s ease-out, height 0.3s, opacity 0.3s";
        });
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  const scrollLeft = () => {
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
    const distanceToMove = rightmostLeft - leftmostLeft + cardWidth + 10; // 10px for margin

    // Animate the cards
    cards.forEach((card) => {
      // Get original position
      const rect = card.getBoundingClientRect();

      if (card === rightmostCard) {
        // Move rightmost card to before leftmost (negative distance)
        card.style.transform = `translateX(-${distanceToMove}px) scale(0.9)`;
        card.style.zIndex = "10"; // Ensure it's visible during transition
      } else {
        // Move all other cards one position right
        card.style.transform = `translateX(${cardWidth + 10}px) scale(0.9)`;
      }
      card.style.transition =
        card === rightmostCard ? "none" : "all 0.3s ease-in-out";
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
        card.style.zIndex = ""; // Reset z-index
      });

      // Re-enable animations after a small delay
      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transition =
            "transform 0.3s ease-out, height 0.3s, opacity 0.3s";
        });
        setIsAnimating(false);
      }, 50);
    }, 300);
  };

  // Add this function to your component
  const centerCard = (clickedIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Get all card elements
    const cards = cardRefs.current.filter((card) => card);
    if (cards.length === 0) {
      setIsAnimating(false);
      return;
    }

    // Find the clicked card
    const clickedCard = cards[clickedIndex];
    if (!clickedCard) {
      setIsAnimating(false);
      return;
    }

    // Find the center of the container
    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    // Get the current position of the clicked card
    const clickedRect = clickedCard.getBoundingClientRect();
    const clickedCenter = clickedRect.left + clickedRect.width / 2;

    // Calculate how far to move to center the clicked card
    const moveDistance = containerCenter - clickedCenter;

    // Animate all cards
    cards.forEach((card) => {
      const currentTransform = card.style.transform || "scale(0.9)";
      // Extract any existing translateX value (or default to 0)
      const existingTranslate = currentTransform.match(
        /translateX\(([-\d.]+)px\)/
      )
        ? parseFloat(currentTransform.match(/translateX\(([-\d.]+)px\)/)[1])
        : 0;

      // Add the new movement to any existing translation
      const newTranslate = existingTranslate + moveDistance;
      card.style.transform = `translateX(${newTranslate}px) scale(0.9)`;
      card.style.transition = "transform 0.3s ease-out";
    });

    // Update active index to the clicked card
    setActiveIndex(clickedIndex);

    // After animation completes
    setTimeout(() => {
      // Reorder DOM elements to maintain the new visual order
      const container = cards[0]?.parentElement;
      if (container) {
        // Calculate how many positions to shift
        const currentCenterIndex = Math.floor(cards.length / 2);

        // If clicked card is to the left of center
        if (clickedIndex < currentCenterIndex) {
          // Move cards from beginning to end until clicked card is in center
          for (let i = 0; i < currentCenterIndex - clickedIndex; i++) {
            const firstCard = container.firstChild;
            container.appendChild(firstCard);
          }
        }
        // If clicked card is to the right of center
        else if (clickedIndex > currentCenterIndex) {
          // Move cards from end to beginning until clicked card is in center
          for (let i = 0; i < clickedIndex - currentCenterIndex; i++) {
            const lastCard = container.lastChild;
            container.insertBefore(lastCard, container.firstChild);
          }
        }
      }

      // Reset all transforms without transitions
      cards.forEach((card) => {
        card.style.transition = "none";
        card.style.transform = "scale(0.9)";
      });

      // Re-enable animations after a small delay
      setTimeout(() => {
        cards.forEach((card) => {
          card.style.transition =
            "transform 0.3s ease-out, height 0.3s, opacity 0.3s";
        });
        setIsAnimating(false);
      }, 50);
    }, 300);
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
            const centerCardIndex = (index + display) % data.length;
            const isActive = centerCardIndex === activeIndex;

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
                  transition: "height 0.3s, opacity 0.3s",
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
